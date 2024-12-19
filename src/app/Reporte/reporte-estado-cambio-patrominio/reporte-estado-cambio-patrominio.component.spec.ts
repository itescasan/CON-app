import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteEstadoCambioPatrominioComponent } from './reporte-estado-cambio-patrominio.component';

describe('ReporteEstadoCambioPatrominioComponent', () => {
  let component: ReporteEstadoCambioPatrominioComponent;
  let fixture: ComponentFixture<ReporteEstadoCambioPatrominioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteEstadoCambioPatrominioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteEstadoCambioPatrominioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
