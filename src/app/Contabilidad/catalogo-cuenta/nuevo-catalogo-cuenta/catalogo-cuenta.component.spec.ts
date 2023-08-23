import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoCuentaComponent } from './catalogo-cuenta.component';

describe('CatalogoCuentaComponent', () => {
  let component: CatalogoCuentaComponent;
  let fixture: ComponentFixture<CatalogoCuentaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogoCuentaComponent]
    });
    fixture = TestBed.createComponent(CatalogoCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
