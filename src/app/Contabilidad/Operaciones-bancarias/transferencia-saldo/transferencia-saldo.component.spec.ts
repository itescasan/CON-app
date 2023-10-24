import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciaSaldoComponent } from './transferencia-saldo.component';

describe('TransferenciaSaldoComponent', () => {
  let component: TransferenciaSaldoComponent;
  let fixture: ComponentFixture<TransferenciaSaldoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransferenciaSaldoComponent]
    });
    fixture = TestBed.createComponent(TransferenciaSaldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
