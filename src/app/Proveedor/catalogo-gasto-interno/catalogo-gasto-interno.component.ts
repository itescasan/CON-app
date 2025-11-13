import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IgxComboComponent, IgxComboModule, IgxIconModule } from 'igniteui-angular';
import { iCuenta } from 'src/app/Interface/Contabilidad/i-Cuenta';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { iGastoInterno } from '../Interface/i-GastoInterno';
import { postGastoInterno } from '../CRUD/POST/postGastoInterno';
import { MatIconModule } from '@angular/material/icon';
import { iProveedor } from 'src/app/Interface/Proveedor/i-proveedor';
import { getGastoInterno } from '../CRUD/GET/getGastosInterno';

@Component({
    selector: 'app-catalogo-gasto-interno',
    imports: [ReactiveFormsModule, IgxComboModule, IgxIconModule, MatIconModule, MatDialogModule],
    templateUrl: './catalogo-gasto-interno.component.html',
    styleUrl: './catalogo-gasto-interno.component.scss'
})
export class CatalogoGastoInternoComponent {
  public val = new Validacion();

  public lstProveedor : iProveedor[] = [];
  public lstCuenta: iCuenta[] = [];
  public esModal : boolean = false;

  @ViewChildren(IgxComboComponent)
  public lstCmb: QueryList<IgxComboComponent>;

  public constructor(private cFunciones: Funciones, private POST : postGastoInterno, private GET: getGastoInterno,){

    this.val.add("txt_Gast_Codigo", "1", "LEN>=", "0", "Costo de Internacion", "");
    this.val.add("cmb_Gast_Estado", "1", "LEN>", "0", "Costo de Internacion", "Seleccione un estado.");
    this.val.add("cmb_Gast_Prov", "1", "LEN>", "0", "Costo de Internacion", "Seleccione un proveedor.");
    this.val.add("txt_Gast_Descripcion", "1", "LEN>", "0", "Costo de Internacion", "Ingrese una descripción.");
    this.val.add("cmb_Gast_Cuenta", "1", "LEN>", "0", "Costo de Internacion", "Ingrese una cuenta.");
    this.val.add("cmb_Gast_Aplica", "1", "LEN>", "0", "Costo de Internacion", "Seleccione una opción de aplicación.");
    this.val.add("cmb_Gast_Tipo", "1", "LEN>", "0", "Costo de Internacion", "Seleccione un tipo.");
    this.V_Evento("Iniciar");
  }
  

  public V_Evento(e: string): void {
    switch (e) {
      case "Iniciar":
        this.esModal = false;
        this.V_Evento("Limpiar");
        this.V_CargarDatos();

        break;

      case "Limpiar":

        this.val.Get("txt_Gast_Codigo").setValue("0");
        this.val.Get("cmb_Gast_Estado").setValue("A");
        this.val.Get("cmb_Gast_Prov").setValue("");
        this.val.Get("txt_Gast_Descripcion").setValue("");
        this.val.Get("cmb_Gast_Aplica").setValue("");
        this.val.Get("cmb_Gast_Tipo").setValue("");

        this.val.Get("txt_Gast_Codigo").disable();
        this.cmb_Gast_Prov?.deselectAllItems();
        this.cmb_Gast_Cuenta?.deselectAllItems();
      
        break;
    }
  }


  
  @ViewChild("cmb_Gast_Prov", { static: false })
  public cmb_Gast_Prov: IgxComboComponent;

