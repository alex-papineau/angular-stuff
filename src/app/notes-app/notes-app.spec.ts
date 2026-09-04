import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesApp } from './notes-app';

describe('NotesApp', () => {
  let component: NotesApp;
  let fixture: ComponentFixture<NotesApp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesApp],
    }).compileComponents();

    fixture = TestBed.createComponent(NotesApp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
