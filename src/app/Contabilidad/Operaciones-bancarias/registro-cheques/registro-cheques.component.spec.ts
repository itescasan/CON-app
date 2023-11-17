import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroChequesComponent } from './registro-cheques.component';

describe('RegistroChequesComponent', () => {
  let component: RegistroChequesComponent;
  let fixture: ComponentFixture<RegistroChequesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroChequesComponent]
    });
    fixture = TestBed.createComponent(RegistroChequesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
