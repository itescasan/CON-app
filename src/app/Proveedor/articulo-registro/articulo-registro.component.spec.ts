import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloRegistroComponent } from './articulo-registro.component';

describe('ArticuloRegistroComponent', () => {
  let component: ArticuloRegistroComponent;
  let fixture: ComponentFixture<ArticuloRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticuloRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticuloRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
