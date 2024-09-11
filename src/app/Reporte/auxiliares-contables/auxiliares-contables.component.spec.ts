import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuxiliaresContablesComponent } from './auxiliares-contables.component';

describe('AuxiliaresContablesComponent', () => {
  let component: AuxiliaresContablesComponent;
  let fixture: ComponentFixture<AuxiliaresContablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuxiliaresContablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuxiliaresContablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
