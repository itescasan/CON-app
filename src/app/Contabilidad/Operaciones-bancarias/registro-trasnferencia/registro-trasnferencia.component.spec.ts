import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroTrasnferenciaComponent } from './registro-trasnferencia.component';

describe('RegistroTrasnferenciaComponent', () => {
  let component: RegistroTrasnferenciaComponent;
  let fixture: ComponentFixture<RegistroTrasnferenciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroTrasnferenciaComponent]
    });
    fixture = TestBed.createComponent(RegistroTrasnferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
