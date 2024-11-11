import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDiferenciasCXPvsContabilidadComponent } from './reporte-diferencias-cxpvs-contabilidad.component';

describe('ReporteDiferenciasCXPvsContabilidadComponent', () => {
  let component: ReporteDiferenciasCXPvsContabilidadComponent;
  let fixture: ComponentFixture<ReporteDiferenciasCXPvsContabilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDiferenciasCXPvsContabilidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteDiferenciasCXPvsContabilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
