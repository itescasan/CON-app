import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteIntegracionGastosAcumuladosComponent } from './reporte-integracion-gastos-acumulados.component';

describe('ReporteIntegracionGastosAcumuladosComponent', () => {
  let component: ReporteIntegracionGastosAcumuladosComponent;
  let fixture: ComponentFixture<ReporteIntegracionGastosAcumuladosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteIntegracionGastosAcumuladosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteIntegracionGastosAcumuladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
