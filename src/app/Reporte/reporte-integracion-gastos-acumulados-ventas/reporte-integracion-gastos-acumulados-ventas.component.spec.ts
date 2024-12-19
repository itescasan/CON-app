import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteIntegracionGastosAcumuladosVentasComponent } from './reporte-integracion-gastos-acumulados-ventas.component';

describe('ReporteIntegracionGastosAcumuladosVentasComponent', () => {
  let component: ReporteIntegracionGastosAcumuladosVentasComponent;
  let fixture: ComponentFixture<ReporteIntegracionGastosAcumuladosVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteIntegracionGastosAcumuladosVentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteIntegracionGastosAcumuladosVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
