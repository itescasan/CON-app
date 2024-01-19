import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoResultadoComponent } from './estado-resultado.component';

describe('EstadoResultadoComponent', () => {
  let component: EstadoResultadoComponent;
  let fixture: ComponentFixture<EstadoResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoResultadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstadoResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
