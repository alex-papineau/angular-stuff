import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalWorldClock } from './digital-world-clock';

describe('DigitalWorldClock', () => {
  let component: DigitalWorldClock;
  let fixture: ComponentFixture<DigitalWorldClock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalWorldClock],
    }).compileComponents();

    fixture = TestBed.createComponent(DigitalWorldClock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
