import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasBolsaAgropecuariaComponent } from './ventas-bolsa-agropecuaria.component';

describe('VentasBolsaAgropecuariaComponent', () => {
  let component: VentasBolsaAgropecuariaComponent;
  let fixture: ComponentFixture<VentasBolsaAgropecuariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasBolsaAgropecuariaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasBolsaAgropecuariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
