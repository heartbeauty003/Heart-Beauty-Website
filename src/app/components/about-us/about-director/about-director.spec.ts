import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutDirector } from './about-director';

describe('AboutDirector', () => {
  let component: AboutDirector;
  let fixture: ComponentFixture<AboutDirector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutDirector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutDirector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
