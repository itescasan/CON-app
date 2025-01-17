import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { iLogin } from '../interface/i-login';
import { Funciones } from '../class/cls_Funciones';
import { interval, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { getServidor } from '../GET/get-servidor';
import { WaitComponent } from '../componente/wait/wait.component';
import { DialogErrorComponent } from '../componente/dialog-error/dialog-error.component';
import { iDatos } from '../interface/i-Datos';
import { DialogoConfirmarComponent } from '../componente/dialogo-confirmar/dialogo-confirmar.component';
import { DialogInputComponent } from '../componente/dialog-input/dialog-input.component';
import { postServidor } from '../POST/post-servidor';

@Injectable({
  providedIn: 'root'
})
export class LoginService {



  constructor(private _Router: Router, private cFunciones: Funciones,
    private DIALOG: MatDialog, private GET: getServidor, private POST: postServidor) { }


  public Session(user: string, pwd: string): void {

    document.getElementById("btnLogin")?.setAttribute("disabled", "disabled");

    let dialogRef: MatDialogRef<WaitComponent> = this.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.GET.Login(user, pwd).subscribe(
      {
        next: (data) => {


          dialogRef.close();
          let _json: any = data;

          if (_json["esError"] == 1) {
            this.DIALOG.open(DialogErrorComponent, {
              data: _json["msj"].Mensaje,
            });
          } else {

            let datos: iDatos[] = _json["d"];

            let l: iLogin = datos[0].d[0];
            this.cFunciones.User = l.User;
            this.cFunciones.Nombre = l.Nombre;
            this.cFunciones.Rol = l.Rol;
            this.cFunciones.FechaServidor(datos[1].d);
            this.cFunciones.SetTiempoDesconexion(Number(datos[2].d));
            l.FechaServer = datos[1].d;
            l.TimeOut = Number(datos[2].d);

            localStorage.removeItem("CON_login");

            if (datos[0].d != undefined) {
              localStorage.setItem("CON_login", JSON.stringify(l));

              this.isLogin(true);
            }


          }

        },
        error: (err) => {

          document.getElementById("btnLogin")?.removeAttribute("disabled");

          dialogRef.close();

          if (this.DIALOG.getDialogById("error-servidor") == undefined) {
            this.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnLogin")?.removeAttribute("disabled");

        }
      }
    );


  }


  public isLogin(MostrarConfirmar: boolean) {

    let s: string = localStorage.getItem("CON_login")!;

    if (s != undefined) {

      let l: iLogin = JSON.parse(s);


      if (this.cFunciones.User == "") {
        this.cFunciones.User = l.User;
        this.cFunciones.Nombre = l.Nombre;
        this.cFunciones.Rol = l.Rol;
        this.cFunciones.FechaServidor(new Date(l.FechaServer));
        this.cFunciones.SetTiempoDesconexion(l.TimeOut);
      }


      if (this.Diff(new Date(l.FechaLogin)) <= this.cFunciones.TiempoDesconexion()) {

        if (this._Router.url !== '/Menu') {



          if (MostrarConfirmar) {


            let dialogRef: MatDialogRef<DialogInputComponent> = this.cFunciones.DIALOG.open(
              DialogInputComponent,
              {
                panelClass: window.innerWidth < 992 ? "escasan-dialog-full" : "escasan-dialog",
                disableClose: true
              }
            );




            dialogRef.afterOpened().subscribe(s => {


              //if (MostrarConfirmar) dialogRef.componentInstance.value = l.CON_CodMail;
              dialogRef.componentInstance.SetMensajeHtml("<b>Ingrese el codigo que se le envio al correo.</b>");
              dialogRef.componentInstance.MostrarCerrar = false;
              dialogRef.componentInstance.placeholder = "Ingrese le codigo que se le envio al correo.";
              dialogRef.componentInstance.label = "Codigo Confirmacion";
              dialogRef.componentInstance.textBoton1 = "VALIDAR";
              dialogRef.componentInstance.textBoton2 = "CANCELAR";
              dialogRef.componentInstance.Set_StyleBtn1("width: 110px");
              dialogRef.componentInstance.Set_StyleBtn2("width: 110px");

            });


            dialogRef.afterClosed().subscribe(s => {

              if (dialogRef.componentInstance.retorno == "1") {
                l.CON_CodMail = dialogRef.componentInstance.value;
                this.ValidarCodigo(l, true);

              }
              else {


                localStorage.removeItem("CON_login");
                l.CON_CodMail = "";
                localStorage.setItem("CON_login", JSON.stringify(l));
              }



            });


          }
          else {

            this.ValidarCodigo(l, false)


          }


        }

        return;
      }

    }

    localStorage.removeItem("CON_login");
    this._Router.navigate(['/Login'], { skipLocationChange: false });
  }



  private ValidarCodigo(l: iLogin, DesdeConfirmar: boolean) {

    this.GET.ValidarCodigo(l.User, l.CON_CodMail).subscribe(
      {
        next: (data) => {



          let _json: any = data;

          if (_json["esError"] == 1) {



            if (DesdeConfirmar) {


              let dialog = this.DIALOG.open(DialogErrorComponent, {
                data: _json["msj"].Mensaje,
              });

              dialog.afterClosed().subscribe(s => {
                this.isLogin(true);
              });
            }
            else {
              localStorage.removeItem("CON_login");
              this._Router.navigate(['/Login'], { skipLocationChange: false });
            }




          } else {

            let datos: iDatos = _json["d"];
            localStorage.removeItem("CON_login");
            l.CON_CodMail = datos.d;

            localStorage.setItem("CON_login", JSON.stringify(l));

            if (l.CON_CodMail != "" && l.CON_CodMail != undefined) {
              this._Router.navigate(['/Menu'], { skipLocationChange: false });
            }
            else {
              localStorage.removeItem("CON_login");
            }


          }

        },
        error: (err) => {



          if (this.DIALOG.getDialogById("error-servidor") == undefined) {
            this.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {

        }
      }
    );


  }


  Diff(FechaLogin: Date) {
    let FechaServidor: Date = new Date(this.cFunciones.FechaServer);

    var Segundos = Math.abs((FechaLogin.getTime() - FechaServidor.getTime()) / 1000);
    return Segundos;
  }


  public UpdFecha(f: string) {

    let s: string = localStorage.getItem("CON_login")!;

    if (s != undefined) {

      let l: iLogin = JSON.parse(s);
      l.FechaLogin = f;
      localStorage.removeItem("CON_login");
      localStorage.setItem("CON_login", JSON.stringify(l));

      this.isLogin(false);
    }

  }

  public CerrarSession() {


    let dialogRef: MatDialogRef<WaitComponent> = this.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.POST.CerrarSession(this.cFunciones.User).subscribe(
      {
        next: (data) => {


          dialogRef.close();
          let _json: any = data;

          if (_json["esError"] == 1) {
            this.DIALOG.open(DialogErrorComponent, {
              data: _json["msj"].Mensaje,
            });
          } else {

            localStorage.removeItem("CON_login");
            this._Router.navigate(['/Login'], { skipLocationChange: false });

          }

        },
        error: (err) => {


          dialogRef.close();

          if (this.DIALOG.getDialogById("error-servidor") == undefined) {
            this.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
     
        }
      }
    );




  }


  public V_Version() {
    this.GET.Version();
  }

}
