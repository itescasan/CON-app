import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceGeneralComparativoComponent } from './balance-general-comparativo.component';

describe('BalanceGeneralComparativoComponent', () => {
  let component: BalanceGeneralComparativoComponent;
  let fixture: ComponentFixture<BalanceGeneralComparativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceGeneralComparativoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceGeneralComparativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
