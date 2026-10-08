import { Component, computed, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type SidebarLink = {
  type: 'link';
  label: string;
  route: string;
  icon: 'home' | 'people';
  exact: boolean;
};

type SidebarGroup = {
  type: 'group';
  label: string;
  icon: 'settings';
  children: SidebarSubmenuLink[];
};

type SidebarSubmenuLink = {
  label: string;
  route: string;
  exact: boolean;
};

type SidebarEntry = SidebarLink | SidebarGroup;

/** Navigation for the RRHH layout, including searchable nested sections. */
@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-sidebar',
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  readonly closeRequested = output<void>();
  readonly collapsed = input(false);
  readonly collapsedChange = output<boolean>();
  readonly searchTerm = signal('');
  readonly isParametricsOpen = signal(false);
  private hoverTimeout: ReturnType<typeof setTimeout> | undefined;

  /** Keep destinations and their visual grouping together for filtering and rendering. */
  readonly navItems: SidebarEntry[] = [
    { type: 'link', label: 'Inicio', route: '/', icon: 'home', exact: true },
    { type: 'link', label: 'Empleados', route: '/employee', icon: 'people', exact: false },
    {
      type: 'group',
      label: 'Paramétricas',
      icon: 'settings',
      children: [{ label: 'Estados', route: '/status', exact: true }],
    },
  ];

  /** A child match keeps its parent group visible so the destination remains reachable. */
  readonly filteredNavItems = computed<SidebarEntry[]>(() => {
    const query = this.searchTerm().trim().toLocaleLowerCase();
    if (!query) {
      return this.navItems;
    }

    const filteredItems: SidebarEntry[] = [];
    for (const item of this.navItems) {
      if (item.type === 'link') {
        if (item.label.toLocaleLowerCase().includes(query)) {
          filteredItems.push(item);
        }
        continue;
      }

      const matchingChildren = item.children.filter((child) =>
        child.label.toLocaleLowerCase().includes(query),
      );
      if (item.label.toLocaleLowerCase().includes(query)) {
        filteredItems.push(item);
      } else if (matchingChildren.length) {
        filteredItems.push({ ...item, children: matchingChildren });
      }
    }
    return filteredItems;
  });

  toggleCollapsed(): void {
    this.collapsedChange.emit(!this.collapsed());
    this.isParametricsOpen.set(false);
  }

  toggleParametrics(): void {
    this.isParametricsOpen.update((isOpen) => !isOpen);
  }

  closeParametrics(): void {
    this.isParametricsOpen.set(false);
  }

  onParametricsRouteActive(isActive: boolean): void {
    if (isActive) {
      this.isParametricsOpen.set(true);
    }
  }

  onParametricsHover(isHovered: boolean): void {
    if (!this.collapsed()) {
      return;
    }

    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    if (isHovered) {
      this.isParametricsOpen.set(true);
    } else {
      // Keep the flyout open briefly so the pointer can move from the icon into the submenu.
      this.hoverTimeout = setTimeout(() => this.isParametricsOpen.set(false), 120);
    }
  }

  onSearchInput(event: Event): void {
    const input = event.target;
    if (input instanceof HTMLInputElement) {
      this.searchTerm.set(input.value);
      if (input.value.trim()) {
        this.isParametricsOpen.set(true);
      }
    }
  }
}
