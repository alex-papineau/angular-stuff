import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingApp } from './voting-app';

describe('VotingApp', () => {
  let component: VotingApp;
  let fixture: ComponentFixture<VotingApp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotingApp],
    }).compileComponents();

    fixture = TestBed.createComponent(VotingApp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
