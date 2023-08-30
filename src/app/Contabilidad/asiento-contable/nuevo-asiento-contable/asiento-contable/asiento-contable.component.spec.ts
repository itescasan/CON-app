import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsientoContableComponent } from './asiento-contable.component';

describe('AsientoContableComponent', () => {
  let component: AsientoContableComponent;
  let fixture: ComponentFixture<AsientoContableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsientoContableComponent]
    });
    fixture = TestBed.createComponent(AsientoContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
