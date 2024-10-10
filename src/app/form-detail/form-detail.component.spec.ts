import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDetailComponent } from './form-detail.component';

describe('FormDetailComponent', () => {
  let component: FormDetailComponent;
  let fixture: ComponentFixture<FormDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormDetailComponent]
    });
    fixture = TestBed.createComponent(FormDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
