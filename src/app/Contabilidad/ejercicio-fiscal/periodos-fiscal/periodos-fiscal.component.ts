import { Component } from '@angular/core';

@Component({
  selector: 'app-periodos-fiscal',
  templateUrl: './periodos-fiscal.component.html',
  styleUrls: ['./periodos-fiscal.component.scss']
})
export class PeriodosFiscalComponent {

  public esModal : boolean = false;
  
  constructor()
  {
    this.v_Iniciar("Iniciar");
  }

  private v_Iniciar(e : string) : void
{
  switch(e)
  {
    case "Iniciar":
      this.esModal = false;
    break;    
  }
}
}
