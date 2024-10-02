import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetencionesAlcaldiasForaneasComponent } from './retenciones-alcaldias-foraneas.component';

describe('RetencionesAlcaldiasForaneasComponent', () => {
  let component: RetencionesAlcaldiasForaneasComponent;
  let fixture: ComponentFixture<RetencionesAlcaldiasForaneasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetencionesAlcaldiasForaneasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetencionesAlcaldiasForaneasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
