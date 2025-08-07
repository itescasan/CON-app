import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCatalogoCuentaComponent } from './reporte-catalogo-cuenta.component';

describe('ReporteCatalogoCuentaComponent', () => {
  let component: ReporteCatalogoCuentaComponent;
  let fixture: ComponentFixture<ReporteCatalogoCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteCatalogoCuentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteCatalogoCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
