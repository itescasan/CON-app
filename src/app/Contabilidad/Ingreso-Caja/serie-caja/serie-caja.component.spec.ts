import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInputComponent } from './serie-caja.component';

describe('DialogInputComponent', () => {
  let component: DialogInputComponent;
  let fixture: ComponentFixture<DialogInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
