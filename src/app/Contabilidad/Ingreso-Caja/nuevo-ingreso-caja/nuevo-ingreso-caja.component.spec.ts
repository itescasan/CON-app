import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoIngresoCajaComponent } from './nuevo-ingreso-caja.component';

describe('NuevoIngresoCajaComponent', () => {
  let component: NuevoIngresoCajaComponent;
  let fixture: ComponentFixture<NuevoIngresoCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoIngresoCajaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoIngresoCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
