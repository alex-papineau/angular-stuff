import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubUserSearchUi } from './github-user-search-ui';

describe('GithubUserSearchUi', () => {
  let component: GithubUserSearchUi;
  let fixture: ComponentFixture<GithubUserSearchUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GithubUserSearchUi],
    }).compileComponents();

    fixture = TestBed.createComponent(GithubUserSearchUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
