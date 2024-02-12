import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosAcumuladosComponent } from './gastos-acumulados.component';

describe('GastosAcumuladosComponent', () => {
  let component: GastosAcumuladosComponent;
  let fixture: ComponentFixture<GastosAcumuladosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GastosAcumuladosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GastosAcumuladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
