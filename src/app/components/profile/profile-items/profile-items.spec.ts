import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileItems } from './profile-items';

describe('ProfileItems', () => {
  let component: ProfileItems;
  let fixture: ComponentFixture<ProfileItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileItems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
