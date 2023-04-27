import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateRegisterationFormComponent } from './certificate-registeration-form.component';

describe('CertificateRegisterationFormComponent', () => {
  let component: CertificateRegisterationFormComponent;
  let fixture: ComponentFixture<CertificateRegisterationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificateRegisterationFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateRegisterationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