  public V_Select_Proveedor(event: any) {

    if (event.added.length == 1) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      let _Item = this.lstProveedor.find(f => f.Codigo == event.newValue[0]);

      this.val.Get("cmb_Gast_Prov").setValue(event.newValue[0]);
      

      this.cmb_Gast_Prov.close();

    }
  }

  public V_Enter_Proveedor(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmb_Gast_Prov.dropdown;
      let _Item: iProveedor = cmb._focusedItem.value;
      this.cmb_Gast_Prov.setSelectedItem(_Item.Codigo);
      this.val.Get("cmb_Gast_Prov").setValue([_Item.Codigo]);
    }
  }




  @ViewChild("cmb_Gast_Cuenta", { static: false })
  public cmb_Gast_Cuenta: IgxComboComponent;

  public V_Select_Cuenta(event: any) {

    if (event.added.length == 1) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      let _Item = this.lstCuenta.find(f => f.CuentaContable == event.newValue[0]);

      this.val.Get("cmb_Gast_Cuenta").setValue(event.newValue[0]);
      

      this.cmb_Gast_Cuenta.close();

    }
  }

  public V_Enter_Cuenta(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmb_Gast_Cuenta.dropdown;
      let _Item: iCuenta = cmb._focusedItem.value;
      this.cmb_Gast_Cuenta.setSelectedItem(_Item.CuentaContable);
      this.val.Get("cmb_Gast_Cuenta").setValue([_Item.CuentaContable]);
    }
  }


  


  public V_CargarDatos(): void {

    document.getElementById("btnRefrescar-Gast")?.setAttribute("disabled", "disabled");

    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );



    this.GET.GetDatos().subscribe(
      {
        next: (data) => {


          dialogRef.close();
          let _json: any = data;

          if (_json["esError"] == 1) {
            if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
            }
          } else {

            let Datos: iDatos[] = _json["d"];
 
            this.lstCuenta = Datos.find(f => f.Nombre == "CUENTAS")?.d;
            this.lstProveedor = Datos.find(f => f.Nombre == "PROVEEDOR")?.d;
      
          }

        },
        error: (err) => {


          document.getElementById("btnRefrescar-Gast")?.removeAttribute("disabled");
          dialogRef.close();
          
          if(this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) 
          {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => { 
          document.getElementById("btnRefrescar-Gast")?.removeAttribute("disabled");
    
        }
      }
    );
  }


  public V_Guardar(): void {


    this.val.add("cmb_Gast_Prov", "1", "LEN>", "0", "Costo de Internacion", "Seleccione un proveedor.");
    
    if(this.val.GetValue("cmb_Gast_Aplica") == "C")
    {
      this.val.replace("cmb_Gast_Prov", "1", "LEN>=", "Costo de Internacion", "");

    }


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

    document.getElementById("btnGuardar-Gast")?.setAttribute("disabled", "disabled");

    let d : iGastoInterno = {} as iGastoInterno;
    d.CODIGO = this.val.GetValue("txt_Gast_Codigo");
    d.ESTADO = this.val.GetValue("cmb_Gast_Estado");
    d.DESCRIPCION = this.val.GetValue("txt_Gast_Descripcion");
    d.CUENTACONTABLE = this.val.GetValue("cmb_Gast_Cuenta");
    d.APLICAREN = this.val.GetValue("cmb_Gast_Aplica");
    d.TIPO = this.val.GetValue("cmb_Gast_Tipo");
    d.COD_PROV = this.val.GetValue("cmb_Gast_Prov");
    
    this.POST.Guardar(d).subscribe(
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

            if(!this.esModal) this.V_Evento("Limpiar");
          }

        },
        error: (err) => {

          document.getElementById("btnGuardar-Gast")?.removeAttribute("disabled");



          dialogRef.close();

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        },
        complete: () => {
          document.getElementById("btnGuardar-Gast")?.removeAttribute("disabled");

        }
      }
    );

  }

  ngOnInit(){
    this.val.ComboOverLay(this.lstCmb, []);

    this.val.addFocus("cmb_Gast_Estado", "cmb_Gast_Prov", undefined);
    this.val.addFocus("cmb_Gast_Prov", "txt_Gast_Descripcion", undefined);
    this.val.addFocus("txt_Gast_Descripcion", "cmb_Gast_Cuenta",undefined);
    this.val.addFocus("cmb_Gast_Cuenta", "cmb_Gast_Aplica", undefined);
    this.val.addFocus("cmb_Gast_Aplica", "cmb_Gast_Tipo", undefined);
    this.val.addFocus("cmb_Gast_Tipo", "btnGuardar", "click");
    

  }
}
