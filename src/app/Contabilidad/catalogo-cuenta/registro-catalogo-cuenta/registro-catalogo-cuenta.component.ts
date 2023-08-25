import { Component } from '@angular/core';
import { CatalogoCuentaComponent } from '../nuevo-catalogo-cuenta/catalogo-cuenta.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Validacion } from 'src/SHARED/class/validacion';
import { WaitComponent } from 'src/SHARED/componente/wait/wait.component';
import { getCuentaContable } from '../CRUD/GET/get-CatalogoCuenta';
import { DialogErrorComponent } from 'src/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/SHARED/interface/i-Datos';
import { iCuenta } from 'src/app/Interface/i-Cuenta';

@Component({
  selector: 'app-registro-catalogo-cuenta',
  templateUrl: './registro-catalogo-cuenta.component.html',
  styleUrls: ['./registro-catalogo-cuenta.component.scss']
})
export class RegistroCatalogoCuentaComponent {

  public val = new Validacion();

  private lstCuenta : iCuenta[] =  []
  public lstFilter: any[] = [];
  public Pag : number = 1;
  public PagMax : number = 1;
  private NumRegMax : number = 100;
  private TotalReg : number = 0

  constructor(
    private DIALOG: MatDialog, private GET: getCuentaContable
  ) {
    this.val.add("txtBuscar-Cuenta", "1", "LEN>=", "0", "Buscar", "");

    this.v_CargarDatos();
  }


  public v_Editar(e : any) : void{

    let dialogRef: MatDialogRef<CatalogoCuentaComponent> = this.DIALOG.open(
      CatalogoCuentaComponent,
      {
        panelClass: window.innerWidth < 576 ? "escasan-dialog-full" : "",
        //height:  window.innerWidth < 992 ? "100%" : "80%",
        //width:  window.innerWidth < 992 ? "100%" : "60%",
        disableClose: true
      }
    );
    
       
    dialogRef.afterOpened().subscribe(s =>{
      dialogRef.componentInstance.esModal = true;
    });

   

  }



  public v_Filtrar(event : any){

    this.lstFilter.splice(0, this.lstFilter.length);
    let value : string = event.target.value.toLowerCase();
 

    let index : number = 1;
    this.lstCuenta.filter(f => f.Filtro.toLowerCase().includes(value)).forEach(f =>{
      let ff = Object.assign({}, f);
      ff.Index = index;
      this.lstFilter.push(ff);
      index++;
    });

    let Registros = this.lstFilter.map((obj : any) => ({...obj}));
    this.lstFilter.splice(0, this.lstFilter.length);

    this.PagMax = Math.trunc(Registros.length / this.NumRegMax);
    if((Registros.length % this.NumRegMax) != 0) this.PagMax++;

    let x : number = 1;
    let IndexMin : number =  (this.Pag * this.NumRegMax) - (this.NumRegMax - 1);
    let IndexMax : number =  (this.Pag * this.NumRegMax);


    Registros.filter(f => f.Index >= IndexMin && f.Index <= IndexMax).forEach(f =>{
      this.lstFilter.push(f);

      if(x == this.NumRegMax) return;
      x++;
    });


  }

  
  public v_Paginar(){

    this.PagMax = Math.trunc(this.lstCuenta.length / this.NumRegMax);
    if((this.lstCuenta.length % this.NumRegMax) != 0) this.PagMax++;
  
    

    this.lstFilter.splice(0, this.lstFilter.length);

    let x : number = 1;
    let IndexMin : number =  (this.Pag * this.NumRegMax) - (this.NumRegMax - 1);
    let IndexMax : number =  (this.Pag * this.NumRegMax);

    this.lstCuenta.filter(f => f.Index >= IndexMin && f.Index <= IndexMax).forEach(f =>{
      
      let ff = Object.assign({}, f);
      this.lstFilter.push(ff);

      if(x == this.NumRegMax) return;
      x++;
    });

  }

  public v_Pag(p : string) :void{

    let IndexMax : number =  0;


    if(p =="A")
    {
      IndexMax =  ((this.Pag - 1) * this.NumRegMax);
      if(this.lstCuenta.length < IndexMax) return;

      if(this.Pag > 1)this.Pag -=1;
      this.v_Paginar();
      return;
    }

    if(p =="S")
    {
      IndexMax = ((this.Pag + 1) * this.NumRegMax);
      if(this.lstCuenta.length < IndexMax) return;

      if(this.Pag < 5)this.Pag +=1;
      this.v_Paginar();
      return;
    }
    this.Pag = Number(p);
    this.v_Paginar();
  }



  public v_CargarDatos(): void {


    let dialogRef: MatDialogRef<WaitComponent> = this.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );



    this.GET.Get().subscribe(
      {
        next: (data) => {


          dialogRef.close();
          let _json: any = data;

          if (_json["esError"] == 1) {
            this.DIALOG.open(DialogErrorComponent, {
              data: _json["msj"].Mensaje,
            });
          } else {

            let datos : iDatos[] = _json["d"];

            this.lstCuenta = datos[0].d;
            this.TotalReg = this.lstCuenta.length;

            this.PagMax = this.TotalReg / this.NumRegMax;
            alert(this.PagMax)

            return
            let i : number = 1;
            this.lstCuenta.forEach(f =>{
              f.Index = i;
              i++;
            });

            this.lstFilter = this.lstCuenta.map((obj : any) => ({...obj}));
            this.v_Paginar();


          }

        },
        error: (err) => {


          dialogRef.close();

          this.DIALOG.open(DialogErrorComponent, {
            data: "<b class='error'>" + err.message + "</b>",
          });

        },
        complete: () => { }
      }
    );


  }


}
