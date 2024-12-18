import {
  AbstractControl,
  UntypedFormControl,
  ValidatorFn,
  FormGroupDirective,
  NgForm,
  FormControl,
  FormBuilder,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

import { formatDate, formatNumber } from "@angular/common";
import { GlobalPositionStrategy, IgxComboComponent, OverlaySettings } from "igniteui-angular";
import { QueryList } from "@angular/core";
import { IComboSelectionChangingEventArgs } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from "igniteui-angular/animations";

var KeyPress : string = "";


function getRectArea(elmento: HTMLElement) {

  let _element_next = (KeyPress == "Enter"?  lstFocus : lstTabFocus).find(f => f.Id == elmento.id)!;
  if (_element_next == undefined) return elmento;

  elmento = document?.getElementById(_element_next.IdNext)!;

  if (elmento.getAttribute("disabled") == undefined) return elmento;



  return getRectArea(elmento)

}



function onKeyEnter(event: any) {

  KeyPress = "";
  if (event.key !== "Enter" && event.key != "Tab") return;
  KeyPress = event.key;


  let id: string = event.target.id;

  if (id == "" && event.target.name == "comboInput") {
    id = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.id;
    event.target.setAttribute("id", id);
  }

  if (id == "" && event.target.localName == "input") {
    id = event.target.parentElement.parentElement.parentElement.parentElement.id;
    event.target.setAttribute("id", id);
  }


  

  let _element_next = (KeyPress == "Enter"?  lstFocus : lstTabFocus).find(f => f.Id == id);

  if (_element_next == undefined) return;
  if (_element_next.IdNext == "") return;

  let elmento: HTMLElement = document?.getElementById(id)!;

  if (cmb != undefined && elmento.localName == "igx-combo") {
    let combo: IgxComboComponent = cmb.find(f => f.id == id)!;
    combo.close();
  }





  elmento = document?.getElementById(_element_next.Id)!;
  elmento = getRectArea(elmento);





  elmento?.focus();



  if (cmb != undefined && elmento.localName == "igx-combo") {

    let elment: IgxComboComponent = cmb.find(f => f.id == _element_next?.IdNext)!;

    if (elment != undefined) elment.open();

    let __next = (KeyPress == "Enter"?  lstFocus : lstTabFocus).find(f => f.Id == _element_next?.IdNext);



    elment.searchInput.nativeElement.setAttribute("id", __next?.Id!);
    elment.searchInput.nativeElement.addEventListener('keypress', onKeyEnter)




  }


  if (elmento.localName == "igx-date-picker") {
    let _input_Picker: HTMLElement = elmento.getElementsByTagName("input")[0];
    _input_Picker?.focus();
  }





  if (_element_next.Evento != undefined) $("#" + _element_next.IdNext)?.trigger(_element_next.Evento);




  event.preventDefault();

}




/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: UntypedFormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

class ReglasValidacion {
  public Id: string = "";
  public Regla: string = "";
  public Condicon: string = "";
  public valor: string = "";
  public Mensaje: string = "";
  public Index: string = "";
  public Etiqueta: string = "";
  public ErrorMensaje: string = "";
}

interface I_Frm {
  Id: string;
  Frm: FormControl;
  Etiqueta: string;
}

interface iFocus {
  Id: string;
  IdNext: string;
  Evento: any;
}

interface iFormat {
  Id: string;
  Decimal: number;
}


const lstFocus: iFocus[] = [];
const lstTabFocus: iFocus[] = [];
const lstFormat: iFormat[] = [];
let cmb: IgxComboComponent[] = [];

export class Validacion {


  private overlaySettings: OverlaySettings = {};
  private overlaySettings2: OverlaySettings = {};
  private fb = new FormBuilder();
  public Iniciar: boolean = false;
  public Errores: string = "";
  private Index: string = "-1";


  private lstReglas: ReglasValidacion[] = [];
  private lstFrm: I_Frm[] = [];


  private xs : number = 0;
  private sm : number = 576;
  private md : number = 768;
  private lg : number = 992;
  private xl : number = 1200;
  private xxl : number = 1400;



  constructor() {
    lstFocus.splice(0, lstFocus.length);
    lstFormat.splice(0, lstFocus.length);
  }

  public ValForm = this.fb.nonNullable.group({});

  public Combo(c: QueryList<IgxComboComponent>) {

    cmb = [];

    c?.filter(f=> {

      let temp = cmb.find( w=> w.id == f.id);

      if(temp == undefined) cmb.push(f);

      f.opening?.subscribe(s => {   
        var bod : any = document.getElementById("body");   
        if(bod != undefined) bod.style.overflow = "hidden";     
      });
    

      f.closing?.subscribe(s => {   
        var bod : any = document.getElementById("body"); 
        if(bod != undefined) bod.style.overflow = "";      
      });

    });


    
  }


  public ComboOverLay(c: QueryList<IgxComboComponent>, Permir_OutsideCLick_id : string[]) {

    c?.forEach( f => {
      f.itemsWidth = (window.innerWidth <= this.sm ? String(window.innerWidth) : this.sm) + "px";
      f.overlaySettings = this.overlaySettings;
      if(Permir_OutsideCLick_id.includes(f.id)) f.overlaySettings = this.overlaySettings2;


    });



    this.overlaySettings = {};
    this.overlaySettings2 = {};


    if (window.innerWidth <= this.md) {
      this.overlaySettings = {
        positionStrategy: new GlobalPositionStrategy({ openAnimation: scaleInCenter, closeAnimation: scaleOutCenter }),
        modal: true,
        closeOnOutsideClick: false
      };

      this.overlaySettings2 = {
        positionStrategy: new GlobalPositionStrategy({ openAnimation: scaleInCenter, closeAnimation: scaleOutCenter }),
        modal: true,
        closeOnOutsideClick: true
      };
    }



  

  }



  
  public async ResetCssError()
  {
 
    document.querySelectorAll('.igx-input-group').forEach((key : any) => {
      key?.classList?.remove('igx-input-group--invalid');
    });



    this.lstReglas.forEach((f) => {

      let elmento: any = document.getElementById(f.Id);
      elmento?.parentElement?.classList?.remove("contenedor-info-validacion");

      let span = document.getElementById("info-validacion-" + f.Id);
      span?.remove();

    });

    this.ValForm.reset();


    
  }


  public V_SingleSelection(event: IComboSelectionChangingEventArgs) {

    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      this.Get(event.owner.id).setValue(event.newValue[0]);
      event.owner.close();
    }
  }


  public CambioRegla(id: string, r: string): string {
    return this.lstReglas.filter((f) => f.Id == id && f.Regla == r)[0].valor;
  }

  public Get(id: string): any {
    return this.lstFrm.find((f) => f.Id == id)?.Frm;
  }

  public SetValue(id: string, value: any): any {
    let FormControl: FormControl = this.Get(id);
    return FormControl.setValue(value);
  }

  public GetValue(id: string): any {
    let FormControl: FormControl = this.Get(id);

    if(Array.isArray(FormControl.value))
    {
      return FormControl.value[0];
    }
    else
    {
      return FormControl.value;
    }
    
  }
  
  public add(
    id: string,
    regla: string,
    condicion: string,
    valor: string,
    etiqueta: string,
    msj: string
  ) {


    let NuevoItem: boolean = false;
    let NuevaRegla: boolean = false;
    this.Index = String(Number.parseInt(this.Index) + 1);

    const _frm = new FormControl("", this.Cls_Validaciones(id));

    if (this.Get(id) == undefined) {
      this.ValForm.addControl(id, _frm);
      NuevoItem = true;
      
  
     
    }



    if (this.lstReglas.findIndex(f => f.Id == id && f.Regla == regla) == -1) {
      const _Regla: ReglasValidacion = new ReglasValidacion();
      _Regla.Id = id;
      _Regla.Regla = regla;
      _Regla.Condicon = condicion;
      _Regla.valor = valor;
      _Regla.Mensaje = msj;
      _Regla.Index = this.Index + "_" + id;
      _Regla.Etiqueta = etiqueta;
      this.lstReglas.push(_Regla);
    }

    if (NuevoItem) this.lstFrm.push({ Id: id, Frm: _frm, Etiqueta: etiqueta });

  


  }

  
  public LimpiarEnterFocus()
  {
    lstFocus.splice(0, lstFocus.length);
  }

  public addFocus(id: string, idNext: string, evento: any) {
    let i: number = lstFocus.findIndex(f => f.Id == id);

    if (i != -1) {
      lstFocus[i].IdNext == idNext;
    }
    else {
      lstFocus.push({ Id: id, IdNext: idNext, Evento: evento });
    }


    document.querySelector('#' + id)?.addEventListener('keypress', onKeyEnter);
    let elemento = document.getElementById(id);
    if (elemento?.tagName == "IGX-COMBO") elemento.addEventListener("keyup", this.V_Forcer_Key_Enter_Combo);


  }


  public LimpiarTap()
  {
    lstTabFocus.splice(0, lstTabFocus.length);
  }
  
  public addTab(id: string, idNext: string, evento: any) {
    let i: number = lstTabFocus.findIndex(f => f.Id == id);

    if (i != -1) {
      lstTabFocus[i].IdNext == idNext;
    }
    else {
      lstTabFocus.push({ Id: id, IdNext: idNext, Evento: evento });
    }


    document.querySelector('#' + id)?.addEventListener('keydown', onKeyEnter);

    let elemento = document.getElementById(id);
    if (elemento?.tagName == "IGX-COMBO") elemento.addEventListener("keyup", this.V_Forcer_Key_Enter_Combo);


  }



  public addNumberFocus(id: string, decimal: number) {

    let i: number = lstFormat.findIndex(f => f.Id == id);

    if (i != -1) {
      lstFormat.splice(i, 1);
    }

    lstFormat.push({ Id: id, Decimal: decimal });

    document.querySelector('#' + id)?.addEventListener('focusin', this.onFocusIn);
    document.querySelector('#' + id)?.addEventListener('focusout', this.onFocusOut);
    //document.getElementById('input')?.addEventListener('input', this.onValid);


  }



  private V_Forcer_Key_Enter_Combo(event: any): void {

    if (["Enter", "Tab"].includes(event.key)) {
      let id = event.srcElement.parentElement.parentElement.parentElement.parentElement.parentElement.id

      let elmento: HTMLElement = document?.getElementById(id)!;


      let combo: IgxComboComponent = cmb.find(f => f.id == id)!;
      combo.close();


      let _element_next = (KeyPress == "Enter"?  lstFocus : lstTabFocus).find(f => f.Id == id);

      if (_element_next == undefined) return;
      if (_element_next.IdNext == "") return;


      elmento = document?.getElementById(_element_next.Id)!;
      elmento = getRectArea(elmento);





      elmento?.focus();


      let elment: IgxComboComponent = cmb.find(f => f.id == _element_next?.IdNext)!;

      if (elment != undefined) elment.open();

    }


  }


  onFocusIn(event: any) {


    let id: string = event.target.id;
    let i: number = lstFormat.findIndex(f => f.Id == id);


    let elmento: any = document?.getElementById(id)!;


    if (!isNaN(parseFloat(elmento.value.replaceAll(",", "")))) {
      if (Number(elmento.value.replaceAll(",", "")) == 0) elmento.value = "";

    }

  }

  onFocusOut(event: any) {


    let id: string = event.target.id;
    let iform = lstFormat.find(f => f.Id == id);

    let elmento: any = document?.getElementById(id)!;



    let numero: number = 0

    if (elmento.value != "") numero = Number(elmento.value.replaceAll(",", ""));




    elmento.value = formatNumber(numero, "en-IN", "1." + iform?.Decimal + "-" + iform?.Decimal);


  }


  public del(id: string): void {

    this.lstReglas.filter(w => w.Id == id).forEach(w => {


      let i: number = this.lstReglas.findIndex((f) => f.Id == id && f.Regla == w.Regla);

      if (i != -1) {
        this.ValForm.removeControl(id);
        this.lstReglas.splice(i, 1);
      }



      i = lstFocus.findIndex((f) => f.Id == id);

      if (i != -1) {
        lstFocus.splice(i, 1);
      }

      i = this.lstFrm.findIndex((f) => f.Id == id);

      if (i != -1) {
        this.lstFrm.splice(i, 1);
      }
    });



  }

  public delRule(id: string, regla: string): void {
    let i: number = this.lstReglas.findIndex(
      (f) => f.Id == id && f.Regla == regla
    );

    if (i == -1) return;
    this.lstReglas.splice(i, 1);
  }

  public replace(
    id: string,
    rule: string,
    condicion: string,
    valor: string,
    msj: string
  ): void {
    let i: number = this.lstReglas.findIndex(
      (f) => f.Id == id && f.Regla == rule
    );
    this.lstReglas[i].Condicon = condicion;
    this.lstReglas[i].valor = valor;
    this.lstReglas[i].Mensaje = msj;
  }

  public EsValido(): boolean {
    return this._EsValido([]);
  }

  public ItemValido(formControlName: string[]) {
    return this._EsValido(formControlName);
  }

  private _EsValido(formControlName: string[]): boolean {
    this.Errores = "";

    let i: number = 0;
    let esError: boolean = false;

    //this.lstReglas.sort((a, b) => a.Index.localeCompare(b.Index));

    let reglas: ReglasValidacion[] = JSON.parse(JSON.stringify(this.lstReglas.filter(f => (formControlName.includes(f.Id)) || formControlName.length == 0).sort((a, b) => a.Etiqueta.localeCompare(b.Etiqueta))));




    reglas.forEach((f) => {
      let retorno = "0";
      let errores = "";
      let frm: any = this.Get(f.Id);
      let etiqueta: string = this.lstFrm.find((ff) => ff.Id == f.Id)?.Etiqueta!;
      let _Id: string = "";
      let hmtlValue = "";

      let elmento: any = document.getElementById(f.Id);
      elmento?.parentElement?.classList?.remove("contenedor-info-validacion");

  
   

      let span = document.getElementById("info-validacion-" + f.Id);
      span?.remove();

      frm.value = this.ValForm.get(f.Id)?.value;
      hmtlValue = elmento?.value
      if(elmento?.type == "checkbox") hmtlValue = frm.value;
      if(elmento?.localName == "igx-date-picker") hmtlValue = frm.value;


      if ((String(frm.value) == "undefined" || String(frm.value) == "")) {

        if (elmento?.localName == "igx-combo") {
          let combo: any = cmb?.find(w => w.id == f.Id)!;
          frm.setValue(combo?._value);
        }
        else {
          frm.setValue(hmtlValue);
        }

      }
      else {
        if (frm.value != hmtlValue && elmento?.localName != "igx-combo") frm.setValue(hmtlValue);
      }



      let r: string[] = this._Validar(f.Id, f, frm, retorno, errores);
      reglas[i].ErrorMensaje = "";

      if (r[1] != "" && f.Mensaje != "") {

        if (_Id != f.Id) {
          _Id = f.Id;
          esError = true;
        }

        reglas[i].ErrorMensaje = "<li class='error-mensaje'>" + f.Mensaje + "</li>";



      }


      //AGREGANDO ICONO DE VALIDACION
      esError = reglas.filter(w => w.Id == f.Id && w.ErrorMensaje != "").length > 0 ? true : false;
      span = document.getElementById("info-validacion-" + f.Id);
      if (span == undefined && esError) {
        esError = false;
        span = document.createElement("span");
        span.id = "info-validacion-" + f.Id;
        span.className = "info-validacion";
        let ei = document.createElement("i");
        ei.className = "fa-solid fa-info fa-fade fa-xl opcional";
        span.appendChild(ei);
        elmento?.parentNode?.insertBefore(span, elmento);
        
        elmento?.parentElement?.classList?.add("contenedor-info-validacion");
     
      
        elmento?.querySelectorAll('.igx-input-group')?.forEach((key : HTMLElement) => {
          key?.classList?.add('igx-input-group--invalid');
        });

      }
      else
      {
        elmento?.querySelectorAll('.igx-input-group--invalid')?.forEach((key : HTMLElement) => {
          key?.classList?.remove('igx-input-group--invalid');
        });
    
      }

      i++;
    });


    this.Errores = "";
    let er: string = "";
    let lst = JSON.parse(JSON.stringify(reglas.filter(f => f.ErrorMensaje != "").sort((a, b) => a.Etiqueta.localeCompare(b.Etiqueta))));
    i = 0;
    lst.forEach((f: ReglasValidacion) => {

      if (!er.includes(f.ErrorMensaje)) er += f.ErrorMensaje;


      if (i < lst.length - 1 && f.Etiqueta != "") {
        if (lst[i + 1].Etiqueta != f.Etiqueta) {
          this.Errores += "<li class='error-etiqueta'>" + f.Etiqueta + "<ul>" + er + "</ul></li>";
          er = "";
        }

      }
      else {
        this.Errores += "<li class='error-etiqueta'>" + f.Etiqueta + "<ul>" + er + "</ul></li>";
      }

      i++;

    });


    if (this.Errores != "") {
      this.Errores = "<ul class='contenedor-validador'>" + this.Errores + "</ul>";
      return false;
    }

    



    return true;
  }


  public ActulizarValores(id: string, value: any) {
    this.ValForm.get(id)?.setValue(value);
  }


  private Cls_Validaciones(id: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: string } | null => {
      if (!this.Iniciar) return { Regla: "" };

      let retorno = "0";
      let errores = "";

      this.lstReglas
        .filter((f) => f.Id == id)
        .forEach((element) => {
          let r: string[] = this._Validar(
            id,
            element,
            control,
            retorno,
            errores
          );

          retorno = r[0];
          errores = r[1];
        });

      if (errores == "") {
        return null;
      }

      return { Regla: retorno };
    };
  }

  private _Validar(
    id: string,
    element: ReglasValidacion,
    control: AbstractControl,
    retorno: string,
    errores: string
  ): string[] {
    if (id == element.Id && errores == "") {
      retorno = element.Regla;

      let str_cadena = String(control.value);
      let dtFecha1!: Date;
      let dtFecha2!: Date;
      let parts: string[];

      if (str_cadena == "undefined" || str_cadena == "null") {
        str_cadena = "";
      }

      switch (element.Condicon) {
        case "LEN>":
          if (!(str_cadena.length > Number(element.valor))) errores = "1";

          break;

        case "LEN<":
          if (!(str_cadena.length < Number(element.valor))) errores = "1";

          break;

        case "LEN>=":
          if (!(str_cadena.length >= Number(element.valor))) errores = "1";

          break;

        case "LEN<=":
          if (!(str_cadena.length <= Number(element.valor))) errores = "1";

          break;

        case "LEN==":
          if (!(str_cadena.length == Number(element.valor))) errores = "1";

          break;

        case "NUM>":
          if (!(Number(str_cadena.replaceAll(",", "")) > Number(element.valor))) errores = "1";

          break;

        case "NUM<":
          if (!(Number(str_cadena.replaceAll(",", "")) < Number(element.valor))) errores = "1";

          break;

        case "NUM>=":
          if (!(Number(str_cadena.replaceAll(",", "")) >= Number(element.valor))) errores = "1";

          break;

        case "NUM<=":
          if (!(Number(str_cadena.replaceAll(",", "")) <= Number(element.valor))) errores = "1";

          break;

        case "NUM==":
          if (!(Number(str_cadena.replaceAll(",", "")) == Number(element.valor))) errores = "1";

          break;

        case "DATE":
          if (str_cadena == "") {
            errores = "1";
          } else {
            if (!this.ValidarFecha(str_cadena)) {
              errores = "1";
            }
          }

          break;

        case "DATE>":
          str_cadena = formatDate(new Date(str_cadena), "dd/MM/yyyy", "en-US");

          parts = str_cadena.split("/");
          dtFecha1 = new Date(
            Number.parseInt(parts[2]),
            Number.parseInt(parts[1]),
            Number.parseInt(parts[0])
          );

          parts = element.valor.split("/");
          dtFecha2 = new Date(
            Number.parseInt(parts[2]),
            Number.parseInt(parts[1]),
            Number.parseInt(parts[0])
          );

          if (!this.ValidarFecha(str_cadena)) {
            if (dtFecha1 > dtFecha2) {
              errores = "1";
            }
          }

          break;

        case "CORREO":
          if (str_cadena == "") {
            errores = "1";
          } else {
            if (!this.ValidarCorreo(str_cadena)) {
              errores = "1";
            }
          }

          break;
      }
    }

    return [retorno, errores];
  }

  private ValidarFecha(fecha: string) {
    let match!: any;

    match = fecha.match(/^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})$/);
    if (match) {
      return true;
    } else if (match && match[0] == fecha) {
      return true;
    }

    return false;
  }

  private ValidarCorreo(correo: string) {
    let match!: any;

    match = correo.match(
      /^[a-zA-Z0-9.!#$%&"*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    );
    if (match) {
      return true;
    }
    return false;
  }

  parse(value: any): Date | null {
    if (typeof value === "string" && value.indexOf("/") > -1) {
      const str = value.split("/");

      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);

      return new Date(year, month, date);
    } else if (typeof value === "string" && value === "") {
      return new Date();
    }
    const timestamp = typeof value === "number" ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }




}

