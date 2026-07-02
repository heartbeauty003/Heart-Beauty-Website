import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyUsInfo } from './why-us-info';

describe('WhyUsInfo', () => {
  let component: WhyUsInfo;
  let fixture: ComponentFixture<WhyUsInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyUsInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyUsInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
