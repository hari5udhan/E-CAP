import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbuFormComponent } from './sbu-form.component';

describe('SbuFormComponent', () => {
  let component: SbuFormComponent;
  let fixture: ComponentFixture<SbuFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SbuFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SbuFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
