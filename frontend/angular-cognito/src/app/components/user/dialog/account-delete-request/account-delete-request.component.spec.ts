import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDeleteRequestComponent } from './account-delete-request.component';

describe('AccountDeleteRequestComponent', () => {
  let component: AccountDeleteRequestComponent;
  let fixture: ComponentFixture<AccountDeleteRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountDeleteRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountDeleteRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
