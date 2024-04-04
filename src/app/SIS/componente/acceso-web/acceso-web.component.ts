import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GlobalPositionStrategy, IgxComboComponent, IgxComboModule, IgxIconModule, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { CommonModule } from '@angular/common';
import { iPerfil } from 'src/app/SHARED/interface/i-Perfiles';
import { iUsuario } from '../../Interface/Usuario';
import { getServidor } from 'src/app/SHARED/GET/get-servidor';
import { postServidor } from 'src/app/SHARED/POST/post-servidor';

@Component({
  selector: 'app-acceso-web',
  standalone: true,
  imports: [IgxComboModule, IgxIconModule, ReactiveFormsModule, MatPaginatorModule, MatTableModule, CommonModule, FormsModule],
  templateUrl: './acceso-web.component.html',
  styleUrl: './acceso-web.component.scss'
})
export class AccesoWebComponent {

  public val = new Validacion();
  displayedColumns: string[] = ["Caption"];
  public lstPerfil: MatTableDataSource<iPerfil>;
  public lstDatosPerfil: any[] = [];

  @ViewChild("cmbUsuario", { static: false })
  public cmbUsuario: IgxComboComponent;

  public lstUsuario: iUsuario[] = [];
  public overlaySettings: OverlaySettings = {};


  constructor(
    private cFunciones: Funciones, private GET : getServidor, private POST : postServidor
  ) {

    this.val.add("cmbUsuario", "1", "LEN>", "0", "Usuario", "Seleccione un usuario.");

    this.V_Limpiar();
    this.V_CargarDatos();
  }


  public v_Select_Usuario(event: any): void {

    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      if (window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbUsuario.close();

      this.val.Get("cmbUsuario").setValue(event.newValue[0]);
      this.LlenarDatos();

    }
  }

  public v_Enter_Usuario(event: any) {

    if (event.key == "Enter") {
      let cmb: any = this.cmbUsuario.dropdown;
      let _Item: iUsuario = cmb._focusedItem.value;
      this.cmbUsuario.select([_Item.Usuario]);
    }
  }



  public v_Filtrar(event: any) {
    this.lstPerfil.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  
  public V_Limpiar(): void {


    this.cmbUsuario?.deselectAllItems();
    this.val.Get("cmbUsuario").setValue("");
    this.LlenarDatos();

  }



  public V_Guardar(): void {


    this.val.EsValido();



    if (this.val.Errores != "") {
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: this.val.Errores,
      });

      return;
    }



    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );



    
    this.POST.GuardarAcceso(this.lstPerfil.data).subscribe(
      {
        next: (s) => {


          dialogRef.close();
          let _json = JSON.parse(s);

          if (_json["esError"] == 1) {
            if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
            }
          }
          else {

           let Datos: iDatos = _json["d"];



            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor-msj",
              data: Datos.d,
            });

            this.V_Limpiar();
            this.V_CargarDatos();

       
          }

        },
        error: (err) => {

          document.getElementById("liberar-inventario-bonif")?.removeAttribute("disabled");



          dialogRef.close();

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        },
        complete: () => {
          document.getElementById("liberar-inventario-bonif")?.removeAttribute("disabled");

        }
      }
    );


  }



  public V_CargarDatos(): void {
    document.getElementById("btnRefresscar-acceso-web")?.setAttribute("disabled", "disabled");

    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );


    this.GET.AccesoWeb(this.cFunciones.User).subscribe(
      {
        next: (s) => {

          document.getElementById("btnRefresscar-acceso-web")?.removeAttribute("disabled");
          dialogRef.close();
          let _json = JSON.parse(s);

          if (_json["esError"] == 1) {
            if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
            }
          } else {
            let Datos: iDatos[] = _json["d"];

            this.lstUsuario = Datos[0].d;
            this.lstDatosPerfil = Datos[1].d;
            this.LlenarDatos();
            
           
  
          }

        },
        error: (err) => {
          document.getElementById("btnRefresscar-acceso-web")?.removeAttribute("disabled");
          dialogRef.close();

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
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


  private LlenarDatos()
  {
    this.lstPerfil = new MatTableDataSource(this.cFunciones.ACCESO);

    if(this.cmbUsuario?.select.length > 0)
    {
      
      let Acc : any[] = Object.assign([], this.cFunciones.ACCESO);

      Acc.forEach(f =>{
        
        let u : string = this.val.Get("cmbUsuario").value;
        let i = this.lstDatosPerfil.findIndex((w : any) => w.Usuario == u && w.Id == f.Id && w.Activo && f.Modulo == "CON");
        f.Activo = false;
        f.IdAcceso = -1;
        f.Usuario = this.cFunciones.User;
        if(i != -1) 
        {
          f.Activo = true;
          f.IdAcceso = this.lstDatosPerfil[i].IdAcceso;
        }
      });


      this.lstPerfil = new MatTableDataSource(Acc);
      this.lstPerfil._updateChangeSubscription();
            
    }
  }


  V_Activar(checked: any, element : any): void {

    if(element.MenuPadre == "") return;

    
    let i : number = this.lstPerfil.data.findIndex(f => f.MenuPadre == element.MenuPadre && f.Activo && f.Modulo == "CON");
    let p = this.lstPerfil.data.findIndex(f => f.Id == element.MenuPadre );
    this.lstPerfil.data[p].Activo = false;
    if(i != -1) this.lstPerfil.data[p].Activo = true;

  }


  ngDoCheck() {


   

    this.overlaySettings = {};

    if (window.innerWidth <= this.cFunciones.TamanoPantalla("md")) {
      this.overlaySettings = {
        positionStrategy: new GlobalPositionStrategy({ openAnimation: scaleInCenter, closeAnimation: scaleOutCenter }),
        modal: true,
        closeOnOutsideClick: true
      };
    }

  }





}
