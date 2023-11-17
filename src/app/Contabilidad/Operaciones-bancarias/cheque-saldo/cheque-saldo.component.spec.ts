import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequesSaldoComponent } from './cheque-saldo.component';

describe('ChequeSaldoComponent', () => {
  let component: ChequesSaldoComponent;
  let fixture: ComponentFixture<ChequesSaldoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChequesSaldoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChequesSaldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
