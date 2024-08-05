import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasAlcaldiaComponent } from './ventas-alcaldia.component';

describe('VentasAlcaldiaComponent', () => {
  let component: VentasAlcaldiaComponent;
  let fixture: ComponentFixture<VentasAlcaldiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasAlcaldiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasAlcaldiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
