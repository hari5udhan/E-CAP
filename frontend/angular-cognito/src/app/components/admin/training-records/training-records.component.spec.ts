import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingRecordsComponent } from './training-records.component';

describe('TrainingRecordsComponent', () => {
  let component: TrainingRecordsComponent;
  let fixture: ComponentFixture<TrainingRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingRecordsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
