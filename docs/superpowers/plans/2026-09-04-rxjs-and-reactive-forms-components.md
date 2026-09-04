# RxJS Live Search & Reactive Forms Registration Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two new standalone components (`LiveSearch` demonstrating RxJS stream composition and `RegistrationForm` demonstrating Reactive Forms with cross-field validation) to the `Angular-Portfolio` dashboard, fully integrated with deep `<details>` technical explanations.

**Architecture:** 
- `LiveSearch` couples an injectable `SearchService` (returning delayed `Observable<SearchResult[]>`) with a component that binds a `FormControl` through a `debounceTime` -> `distinctUntilChanged` -> `switchMap` pipeline, rendered declaratively with Angular's `AsyncPipe`.
- `RegistrationForm` leverages `FormBuilder` to construct a strongly-typed `FormGroup` with standard validators and a custom group-level `passwordMatchValidator`, displaying reactive errors conditionally when controls are touched or dirty.
- Both components are mounted as responsive cards in `app.html` alongside deep educational breakdowns in `<details>` tags for both the new and existing components.

**Tech Stack:** Angular 21 (Standalone components, modern control flow `@if` / `@for`), TypeScript 5.9, RxJS 7.8, `@angular/forms`, Tailwind CSS v4, Vitest / Angular unit-test builder.

