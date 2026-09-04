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

  it('should reset form state when resetForm is called', () => {
    component.form.setValue({
      username: 'johndoe',
      email: 'john@example.com',
      password: 'securePassword123',
      confirmPassword: 'securePassword123',
      agreeTerms: true
    });
    component.onSubmit();
    expect(component.submitted()).toBe(true);

    component.resetForm();
    expect(component.submitted()).toBe(false);
    expect(component.registeredUser()).toBeNull();
    expect(component.form.valid).toBe(false);
  });
});
