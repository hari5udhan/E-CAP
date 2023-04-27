import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAssessmentsComponent } from './update-assessments.component';

describe('UpdateAssessmentsComponent', () => {
  let component: UpdateAssessmentsComponent;
  let fixture: ComponentFixture<UpdateAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateAssessmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
