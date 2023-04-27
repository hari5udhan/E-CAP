import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignProjectformComponent } from './assign-projectform.component';

describe('AssignProjectformComponent', () => {
  let component: AssignProjectformComponent;
  let fixture: ComponentFixture<AssignProjectformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignProjectformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignProjectformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
