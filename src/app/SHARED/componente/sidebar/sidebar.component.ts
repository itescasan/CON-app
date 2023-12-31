import { Component, HostListener, Input, Inject, Renderer2, ViewChild, ComponentRef } from '@angular/core';
import { DynamicFormDirective } from '../../directive/dynamic-form.directive';
import * as $ from 'jquery';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { getServidor } from '../../GET/get-servidor';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';
import { iDatos } from '../../interface/i-Datos';
import { Funciones } from '../../class/cls_Funciones';
import { CatalogoCuentaComponent } from 'src/app/Contabilidad/catalogo-cuenta/nuevo-catalogo-cuenta/catalogo-cuenta.component';
import { RegistroCatalogoCuentaComponent } from 'src/app/Contabilidad/catalogo-cuenta/registro-catalogo-cuenta/registro-catalogo-cuenta.component';
import { EjercicioFiscalComponent } from 'src/app/Contabilidad/ejercicio-fiscal/nuevo-ejercicio-fiscal/ejercicio-fiscal.component';
import { Subscription, interval } from 'rxjs';
import { AsientoContableComponent } from 'src/app/Contabilidad/asiento-contable/nuevo-asiento-contable/asiento-contable/asiento-contable.component';
import { RegistroAsientoContableComponent } from 'src/app/Contabilidad/asiento-contable/registro-asiento-contable/registro-asiento-contable.component';
import { RegistroEjercicioFiscalComponent } from 'src/app/Contabilidad/ejercicio-fiscal/registro-ejercicio-fiscal/registro-ejercicio-fiscal.component';
import { AuxiliarCuentaComponent } from 'src/app/Contabilidad/auxiliar-cuenta/auxiliar-cuenta.component';
import { TransferenciaCuentaComponent } from 'src/app/Contabilidad/Operaciones-bancarias/transferencia-cuenta/transferencia-cuenta.component';
import { RegistroTrasnferenciaComponent } from 'src/app/Contabilidad/Operaciones-bancarias/registro-trasnferencia/registro-trasnferencia.component';
import { NuevoChequeComponent } from 'src/app/Contabilidad/Operaciones-bancarias/nuevo-cheque/nuevo-cheque.component';
import { RegistroChequesComponent } from 'src/app/Contabilidad/Operaciones-bancarias/registro-cheques/registro-cheques.component';
import { TransferenciaSaldoComponent } from 'src/app/Contabilidad/Operaciones-bancarias/transferencia-saldo/transferencia-saldo.component';
import { ChequesSaldoComponent } from 'src/app/Contabilidad/Operaciones-bancarias/cheque-saldo/cheque-saldo.component';
import { BalanzaComponent } from 'src/app/Reporte/balanza/balanza.component';
import { BalanceGeneralComponent } from 'src/app/Reporte/balance-general/balance-general.component';

