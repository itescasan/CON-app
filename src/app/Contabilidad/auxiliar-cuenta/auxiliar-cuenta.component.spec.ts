import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuxiliarCuentaComponent } from './auxiliar-cuenta.component';

describe('AuxiliarCuentaComponent', () => {
  let component: AuxiliarCuentaComponent;
  let fixture: ComponentFixture<AuxiliarCuentaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuxiliarCuentaComponent]
    });
    fixture = TestBed.createComponent(AuxiliarCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
