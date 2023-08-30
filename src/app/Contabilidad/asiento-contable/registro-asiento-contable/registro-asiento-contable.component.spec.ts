import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroAsientoContableComponent } from './registro-asiento-contable.component';

describe('RegistroAsientoContableComponent', () => {
  let component: RegistroAsientoContableComponent;
  let fixture: ComponentFixture<RegistroAsientoContableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroAsientoContableComponent]
    });
    fixture = TestBed.createComponent(RegistroAsientoContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
