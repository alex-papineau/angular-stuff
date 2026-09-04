import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface SearchResult {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly dataset: SearchResult[] = [
    { id: '1', name: 'Angular', category: 'Framework', description: 'The modern web development framework powered by Signals.', tags: ['frontend', 'typescript', 'reactive'] },
    { id: '2', name: 'RxJS', category: 'Library', description: 'Reactive Extensions for JavaScript using Observables.', tags: ['async', 'reactive', 'streams'] },
    { id: '3', name: 'TypeScript', category: 'Language', description: 'Strongly typed programming language that builds on JavaScript.', tags: ['typing', 'microsoft', 'tooling'] },
    { id: '4', name: 'Tailwind CSS', category: 'Styling', description: 'A utility-first CSS framework for rapid UI development.', tags: ['css', 'styling', 'frontend'] },
    { id: '5', name: 'Vite', category: 'Build Tool', description: 'Next generation frontend tooling and blazing fast dev server.', tags: ['bundler', 'build', 'fast'] },
    { id: '6', name: 'Node.js', category: 'Runtime', description: 'Cross-platform JavaScript runtime built on Chrome\'s V8 engine.', tags: ['backend', 'runtime', 'javascript'] },
    { id: '7', name: 'GraphQL', category: 'API', description: 'A query language for your API and runtime for fulfilling queries.', tags: ['api', 'schema', 'networking'] },
    { id: '8', name: 'Docker', category: 'DevOps', description: 'Container platform for building and packaging apps.', tags: ['containers', 'devops', 'deployment'] },
    { id: '9', name: 'Vitest', category: 'Testing', description: 'A blazing fast unit test framework powered by Vite.', tags: ['testing', 'unit-tests', 'fast'] },
    { id: '10', name: 'Express', category: 'Framework', description: 'Fast, unopinionated, minimalist web framework for Node.js.', tags: ['backend', 'http', 'api'] }
  ];

  search(query: string): Observable<SearchResult[]> {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return of([]);
    }

    const filtered = this.dataset.filter(item =>
      item.name.toLowerCase().includes(trimmed) ||
      item.category.toLowerCase().includes(trimmed) ||
      item.tags.some(tag => tag.toLowerCase().includes(trimmed))
    );

    // Simulate 300ms realistic network latency
    return of(filtered).pipe(delay(300));
  }
}
