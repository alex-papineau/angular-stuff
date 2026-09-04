import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubUserSearchUI } from './github-user-search-ui';

describe('GithubUserSearchUI', () => {
  let component: GithubUserSearchUI;
  let fixture: ComponentFixture<GithubUserSearchUI>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GithubUserSearchUI],
    }).compileComponents();

    fixture = TestBed.createComponent(GithubUserSearchUI);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
