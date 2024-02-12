import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CierreMensualComponent } from './cierre-mensual.component';

describe('CierreMensualComponent', () => {
  let component: CierreMensualComponent;
  let fixture: ComponentFixture<CierreMensualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CierreMensualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CierreMensualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
