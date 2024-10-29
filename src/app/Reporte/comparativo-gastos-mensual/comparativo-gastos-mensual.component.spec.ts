import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparativoGastosMensualComponent } from './comparativo-gastos-mensual.component';

describe('ComparativoGastosMensualComponent', () => {
  let component: ComparativoGastosMensualComponent;
  let fixture: ComponentFixture<ComparativoGastosMensualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparativoGastosMensualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparativoGastosMensualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
