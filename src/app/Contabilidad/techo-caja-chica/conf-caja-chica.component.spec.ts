import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfCajaChicaComponent } from './conf-caja-chica.component';

describe('ConfCajaChicaComponent', () => {
  let component: ConfCajaChicaComponent;
  let fixture: ComponentFixture<ConfCajaChicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfCajaChicaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfCajaChicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
