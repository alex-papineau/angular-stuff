import { Component, inject, signal } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { SearchService, SearchResult } from './search.service';

@Component({
  selector: 'app-live-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './live-search.html',
  styleUrl: './live-search.css'
})
export class LiveSearch {
  private searchService = inject(SearchService);

  searchTerm = new FormControl('', { nonNullable: true });
  loading = signal(false);
  error = signal<string | null>(null);

  results$: Observable<SearchResult[]> = this.searchTerm.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => {
      this.loading.set(true);
      this.error.set(null);
    }),
    switchMap(term =>
      this.searchService.search(term).pipe(
        catchError(() => {
          this.error.set('Search request failed. Please try again.');
          return of([]);
        })
      )
    ),
    tap(() => this.loading.set(false))
  );

  clearSearch() {
    this.searchTerm.setValue('');
  }
}
