import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CognitoUserComponent } from './cognito-user.component';

describe('CognitoUserComponent', () => {
  let component: CognitoUserComponent;
  let fixture: ComponentFixture<CognitoUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CognitoUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CognitoUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
