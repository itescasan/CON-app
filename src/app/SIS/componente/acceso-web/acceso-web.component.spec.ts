import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesoWebComponent } from './acceso-web.component';

describe('AccesoWebComponent', () => {
  let component: AccesoWebComponent;
  let fixture: ComponentFixture<AccesoWebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccesoWebComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccesoWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
