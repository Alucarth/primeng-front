import { Component, computed, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type SidebarItem = {
  label: string;
  route: string;
  icon: 'home' | 'people';
  exact: boolean;
};

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-sidebar',
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  readonly closeRequested = output<void>();
  readonly searchTerm = signal('');
  readonly navItems: SidebarItem[] = [
    { label: 'Inicio', route: '/', icon: 'home', exact: true },
    { label: 'Empleados', route: '/employee', icon: 'people', exact: false },
  ];
  readonly filteredNavItems = computed(() => {
    const query = this.searchTerm().trim().toLocaleLowerCase();
    return query
      ? this.navItems.filter((item) => item.label.toLocaleLowerCase().includes(query))
      : this.navItems;
  });

  onSearchInput(event: Event): void {
    const input = event.target;
    if (input instanceof HTMLInputElement) {
      this.searchTerm.set(input.value);
    }
  }
}
