import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDetailsMain } from './profile-details-main';

describe('ProfileDetailsMain', () => {
  let component: ProfileDetailsMain;
  let fixture: ComponentFixture<ProfileDetailsMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDetailsMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileDetailsMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
