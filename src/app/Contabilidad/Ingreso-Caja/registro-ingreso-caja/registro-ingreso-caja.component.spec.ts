import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroIngresoCajaComponent } from './registro-ingreso-caja.component';

describe('RegistroIngresoCajaComponent', () => {
  let component: RegistroIngresoCajaComponent;
  let fixture: ComponentFixture<RegistroIngresoCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroIngresoCajaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroIngresoCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
