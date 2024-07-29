import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosCentroCostoComponent } from './gastos-centro-costo.component';

describe('GastosCentroCostoComponent', () => {
  let component: GastosCentroCostoComponent;
  let fixture: ComponentFixture<GastosCentroCostoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GastosCentroCostoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GastosCentroCostoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
