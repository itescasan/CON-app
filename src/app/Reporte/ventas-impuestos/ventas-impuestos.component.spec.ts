import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasImpuestosComponent } from './ventas-impuestos.component';

describe('VentasImpuestosComponent', () => {
  let component: VentasImpuestosComponent;
  let fixture: ComponentFixture<VentasImpuestosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasImpuestosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasImpuestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
