import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CierreFiscalComponent } from './cierre-fiscal.component';

describe('CierreFiscalComponent', () => {
  let component: CierreFiscalComponent;
  let fixture: ComponentFixture<CierreFiscalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CierreFiscalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CierreFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
