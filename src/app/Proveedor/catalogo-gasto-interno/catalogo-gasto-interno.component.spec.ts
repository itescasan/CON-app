import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoGastoInternoComponent } from './catalogo-gasto-interno.component';

describe('CatalogoGastoInternoComponent', () => {
  let component: CatalogoGastoInternoComponent;
  let fixture: ComponentFixture<CatalogoGastoInternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoGastoInternoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoGastoInternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