const SCRIPT_PATH = 'ttps://cdn.jsdelivr.net/npm/bootstrap5-toggle@5.0.4/css/bootstrap5-toggle.min.css';
declare let gapi: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  @ViewChild(DynamicFormDirective, { static: true }) DynamicFrom!: DynamicFormDirective;
  public ErrorServidor : boolean = false;
  
  subscription: Subscription = {} as Subscription;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: HTMLDocument,
    private _SrvLogin: LoginService,
    private Conexion: getServidor,
    private cFunciones : Funciones
  ) {
}
  

  @Input() public href: string | undefined;
  @HostListener('click', ['$event']) public onClick(event: Event): void {

    var element = <HTMLElement>event.target;
  
    if (
      (!this.href ||
      this.href == '#' ||
      (this.href && this.href.length === 0) || element.tagName.toString().toLocaleLowerCase()  == "i")
    ) {
     
   
      if (element.tagName.toString().toLocaleLowerCase() == "a" && element.getAttribute("href") == "#" || (element.tagName.toString().toLocaleLowerCase()  == "i" || element.tagName.toString().toLocaleLowerCase()  == "span")) {
        
        if(element.tagName.toString().toLocaleLowerCase()  == "i" || element.tagName.toString().toLocaleLowerCase()  == "span"){
          element = <HTMLElement>event.target;
          element = <HTMLElement>element.parentElement;
          
        }

        this.v_Abrir_Form(element.id);
      }


      
      if (element.tagName.toString().toLocaleLowerCase() == "span") event.preventDefault();

      if(element.tagName.toString().toLocaleLowerCase() == "a")event.preventDefault();
     
    }
  }




  
  public v_Abrir_Form(id : string) : void{

    

    if(id == "") return;
    if(id == "btnMenu") return;


    if(this.ErrorServidor && id != "aSalir"){
      this.cFunciones.DIALOG.closeAll();
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: "<b class='error'>" + "Error al conectar con el servidor, por favor recargue la pagina o cierre sessión." + "</b>",
      });
      return;
    }
    
    if(id == "aNewInicio"){
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();

      //this.DynamicFrom.viewContainerRef.createComponent(SidebarComponent);

    }

    if(id == "aNewEjercicio"){
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();

      this.DynamicFrom.viewContainerRef.createComponent(EjercicioFiscalComponent);

    }

    if(id == "aRegEjercicio"){
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();

      let RegCuenta: ComponentRef<RegistroEjercicioFiscalComponent> = this.DynamicFrom.viewContainerRef.createComponent(RegistroEjercicioFiscalComponent);

    }


    if(id == "aNewCuenta"){
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();

      let CatalogoCuenta: ComponentRef<CatalogoCuentaComponent> = this.DynamicFrom.viewContainerRef.createComponent(CatalogoCuentaComponent);

    }

    if(id == "aRegCuenta"){
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();

      let RegCuenta: ComponentRef<RegistroCatalogoCuentaComponent> = this.DynamicFrom.viewContainerRef.createComponent(RegistroCatalogoCuentaComponent);

    }



    if(id == "aNewAsiento"){
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();

      let CatalogoCuenta: ComponentRef<AsientoContableComponent> = this.DynamicFrom.viewContainerRef.createComponent(AsientoContableComponent);

    }

    if(id == "aRegAsiento"){
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();

      let RegCuenta: ComponentRef<RegistroAsientoContableComponent> = this.DynamicFrom.viewContainerRef.createComponent(RegistroAsientoContableComponent);

    }


    if(id == "aAuxiliar"){
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();

      let Auxiliar: ComponentRef<AuxiliarCuentaComponent> = this.DynamicFrom.viewContainerRef.createComponent(AuxiliarCuentaComponent);

    }




    
    if(id == "aNewTransferenciaCuenta"){
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();

      let TransfCuenta: ComponentRef<TransferenciaCuentaComponent> = this.DynamicFrom.viewContainerRef.createComponent(TransferenciaCuentaComponent);

    }

     
    if(id == "aNewTransferenciaSaldo"){
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();

      let TransfSaldo: ComponentRef<TransferenciaSaldoComponent> = this.DynamicFrom.viewContainerRef.createComponent(TransferenciaSaldoComponent);

    }



    if(id == "aRegTransferencia"){
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();

      let RegTransfCuenta: ComponentRef<RegistroTrasnferenciaComponent> = this.DynamicFrom.viewContainerRef.createComponent(RegistroTrasnferenciaComponent);

    }

    if(id == "aNewCheque"){
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();

      let NuevoCheque: ComponentRef<NuevoChequeComponent> = this.DynamicFrom.viewContainerRef.createComponent(NuevoChequeComponent);

    }

    if(id == "aNewChequeSaldo"){
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();

      let NuevoChequeSaldo: ComponentRef<ChequesSaldoComponent> = this.DynamicFrom.viewContainerRef.createComponent(ChequesSaldoComponent);

    }


    if(id == "aRegCheques"){
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();

      let RegCheques: ComponentRef<RegistroChequesComponent> = this.DynamicFrom.viewContainerRef.createComponent(RegistroChequesComponent);

    }
    

    if(id == "aBalanzaComprobacion"){
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();

      let BalanzaComp: ComponentRef<BalanzaComponent> = this.DynamicFrom.viewContainerRef.createComponent(BalanzaComponent);

    }


    if(id == "aBalanceGeneral"){
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();

      let BalanceGen: ComponentRef<BalanceGeneralComponent> = this.DynamicFrom.viewContainerRef.createComponent(BalanceGeneralComponent);

    }

    


    if(id == "aSalir"){
      this.ErrorServidor = true;
     this._SrvLogin.CerrarSession();
  
    }
  }
  

  private ActualizarDatosServidor() : void{
    this.ErrorServidor = false;


    this.Conexion.DatosServidor(this.cFunciones.User).subscribe(
      {
        next : (data) => {
          
          let _json : any = data;

        if (_json["esError"] == 1) {

          if(this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined){
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor-msj",
              data: _json["msj"].Mensaje,
            });
          }
         
        } else {
          let Datos: iDatos[] = _json["d"];

          this.cFunciones.FechaServidor(Datos[0].d);
          this.cFunciones.SetTiempoDesconexion(Number(Datos[1].d));
          this._SrvLogin.UpdFecha(String(Datos[0].d));
          if(Datos[2].d != undefined)this.cFunciones.MonedaLocal = Datos[2].d;
          this.cFunciones.TC = Datos[3].d;
          

        }

          if(this.cFunciones.DIALOG.getDialogById("error-servidor") != undefined) 
          {
            this.cFunciones.DIALOG.getDialogById("error-servidor")?.close();
          }


        },
        error: (err) => {
         
          this.ErrorServidor = true;
        
          
          if(this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) 
          {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id : "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
       

        },
        complete : ( ) => { 

        }
      }
    );
    
  }


  
  ngOnInit() {

    this.subscription = interval(10000).subscribe(val => this.ActualizarDatosServidor())
    
    //INSERTAR SCRIPT
    /*
    const script = this.renderer.createElement("script");
    this.renderer.setProperty(
      script,
      "text",
      "alert('asdsa')"
    );
    this.renderer.appendChild(this.document.body, script);
*/
    //FIN



  }

  ngAfterContentInit() {
    $("#btnMenu").trigger("click"); // MOSTRAR MENU DESDE EL INICIO


    var myOffcanvas = document.getElementById('offcanvas');
     myOffcanvas!.addEventListener('show.bs.offcanvas', this.V_MostrarBoton);
     myOffcanvas!.addEventListener('hidden.bs.offcanvas', this.V_OcultarBoton);
  }


  private V_MostrarBoton(){
    $("#btnMenu").removeClass("start");
    
  }

  private V_OcultarBoton(){
    $("#btnMenu").addClass("start");
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();

  }

}



