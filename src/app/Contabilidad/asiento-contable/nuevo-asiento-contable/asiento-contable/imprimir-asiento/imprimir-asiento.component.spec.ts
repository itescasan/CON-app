import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimirAsientoComponent } from './imprimir-asiento.component';

describe('ImprimirAsientoComponent', () => {
  let component: ImprimirAsientoComponent;
  let fixture: ComponentFixture<ImprimirAsientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImprimirAsientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImprimirAsientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
