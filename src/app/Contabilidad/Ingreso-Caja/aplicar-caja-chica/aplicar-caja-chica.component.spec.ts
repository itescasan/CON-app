import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AplicarCajaChicaComponent } from './aplicar-caja-chica.component';

describe('AplicarCajaChicaComponent', () => {
  let component: AplicarCajaChicaComponent;
  let fixture: ComponentFixture<AplicarCajaChicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AplicarCajaChicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AplicarCajaChicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
