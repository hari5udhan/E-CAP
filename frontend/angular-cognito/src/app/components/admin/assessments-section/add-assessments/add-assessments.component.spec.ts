import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssessmentsComponent } from './add-assessments.component';

describe('AddAssessmentsComponent', () => {
  let component: AddAssessmentsComponent;
  let fixture: ComponentFixture<AddAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAssessmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
