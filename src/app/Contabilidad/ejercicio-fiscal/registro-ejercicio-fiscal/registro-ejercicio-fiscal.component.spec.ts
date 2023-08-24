import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEjercicioFiscalComponent } from './registro-ejercicio-fiscal.component';

describe('RegistroEjercicioFiscalComponent', () => {
  let component: RegistroEjercicioFiscalComponent;
  let fixture: ComponentFixture<RegistroEjercicioFiscalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroEjercicioFiscalComponent]
    });
    fixture = TestBed.createComponent(RegistroEjercicioFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
