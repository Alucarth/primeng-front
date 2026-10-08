import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  imports: [RouterOutlet, Sidebar],
  selector: 'app-rrhh-layout',
  styleUrl: './rrhh-layout.css',
  templateUrl: './rrhh-layout.html',
})
export class RrhhLayout {
  readonly isMobileMenuOpen = signal(false);
  /** Desktop compact mode is independent from the mobile drawer state. */
  readonly isSidebarCollapsed = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((isOpen) => !isOpen);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  setSidebarCollapsed(isCollapsed: boolean): void {
    this.isSidebarCollapsed.set(isCollapsed);
  }
}
