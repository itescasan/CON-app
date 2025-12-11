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
//import { iPerfil } from 'src/app/SHARED/interface/i-Perfiles';
import { iUsuario } from 'src/app/SIS/Interface/Usuario';
import { getCajaChica } from './CRUD/GET/get-CajaChica';
import { postAccesoCajaChica } from './CRUD/POST/post-Caja-Chica';
import { iAccesoCaja } from 'src/app/Interface/Contabilidad/i-AccesoCajaChica';

@Component({
    selector: 'app-acceso-caja',
    templateUrl: './acceso-caja.component.html',
    styleUrl: './acceso-caja.component.scss',
    standalone: false
})
export class AccesoCajaComponent {

  public val = new Validacion();
  displayedColumns: string[] = ["NombreCuenta"];
  public lstAccesoCajachica: MatTableDataSource<iAccesoCaja>;
  public lstDatosCuenta: any[] = [];
  public lstDatosPerfil: any[] = [];

  @ViewChild("cmbUsuario", { static: false })
  public cmbUsuario: IgxComboComponent;

  public lstUsuario: iUsuario[] = [];
  public overlaySettings: OverlaySettings = {};


  constructor(
    private cFunciones: Funciones, private GET : getCajaChica, private POST : postAccesoCajaChica
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
      this.cmbUsuario.close();
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
    this.lstAccesoCajachica.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
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

    document.getElementById("btnGuardar-acceso")?.setAttribute("disabled", "disabled");

    
    this.POST.GuardarAccesoCajaChica(this.lstAccesoCajachica.data).subscribe(
      {
        next: (data) => {


          dialogRef.close();
          let _json : any = data;

          
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

          document.getElementById("btnGuardar-acceso")?.removeAttribute("disabled");



          dialogRef.close();

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        },
        complete: () => {
          document.getElementById("btnGuardar-acceso")?.removeAttribute("disabled");

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


    this.GET.AccesoCajaChica(this.cFunciones.User).subscribe(
      {
        next: (data) => {

          document.getElementById("btnRefresscar-acceso-web")?.removeAttribute("disabled");
          dialogRef.close();
          let _json = data;

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
            this.lstDatosCuenta = Datos[2].d;
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
    this.lstAccesoCajachica = new MatTableDataSource(this.lstDatosPerfil);

    if(this.cmbUsuario?.select.length > 0)
    {
      
      let Acc : any[] = Object.assign([], this.lstDatosCuenta);

      Acc.forEach(f =>{
        
        let u : string = this.val.Get("cmbUsuario").value;
        let i = this.lstDatosPerfil.findIndex((w : any) => w.Usuario == u && w.CuentaContable == f.CuentaContable && w.Activo == 1 && w.NombreCuenta == f.NombreCuenta);
        let x = this.lstDatosPerfil.findIndex((w : any) => w.Usuario == u && w.CuentaContable == f.CuentaContable);
        f.Activo = false;
        //f.IdAcceso = -1;
        f.Serie = "";
        f.Usuario = u;
        if(i != -1) 
        {
          f.Activo = true;
          f.IdAcceso = this.lstDatosPerfil[i].IdAcceso;
        } 
        // if (x != -1) {
         
        // }       

      });


      this.lstAccesoCajachica = new MatTableDataSource(Acc);
      this.lstAccesoCajachica._updateChangeSubscription();
            
    }
  }


  V_Activar(checked: any, element : any): void {    
    
    let i : number = this.lstAccesoCajachica.data.findIndex(f => f.CuentaContable == element.CuentaContable && f.NombreCuenta == element.NombreCuenta);   
    this.lstAccesoCajachica.data[i].Activo = element.Activo;  

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

