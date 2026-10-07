import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RrhhLayout } from './rrhh-layout';

describe('RrhhLayout', () => {
  let component: RrhhLayout;
  let fixture: ComponentFixture<RrhhLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RrhhLayout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RrhhLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens and closes the mobile navigation', () => {
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen()).toBe(true);

    component.closeMobileMenu();
    expect(component.isMobileMenuOpen()).toBe(false);
  });
});
