# Design Specification: RxJS Live Search & Reactive Forms Registration Components

**Date:** 2026-09-04  
**Project:** Angular-Portfolio  
**Status:** Approved  

---

## 1. Overview & Objectives

The `Angular-Portfolio` application demonstrates core Angular features across 10 standalone mini-components, with an emphasis on modern Signals and control flow. However, two foundational enterprise Angular capabilities are currently missing:
1. **RxJS & Asynchronous Streaming** (`Observable`, operators such as `debounceTime`, `distinctUntilChanged`, `switchMap`, and `AsyncPipe`).
2. **Reactive Forms & Validation** (`FormGroup`, `FormControl`, `Validators`, and custom cross-field validation).

This project adds two new standalone components to the portfolio:
- **`LiveSearch` (`<app-live-search>`)**: A real-time autocomplete search powered by RxJS pipelines and an injectable `SearchService`.
- **`RegistrationForm` (`<app-registration-form>`)**: A comprehensive user registration form demonstrating Angular Reactive Forms, touched/dirty validation tracking, and a cross-field password matching validator.

Both components will be fully integrated into `app.html` with expanded `<details>` explanations, matching the existing dark Tailwind UI theme.

---

## 2. Architecture & Component Details

### 2.1 Component 1: `LiveSearch` (`src/app/live-search/`)

#### Files:
- `search.service.ts`: Injectable mock data service.
- `live-search.ts`: Component TypeScript logic.
- `live-search.html`: Component template.
- `live-search.css`: Component styling.
- `live-search.spec.ts`: Unit test suite.

#### Data Model:
```typescript
export interface SearchResult {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
}
```

#### `SearchService`:
- Decorated with `@Injectable({ providedIn: 'root' })`.
- Provides an in-memory dataset of 10+ tech ecosystem items (e.g. Angular, RxJS, TypeScript, TailwindCSS, Vite, Node.js, GraphQL, Docker, Rust, Python).
- Method: `search(query: string): Observable<SearchResult[]>`.
- Trims the query; if empty, returns `of([])`.
- Filters items matching `name`, `category`, or `tags` (case-insensitive).
- Uses `of(filteredResults).pipe(delay(300))` to simulate realistic asynchronous network latency and facilitate demonstrating `switchMap` cancellation.

#### `LiveSearch` Component:
- Imports: `ReactiveFormsModule`, `AsyncPipe`, `CommonModule`.
- Form Control: `searchTerm = new FormControl('', { nonNullable: true })`.
- Signals: `loading = signal(false)`, `error = signal<string | null>(null)`.
- Observable Stream:
  ```typescript
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
          this.error.set('An error occurred during search.');
          return of([]);
        })
      )
    ),
    tap(() => this.loading.set(false))
  );
  ```
- Template consumption:
  - Input field bound via `[formControl]="searchTerm"`.
  - Loading spinner indicator displayed when `loading() === true`.
  - Results container displayed with `@if (results$ | async; as results)` using the `async` pipe, which subscribes and automatically unsubscribes on component teardown.

---

### 2.2 Component 2: `RegistrationForm` (`src/app/registration-form/`)

#### Files:
- `registration-form.ts`: Component TypeScript logic.
- `registration-form.html`: Component template.
- `registration-form.css`: Component styling.
- `registration-form.spec.ts`: Unit test suite.

#### `RegistrationForm` Component:
- Imports: `ReactiveFormsModule`, `CommonModule`.
- Injects: `FormBuilder`.
- Form Definition:
  - `username`: `['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]`
  - `email`: `['', [Validators.required, Validators.email]]`
  - `password`: `['', [Validators.required, Validators.minLength(6)]]`
  - `confirmPassword`: `['', [Validators.required]]`
  - `agreeTerms`: `[false, [Validators.requiredTrue]]`
- Cross-Field Validator (`passwordMatchValidator`):
  ```typescript
  export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (!password || !confirmPassword) return null;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };
  ```
  Configured via `{ validators: [passwordMatchValidator] }` on the `FormGroup`.
- State Tracking:
  - `submitted = signal(false)`
  - `registeredUser = signal<{ username: string; email: string } | null>(null)`
  - Helper methods: `isInvalid(controlName: string)`, `hasError(controlName: string, errorName: string)`.
  - `onSubmit()`: Marks all controls as touched (`this.form.markAllAsTouched()`). If valid, sets `submitted.set(true)` and stores `registeredUser`.
  - `resetForm()`: Resets the form to pristine, clears errors, and sets `submitted.set(false)`.

---

## 3. UI & Styling Specifications

Both components adhere to the existing card aesthetics:
- Outer container: `card flex flex-col justify-between`.
- Theme colors:
  - Background surface: `#111111`
  - Border: `#222222`
  - Accent / Primary buttons: `#7b68ee` (hover: opacity 90)
  - Inputs: `bg-[#111111] border border-[#222222] focus:border-[#7b68ee] text-white`
  - Text: `text-white`, `text-gray-400`, `text-gray-300`, `text-gray-500`
  - Error indicators: `text-red-400 text-xs mt-1`, `border-red-500/50` for invalid touched inputs.

---

## 4. Portfolio Integration & Documentation in `app.html`

### 4.1 Card Placements in `app.html`
Add two new grid columns in `src/app/app.html`:
1. `<app-live-search class="flex-grow"></app-live-search>` with `<details>` accordion explaining RxJS streaming.
2. `<app-registration-form class="flex-grow"></app-registration-form>` with `<details>` accordion explaining Reactive Forms.

### 4.2 Documentation Content
- **Live Search Explanation:**
  - Emphasizes the **Observable** stream paradigm.
  - Explains `debounceTime(300)` for throttling keystroke frequency.
  - Explains `distinctUntilChanged()` preventing redundant calls.
  - Explains `switchMap()` for request cancellation and avoiding race conditions.
  - Explains `AsyncPipe` for declarative subscription and automatic lifecycle teardown.
- **Registration Form Explanation:**
  - Explains `FormGroup`, `FormControl`, and immutable-like reactive value tracking.
  - Explains dirty/touched states for user-friendly error display timing.
  - Explains synchronous group-level cross-field validation (`passwordMatchValidator`).
- **Enhanced Existing Descriptions:**
  - Expand on `Signals` vs `computed()` memoization in Stopwatch.
  - Emphasize singleton Dependency Injection (`@Injectable` + `inject()`) in Voting App.
  - Emphasize proper side-effect boundaries for `effect()` in Notes and Cart apps.
  - Highlight `ngOnInit` / `ngOnDestroy` lifecycle management preventing timer memory leaks in Clock and Traffic Light.

---

## 5. Testing & Verification

- **`live-search.spec.ts`**:
  - Should create component and service.
  - Should emit search results when query matches items.
  - Should handle empty search queries gracefully.
- **`registration-form.spec.ts`**:
  - Form should be invalid when empty.
  - Username and email validators should flag invalid values.
  - Should flag `passwordMismatch` when passwords differ, and become valid when they match.
  - Valid submit should update `submitted` state.
- **`app.spec.ts`**:
  - Should compile and instantiate root component with all 12 mini-components imported.
- **Build verification**:
  - `npm run test` exits 0.
  - `npm run build` produces production bundle with 0 errors.
