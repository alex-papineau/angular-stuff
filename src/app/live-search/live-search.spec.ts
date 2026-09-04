import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveSearch } from './live-search';
import { SearchService } from './search.service';
import { of } from 'rxjs';

describe('LiveSearch', () => {
  let component: LiveSearch;
  let fixture: ComponentFixture<LiveSearch>;
  let searchServiceMock: { search: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    searchServiceMock = {
      search: vi.fn().mockReturnValue(of([
        { id: '1', name: 'Angular', category: 'Framework', description: 'Web framework', tags: ['frontend'] }
      ]))
    };

    await TestBed.configureTestingModule({
      imports: [LiveSearch],
      providers: [{ provide: SearchService, useValue: searchServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(LiveSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty search term and not loading', () => {
    expect(component.searchTerm.value).toBe('');
    expect(component.loading()).toBe(false);
  });

  it('should trigger search on input value change after debounce', async () => {
    component.results$.subscribe();
    component.searchTerm.setValue('ang');
    await new Promise(resolve => setTimeout(resolve, 350));
    expect(searchServiceMock.search).toHaveBeenCalledWith('ang');
  });

  it('should clear search term when clearSearch is called', () => {
    component.searchTerm.setValue('hello');
    component.clearSearch();
    expect(component.searchTerm.value).toBe('');
  });
});
