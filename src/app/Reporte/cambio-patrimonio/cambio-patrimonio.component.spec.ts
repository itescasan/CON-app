import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioPatrimonioComponent } from './cambio-patrimonio.component';

describe('CambioPatrimonioComponent', () => {
  let component: CambioPatrimonioComponent;
  let fixture: ComponentFixture<CambioPatrimonioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambioPatrimonioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CambioPatrimonioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
