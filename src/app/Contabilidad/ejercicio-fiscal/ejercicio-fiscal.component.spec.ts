import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjercicioFiscalComponent } from './ejercicio-fiscal.component';



describe('EjercicioFiscalComponent', () => {
  let component: EjercicioFiscalComponent;
  let fixture: ComponentFixture<EjercicioFiscalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EjercicioFiscalComponent]
    });
    fixture = TestBed.createComponent(EjercicioFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  }); 
});

