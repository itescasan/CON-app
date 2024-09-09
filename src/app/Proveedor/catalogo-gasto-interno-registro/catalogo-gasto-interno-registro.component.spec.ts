import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoGastoInternoRegistroComponent } from './catalogo-gasto-interno-registro.component';

describe('CatalogoGastoInternoRegistroComponent', () => {
  let component: CatalogoGastoInternoRegistroComponent;
  let fixture: ComponentFixture<CatalogoGastoInternoRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoGastoInternoRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoGastoInternoRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
