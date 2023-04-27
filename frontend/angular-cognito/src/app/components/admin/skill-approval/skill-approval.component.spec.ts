import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillApprovalComponent } from './skill-approval.component';

describe('SkillApprovalComponent', () => {
  let component: SkillApprovalComponent;
  let fixture: ComponentFixture<SkillApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
