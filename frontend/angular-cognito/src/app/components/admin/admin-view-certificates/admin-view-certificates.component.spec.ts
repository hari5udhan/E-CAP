import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewCertificatesComponent } from './admin-view-certificates.component';

describe('AdminViewCertificatesComponent', () => {
  let component: AdminViewCertificatesComponent;
  let fixture: ComponentFixture<AdminViewCertificatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminViewCertificatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
