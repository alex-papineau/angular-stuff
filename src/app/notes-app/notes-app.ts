import { Component, computed, effect, signal } from '@angular/core';

@Component({
  selector: 'app-notes-app',
  imports: [],
  templateUrl: './notes-app.html',
  styleUrl: './notes-app.css',
})

export class NotesApp {
  private STORAGE_KEY = 'notes-app';

  constructor() {
    effect(() => {
      if(typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.notes()));
      }
    })
  }

  notes = signal<string[]>(this.loadNotes());
  search = signal('');

  addNote(note: string) {
    if (!note.trim() || this.notes().length >= 10) return;
    this.notes.update(list => [...list, note]);
  }

  deleteNote(i: number) {
    this.notes.update(list => list.filter((_, index) => index !== i));
  }

  filteredNotes = computed(() =>
    this.notes()
      .map((note, index) => ({ note, index }))
      .filter(item => item.note.toLowerCase().includes(this.search().toLowerCase()))
  );

  private loadNotes(): string[] {
    if(typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
}
