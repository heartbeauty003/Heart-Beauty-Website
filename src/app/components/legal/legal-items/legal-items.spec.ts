import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalItems } from './legal-items';

describe('LegalItems', () => {
  let component: LegalItems;
  let fixture: ComponentFixture<LegalItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalItems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
