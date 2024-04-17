import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloVSContabilidadComponent } from './modulo-vs-contabilidad.component';

describe('ModuloVSContabilidadComponent', () => {
  let component: ModuloVSContabilidadComponent;
  let fixture: ComponentFixture<ModuloVSContabilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloVSContabilidadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModuloVSContabilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
