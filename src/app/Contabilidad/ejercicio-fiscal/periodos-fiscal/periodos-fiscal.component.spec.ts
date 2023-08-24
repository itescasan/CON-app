import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodosFiscalComponent } from './periodos-fiscal.component';

describe('PeriodosFiscalComponent', () => {
  let component: PeriodosFiscalComponent;
  let fixture: ComponentFixture<PeriodosFiscalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeriodosFiscalComponent]
    });
    fixture = TestBed.createComponent(PeriodosFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
