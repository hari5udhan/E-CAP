import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCompletionComponent } from './project-completion.component';

describe('ProjectCompletionComponent', () => {
  let component: ProjectCompletionComponent;
  let fixture: ComponentFixture<ProjectCompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectCompletionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
