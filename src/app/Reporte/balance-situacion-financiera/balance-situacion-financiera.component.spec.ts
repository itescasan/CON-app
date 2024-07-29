import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceSituacionFinancieraComponent } from './balance-situacion-financiera.component';

describe('BalanceSituacionFinancieraComponent', () => {
  let component: BalanceSituacionFinancieraComponent;
  let fixture: ComponentFixture<BalanceSituacionFinancieraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceSituacionFinancieraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceSituacionFinancieraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
