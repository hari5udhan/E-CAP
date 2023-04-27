import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTrainingRequestComponent } from './view-training-request.component';

describe('ViewTrainingRequestComponent', () => {
  let component: ViewTrainingRequestComponent;
  let fixture: ComponentFixture<ViewTrainingRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTrainingRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTrainingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
