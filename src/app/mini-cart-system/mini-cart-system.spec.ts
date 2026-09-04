import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniCartSystem } from './mini-cart-system';

describe('MiniCartSystem', () => {
  let component: MiniCartSystem;
  let fixture: ComponentFixture<MiniCartSystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniCartSystem],
    }).compileComponents();

    fixture = TestBed.createComponent(MiniCartSystem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
