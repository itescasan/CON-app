import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesoCajaComponent } from './acceso-caja.component';

describe('AccesoCajaComponent', () => {
  let component: AccesoCajaComponent;
  let fixture: ComponentFixture<AccesoCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccesoCajaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccesoCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
