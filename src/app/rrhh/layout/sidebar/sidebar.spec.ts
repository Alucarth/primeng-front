import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters navigation items by label', () => {
    const search = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    search.value = 'emple';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('.sidebar__link');
    expect(links).toHaveLength(1);
    expect(links[0].textContent).toContain('Empleados');
  });

  it('opens the parametric menu', () => {
    component.toggleParametrics();

    expect(component.isParametricsOpen()).toBe(true);
  });

  it('filters the parametric submenu by child label', () => {
    const search = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    search.value = 'estado';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.filteredNavItems()).toHaveLength(1);
    expect(component.filteredNavItems()[0].label).toBe('Paramétricas');
  });

  it('emits the next collapsed state', () => {
    let collapsed = false;
    component.collapsedChange.subscribe((value) => (collapsed = value));

    component.toggleCollapsed();

    expect(collapsed).toBe(true);
  });
});
