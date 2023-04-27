import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillAssignformComponent } from './skill-assignform.component';

describe('SkillAssignformComponent', () => {
  let component: SkillAssignformComponent;
  let fixture: ComponentFixture<SkillAssignformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillAssignformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillAssignformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