**Spec:** [`docs/superpowers/specs/2026-09-04-rxjs-and-reactive-forms-components-design.md`](file:///C:/Dev/Angular-Projects/Angular-Portfolio/docs/superpowers/specs/2026-09-04-rxjs-and-reactive-forms-components-design.md)

## Global Constraints
- Target Framework: Angular 21.2+ with Standalone components (`imports` array).
- Styling: Use Tailwind CSS with dark theme palette consistent with existing components (`#111111` surface, `#222222` border, `#7b68ee` brand accent).
- Reactive Forms: Standard `@angular/forms` with typed forms and `Validators`.
- RxJS: Standard operators (`debounceTime`, `distinctUntilChanged`, `switchMap`, `catchError`, `tap`, `of`, `delay`).
- Testing: Execute unit tests with `npx ng test --watch=false`.

---

### Task 1: Fix Pre-existing Spec Casing Typo

**Files:**
- Modify: `src/app/chat-ui/chat-ui.spec.ts:3`
- Modify: `src/app/github-user-search-ui/github-user-search-ui.spec.ts:3`

**Interfaces:**
- Consumes: Exported class names `ChatUI` and `GithubUserSearchUI`.
- Produces: Clean baseline test execution where all pre-existing suites compile and run.

- [ ] **Step 1: Inspect the existing casing mismatches**
  In `src/app/chat-ui/chat-ui.spec.ts`: import says `ChatUi`, class is `ChatUI`.
  In `src/app/github-user-search-ui/github-user-search-ui.spec.ts`: import says `GithubUserSearchUi`, class is `GithubUserSearchUI`.

- [ ] **Step 2: Update import statements in spec files**
  Update `chat-ui.spec.ts` to import `{ ChatUI }`.
  Update `github-user-search-ui.spec.ts` to import `{ GithubUserSearchUI }`.

- [ ] **Step 3: Run existing unit tests to verify baseline passes**
  Run: `npx ng test --watch=false`
  Expected: Existing unit tests compile and run without TypeScript import errors.

- [ ] **Step 4: Commit**
  ```bash
  git add src/app/chat-ui/chat-ui.spec.ts src/app/github-user-search-ui/github-user-search-ui.spec.ts
  git commit -m "fix(test): correct class name casing in chat-ui and github-user-search-ui specs"
  ```

---

### Task 2: Implement SearchService (RxJS Data Provider)

**Files:**
- Create: `src/app/live-search/search.service.ts`
- Create: `src/app/live-search/search.service.spec.ts`

**Interfaces:**
- Consumes: `Observable`, `of`, `delay` from `rxjs`.
- Produces:
  - `export interface SearchResult { id: string; name: string; category: string; description: string; tags: string[]; }`
  - `export class SearchService { search(query: string): Observable<SearchResult[]> }`

- [ ] **Step 1: Write failing unit test for SearchService**
  Create `src/app/live-search/search.service.spec.ts`:
  ```typescript
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
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx ng test --watch=false --include=src/app/live-search/search.service.spec.ts`
  Expected: FAIL with module not found / `SearchService` not defined.

- [ ] **Step 3: Implement SearchService**
  Create `src/app/live-search/search.service.ts`:
  ```typescript
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
  ```

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx ng test --watch=false --include=src/app/live-search/search.service.spec.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add src/app/live-search/search.service.ts src/app/live-search/search.service.spec.ts
  git commit -m "feat(search): add SearchService with in-memory dataset and simulated latency"
  ```

---

### Task 3: Implement LiveSearch Component (RxJS Reactive Stream)

**Files:**
- Create: `src/app/live-search/live-search.ts`
- Create: `src/app/live-search/live-search.html`
- Create: `src/app/live-search/live-search.css`
- Create: `src/app/live-search/live-search.spec.ts`

**Interfaces:**
- Consumes: `SearchService`, `SearchResult` from `./search.service`, `ReactiveFormsModule`, `AsyncPipe`.
- Produces: Standalone `<app-live-search>` component ready to mount.

- [ ] **Step 1: Write failing unit test for LiveSearch component**
  Create `src/app/live-search/live-search.spec.ts`:
  ```typescript
  import { ComponentFixture, TestBed } from '@angular/core/testing';
  import { LiveSearch } from './live-search';
  import { SearchService } from './search.service';
  import { of } from 'rxjs';

  describe('LiveSearch', () => {
    let component: LiveSearch;
    let fixture: ComponentFixture<LiveSearch>;
    let searchServiceMock: jasmine.SpyObj<SearchService>;

    beforeEach(async () => {
      searchServiceMock = jasmine.createSpyObj('SearchService', ['search']);
      searchServiceMock.search.and.returnValue(of([
        { id: '1', name: 'Angular', category: 'Framework', description: 'Web framework', tags: ['frontend'] }
      ]));

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

    it('should trigger search on input value change', (done) => {
      component.searchTerm.setValue('ang');
      setTimeout(() => {
        expect(searchServiceMock.search).toHaveBeenCalledWith('ang');
        done();
      }, 350);
    });
  });
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx ng test --watch=false --include=src/app/live-search/live-search.spec.ts`
  Expected: FAIL with `LiveSearch` not found.

- [ ] **Step 3: Implement LiveSearch component logic, template, and styles**
  Create `src/app/live-search/live-search.css`:
  ```css
  /* Component styles conforming to dark theme */
  ```
  Create `src/app/live-search/live-search.ts`:
  ```typescript
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
  ```

  Create `src/app/live-search/live-search.html`:
  ```html
  <div class="card flex flex-col justify-between h-full">
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Live Search</h2>
        <span class="text-xs bg-[#7b68ee]/20 text-[#7b68ee] px-2 py-0.5 rounded-full font-medium">
          RxJS Streams
        </span>
      </div>

      <div class="relative">
        <input
          type="text"
          [formControl]="searchTerm"
          placeholder="Type to search (e.g. Angular, CSS)..."
          class="w-full bg-[#111111] border border-[#222222] focus:border-[#7b68ee] rounded-lg py-2 pl-3 pr-10 text-sm text-white placeholder:text-gray-500 focus:outline-none transition"
        />
        @if (searchTerm.value) {
          <button
            type="button"
            (click)="clearSearch()"
            class="absolute right-3 top-2.5 text-gray-400 hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        }
      </div>

      <div class="flex items-center justify-between mt-2 text-xs text-gray-400">
        <span>Debounced 300ms + switchMap</span>
        @if (loading()) {
          <span class="text-[#7b68ee] animate-pulse flex items-center gap-1 font-medium">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#7b68ee] animate-ping"></span>
            Searching...
          </span>
        }
      </div>

      @if (error()) {
        <div class="mt-3 p-2 bg-red-950/40 border border-red-800 text-red-400 text-xs rounded-lg">
          {{ error() }}
        </div>
      }

      <div class="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1">
        @if (results$ | async; as results) {
          @if (searchTerm.value.trim() && results.length === 0 && !loading()) {
            <div class="text-center text-xs text-gray-400 py-6">
              No results matching "{{ searchTerm.value }}"
            </div>
          } @else if (!searchTerm.value.trim()) {
            <div class="text-center text-xs text-gray-500 py-6">
              Start typing to stream search results...
            </div>
          } @else {
            @for (item of results; track item.id) {
              <div class="p-2.5 rounded-xl bg-[#111111] border border-[#222222] hover:border-[#7b68ee]/50 transition">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-semibold text-white">{{ item.name }}</span>
                  <span class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-gray-300">
                    {{ item.category }}
                  </span>
                </div>
                <p class="text-xs text-gray-400 mt-1">{{ item.description }}</p>
                <div class="flex flex-wrap gap-1 mt-2">
                  @for (tag of item.tags; track tag) {
                    <span class="text-[10px] text-gray-500 bg-black/40 px-1.5 py-0.5 rounded">
                      #{{ tag }}
                    </span>
                  }
                </div>
              </div>
            }
          }
        }
      </div>
    </div>
  </div>
  ```

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx ng test --watch=false --include=src/app/live-search/live-search.spec.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add src/app/live-search/
  git commit -m "feat(search): implement LiveSearch component with RxJS pipeline"
  ```

---

### Task 4: Implement RegistrationForm Component (Reactive Forms & Validation)

**Files:**
- Create: `src/app/registration-form/registration-form.ts`
- Create: `src/app/registration-form/registration-form.html`
- Create: `src/app/registration-form/registration-form.css`
- Create: `src/app/registration-form/registration-form.spec.ts`

**Interfaces:**
- Consumes: `@angular/forms` (`FormGroup`, `FormControl`, `FormBuilder`, `Validators`, `ValidatorFn`, `AbstractControl`, `ValidationErrors`).
- Produces: Standalone `<app-registration-form>` component with cross-field password matching.

- [ ] **Step 1: Write failing unit test for RegistrationForm**
  Create `src/app/registration-form/registration-form.spec.ts`:
  ```typescript
  import { ComponentFixture, TestBed } from '@angular/core/testing';
  import { RegistrationForm } from './registration-form';

  describe('RegistrationForm', () => {
    let component: RegistrationForm;
    let fixture: ComponentFixture<RegistrationForm>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [RegistrationForm]
      }).compileComponents();

      fixture = TestBed.createComponent(RegistrationForm);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be invalid initially', () => {
      expect(component.form.valid).toBe(false);
    });

    it('should validate required fields and email format', () => {
      const email = component.form.get('email');
      email?.setValue('invalid-email');
      expect(email?.hasError('email')).toBe(true);

      email?.setValue('test@example.com');
      expect(email?.hasError('email')).toBe(false);
    });

    it('should validate cross-field password matching', () => {
      component.form.patchValue({
        password: 'password123',
        confirmPassword: 'password456'
      });
      expect(component.form.hasError('passwordMismatch')).toBe(true);

      component.form.patchValue({
        confirmPassword: 'password123'
      });
      expect(component.form.hasError('passwordMismatch')).toBe(false);
    });

    it('should submit successfully when all fields are valid', () => {
      component.form.setValue({
        username: 'johndoe',
        email: 'john@example.com',
        password: 'securePassword123',
        confirmPassword: 'securePassword123',
        agreeTerms: true
      });

      expect(component.form.valid).toBe(true);
      component.onSubmit();
      expect(component.submitted()).toBe(true);
      expect(component.registeredUser()?.username).toBe('johndoe');
    });
  });
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx ng test --watch=false --include=src/app/registration-form/registration-form.spec.ts`
  Expected: FAIL with `RegistrationForm` not found.

- [ ] **Step 3: Implement RegistrationForm component, template, and styles**
  Create `src/app/registration-form/registration-form.css`:
  ```css
  /* Registration form styles */
  ```
  Create `src/app/registration-form/registration-form.ts`:
  ```typescript
  import { Component, inject, signal } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

  export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (!password || !confirmPassword) {
      return null;
    }
    return password === confirmPassword ? null : { passwordMismatch: true };
  };

  @Component({
    selector: 'app-registration-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './registration-form.html',
    styleUrl: './registration-form.css'
  })
  export class RegistrationForm {
    private fb = inject(FormBuilder);

    form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      agreeTerms: [false, [Validators.requiredTrue]]
    }, { validators: [passwordMatchValidator] });

    submitted = signal(false);
    registeredUser = signal<{ username: string; email: string } | null>(null);

    isInvalid(controlName: string): boolean {
      const control = this.form.get(controlName);
      return !!(control && control.invalid && (control.dirty || control.touched));
    }

    hasError(controlName: string, errorName: string): boolean {
      const control = this.form.get(controlName);
      return !!(control && control.hasError(errorName) && (control.dirty || control.touched));
    }

    get isPasswordMismatch(): boolean {
      const confirmCtrl = this.form.get('confirmPassword');
      return !!(this.form.hasError('passwordMismatch') && (confirmCtrl?.dirty || confirmCtrl?.touched));
    }

    onSubmit() {
      this.form.markAllAsTouched();
      if (this.form.valid) {
        const val = this.form.getRawValue();
        this.registeredUser.set({
          username: val.username || '',
          email: val.email || ''
        });
        this.submitted.set(true);
      }
    }

    resetForm() {
      this.form.reset({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      });
      this.submitted.set(false);
      this.registeredUser.set(null);
    }
  }
  ```

  Create `src/app/registration-form/registration-form.html`:
  ```html
  <div class="card flex flex-col justify-between h-full">
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Registration</h2>
        <span class="text-xs px-2 py-0.5 rounded-full font-medium"
              [ngClass]="form.valid ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60' : 'bg-zinc-800 text-gray-400'">
          {{ form.valid ? 'Form Valid' : 'Incomplete' }}
        </span>
      </div>

      @if (submitted() && registeredUser(); as user) {
        <div class="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-center space-y-3 my-auto">
          <div class="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
            ✓
          </div>
          <div>
            <h3 class="text-sm font-bold text-white">Account Created!</h3>
            <p class="text-xs text-gray-400 mt-1">Welcome, <strong class="text-emerald-300">{{ user.username }}</strong></p>
            <p class="text-xs text-gray-500">{{ user.email }}</p>
          </div>
          <button
            type="button"
            (click)="resetForm()"
            class="bg-[#7b68ee] hover:opacity-90 text-white text-xs font-semibold py-2 px-4 rounded-lg transition cursor-pointer"
          >
            Register Another
          </button>
        </div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-3">
          <!-- Username -->
          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1">Username</label>
            <input
              type="text"
              formControlName="username"
              placeholder="e.g. alexdev"
              class="w-full bg-[#111111] border rounded-lg py-1.5 px-3 text-xs text-white placeholder:text-gray-500 focus:outline-none transition"
              [ngClass]="isInvalid('username') ? 'border-red-500/60 focus:border-red-500' : 'border-[#222222] focus:border-[#7b68ee]'"
            />
            @if (hasError('username', 'required')) {
              <p class="text-[11px] text-red-400 mt-0.5">Username is required.</p>
            } @else if (hasError('username', 'minlength')) {
              <p class="text-[11px] text-red-400 mt-0.5">Must be at least 3 characters.</p>
            }
          </div>

          <!-- Email -->
          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              formControlName="email"
              placeholder="user@example.com"
              class="w-full bg-[#111111] border rounded-lg py-1.5 px-3 text-xs text-white placeholder:text-gray-500 focus:outline-none transition"
              [ngClass]="isInvalid('email') ? 'border-red-500/60 focus:border-red-500' : 'border-[#222222] focus:border-[#7b68ee]'"
            />
            @if (hasError('email', 'required')) {
              <p class="text-[11px] text-red-400 mt-0.5">Email is required.</p>
            } @else if (hasError('email', 'email')) {
              <p class="text-[11px] text-red-400 mt-0.5">Enter a valid email address.</p>
            }
          </div>

          <!-- Password Grid -->
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                formControlName="password"
                placeholder="••••••"
                class="w-full bg-[#111111] border rounded-lg py-1.5 px-3 text-xs text-white placeholder:text-gray-500 focus:outline-none transition"
                [ngClass]="isInvalid('password') ? 'border-red-500/60 focus:border-red-500' : 'border-[#222222] focus:border-[#7b68ee]'"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-300 mb-1">Confirm</label>
              <input
                type="password"
                formControlName="confirmPassword"
                placeholder="••••••"
                class="w-full bg-[#111111] border rounded-lg py-1.5 px-3 text-xs text-white placeholder:text-gray-500 focus:outline-none transition"
                [ngClass]="(isInvalid('confirmPassword') || isPasswordMismatch) ? 'border-red-500/60 focus:border-red-500' : 'border-[#222222] focus:border-[#7b68ee]'"
              />
            </div>
          </div>
          @if (hasError('password', 'minlength')) {
            <p class="text-[11px] text-red-400">Password must be at least 6 characters.</p>
          } @else if (isPasswordMismatch) {
            <p class="text-[11px] text-red-400">Passwords do not match.</p>
          }

          <!-- Terms -->
          <div class="pt-1">
            <label class="flex items-center gap-2 cursor-pointer select-none text-xs text-gray-300">
              <input
                type="checkbox"
                formControlName="agreeTerms"
                class="rounded bg-[#111111] border-[#222222] text-[#7b68ee] focus:ring-0 cursor-pointer"
              />
              <span>I agree to terms & conditions</span>
            </label>
            @if (hasError('agreeTerms', 'required')) {
              <p class="text-[11px] text-red-400 mt-0.5">You must agree to continue.</p>
            }
          </div>

          <!-- Buttons -->
          <div class="flex items-center gap-2 pt-2">
            <button
              type="submit"
              [disabled]="form.invalid"
              class="flex-1 bg-[#7b68ee] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2 px-3 rounded-lg text-xs transition cursor-pointer"
            >
              Sign Up
            </button>
            <button
              type="button"
              (click)="resetForm()"
              class="text-gray-400 hover:text-white text-xs font-semibold py-2 px-3 rounded-lg border border-[#222222] transition cursor-pointer"
            >
              Reset
            </button>
          </div>
        </form>
      }
    </div>
  </div>
  ```

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx ng test --watch=false --include=src/app/registration-form/registration-form.spec.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add src/app/registration-form/
  git commit -m "feat(forms): implement RegistrationForm with custom cross-field validation"
  ```

---

### Task 5: Integrate into App and Enrich `<details>` Explanations

**Files:**
- Modify: `src/app/app.ts:1-24`
- Modify: `src/app/app.html:1-98`
- Modify: `src/app/app.spec.ts:1-23`

**Interfaces:**
- Consumes: `LiveSearch` from `./live-search/live-search`, `RegistrationForm` from `./registration-form/registration-form`.
- Produces: 12-card dashboard featuring all components and detailed documentation accordions.

- [ ] **Step 1: Update `src/app/app.ts`**
  Import and add `LiveSearch` and `RegistrationForm` to `imports`:
  ```typescript
  import { Component, signal } from '@angular/core';
  import { Stopwatch } from './stopwatch/stopwatch';
  import { Quiz } from './quiz/quiz';
  import { PasswordGenerator } from './password-generator/password-generator';
  import { ChatUI } from './chat-ui/chat-ui';
  import { GithubUserSearchUI } from './github-user-search-ui/github-user-search-ui';
  import { VotingApp } from './voting-app/voting-app';
  import { NotesApp } from './notes-app/notes-app';
  import { MiniCartSystem } from './mini-cart-system/mini-cart-system';
  import { TrafficSignal } from './traffic-signal/traffic-signal';
  import { DigitalWorldClock } from './digital-world-clock/digital-world-clock';
  import { LiveSearch } from './live-search/live-search';
  import { RegistrationForm } from './registration-form/registration-form';

  @Component({
    selector: 'app-root',
    standalone: true,
    imports: [
      Stopwatch, Quiz, PasswordGenerator, ChatUI, GithubUserSearchUI,
      VotingApp, NotesApp, MiniCartSystem, TrafficSignal, DigitalWorldClock,
      LiveSearch, RegistrationForm
    ],
    templateUrl: './app.html',
    styleUrl: './app.css'
  })
  export class App {
    protected readonly title = signal('Angular-Portfolio');
  }
  ```

- [ ] **Step 2: Update `src/app/app.html`**
  - Add the two new component cards inside the grid (`app-live-search` and `app-registration-form`), each with its own `<details>` card.
  - Enrich the `<details>` explanations for all components:
    - **Live Search:** Explain `valueChanges` Observable, `debounceTime(300)` frequency control, `distinctUntilChanged()` skipping no-op events, `switchMap()` canceling stale in-flight requests, and `AsyncPipe` auto-unsubscribing.
    - **Registration Form:** Explain `FormGroup`, typed controls, synchronous validators, error states checking `dirty || touched`, custom group-level `passwordMatchValidator`, and separation of validation logic from the template.
    - **Stopwatch:** Deepen explanation of writeable `signal()` vs lazily-evaluated memoized `computed()`.
    - **Voting App:** Emphasize `@Injectable({ providedIn: 'root' })` singleton service injected via modern `inject(PollStore)`.
    - **Notes App & Mini Cart:** Clarify reactive `effect()` constraints (pure side-effects, syncing to `localStorage`, tracking signals automatically).
    - **Clock & Traffic Signal:** Clarify lifecycle hooks `ngOnInit` and `ngOnDestroy` managing timers to prevent browser memory leaks.

- [ ] **Step 3: Update `src/app/app.spec.ts`**
  Ensure root app compiles with all 12 standalone components imported.

- [ ] **Step 4: Run unit tests**
  Run: `npx ng test --watch=false`
  Expected: PASS on all suites.

- [ ] **Step 5: Commit**
  ```bash
  git add src/app/app.ts src/app/app.html src/app/app.spec.ts
  git commit -m "feat(portfolio): integrate LiveSearch and RegistrationForm with expanded technical documentation"
  ```

---

### Task 6: Full Verification & Build Validation

**Files:**
- Test all components and production build output.

- [ ] **Step 1: Run comprehensive test suite**
  Run: `npx ng test --watch=false`
  Expected: All unit tests pass with zero failures.

- [ ] **Step 2: Run production build**
  Run: `npm run build`
  Expected: Successful bundle generation with exit code 0.

- [ ] **Step 3: Review git status**
  Run: `git status`
  Expected: Clean working tree on branch master.
