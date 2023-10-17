import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoChequeComponent } from './nuevo-cheque.component';

describe('NuevoChequeComponent', () => {
  let component: NuevoChequeComponent;
  let fixture: ComponentFixture<NuevoChequeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevoChequeComponent]
    });
    fixture = TestBed.createComponent(NuevoChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
