import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditoFiscalIvaComponent } from './credito-fiscal-iva.component';

describe('CreditoFiscalIvaComponent', () => {
  let component: CreditoFiscalIvaComponent;
  let fixture: ComponentFixture<CreditoFiscalIvaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditoFiscalIvaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditoFiscalIvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
