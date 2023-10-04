import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciaCuentaComponent } from './transferencia-cuenta.component';

describe('TransferenciaComponent', () => {
  let component: TransferenciaCuentaComponent;
  let fixture: ComponentFixture<TransferenciaCuentaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransferenciaCuentaComponent]
    });
    fixture = TestBed.createComponent(TransferenciaCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
