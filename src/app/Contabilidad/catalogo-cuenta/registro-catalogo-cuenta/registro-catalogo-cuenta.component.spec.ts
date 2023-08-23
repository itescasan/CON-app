import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroCatalogoCuentaComponent } from './registro-catalogo-cuenta.component';

describe('RegistroCatalogoCuentaComponent', () => {
  let component: RegistroCatalogoCuentaComponent;
  let fixture: ComponentFixture<RegistroCatalogoCuentaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroCatalogoCuentaComponent]
    });
    fixture = TestBed.createComponent(RegistroCatalogoCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
