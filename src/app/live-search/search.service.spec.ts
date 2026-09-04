import { TestBed } from '@angular/core/testing';
import { SearchService, SearchResult } from './search.service';
import { firstValueFrom } from 'rxjs';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty array for blank query', async () => {
    const results = await firstValueFrom(service.search('   '));
    expect(results).toEqual([]);
  });

  it('should return matching items when query matches name or category', async () => {
    const results = await firstValueFrom(service.search('angular'));
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name.toLowerCase()).toContain('angular');
  });

  it('should return matching items when query matches tags', async () => {
    const results = await firstValueFrom(service.search('reactive'));
    expect(results.some(item => item.tags.includes('reactive'))).toBe(true);
  });
});
