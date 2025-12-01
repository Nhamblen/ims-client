/**
 * Author: John Kuronya
 * Date: 24 November 2025
 * File: main-layout.component.ts
 * Description: Component for the main layout including sidebar and topbar.
 */


import { Component, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  url: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <!-- Sidebar (hidden on small screens via CSS) -->
      <aside class="sidebar">
        <div class="sidebar__brand">
          <div class="sidebar__brand-logo">IMS</div>
          <div class="sidebar__brand-text">
            <span class="sidebar__title">Inventory Manager</span>
            <span class="sidebar__subtitle">Online Business Suite</span>
          </div>
        </div>

        <nav class="sidebar__nav">
          @for (item of sidebarNav; track item.url) {
            <a
              class="sidebar__link"
              [routerLink]="item.url"
              routerLinkActive="sidebar__link--active"
            >
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>

        <div class="sidebar__footer">
          <div>Signed in as: Admin</div>
          <div class="text-muted">v1.0.0</div>
        </div>
      </aside>

      <!-- Main area -->
      <main class="main">
        <!-- Top bar -->
        <header class="topbar">
          <div class="topbar__left">
            <!-- Hamburger button (shows on mobile only via CSS) -->
            <button
              class="icon-button topbar__menu-button"
              type="button"
              aria-label="Toggle navigation menu"
              (click)="toggleMobileNav()"
            >
              <span class="topbar__menu-icon-line"></span>
              <span class="topbar__menu-icon-line"></span>
              <span class="topbar__menu-icon-line"></span>
            </button>

            <div>
              <div class="topbar__title">Inventory Management</div>
              <div class="topbar__subtitle">
                Choose a section from the navigation to get started.
              </div>
            </div>
          </div>

          <div class="topbar__right">
            <button class="button button--outline" routerLink="/inventory/add">
              Add Item
            </button>
            <button class="icon-button" aria-label="User settings">👤</button>
          </div>
        </header>

        <!-- Mobile dropdown nav (only visible when hamburger is toggled) -->
        @if (isMobileNavOpen) {
          <nav class="mobile-nav">
            @for (item of sidebarNav; track item.url) {
              <a
                class="mobile-nav__link"
                [routerLink]="item.url"
                routerLinkActive="mobile-nav__link--active"
                (click)="closeMobileNav()"
              >
                <span>{{ item.label }}</span>
              </a>
            }
          </nav>
        }

        <!-- Routed feature pages render here -->
        <section class="content">
          <router-outlet></router-outlet>
        </section>
      </main>
    </div>
  `
})
export class MainLayoutComponent {
  isMobileNavOpen = false;

  // Sidebar navigation items
  sidebarNav: NavItem[] = [
    { label: 'Home', url: '/dashboard' },
    { label: 'Create Inventory Item', url: '/inventory' },
    { label: 'List Inventory Items',   url: '/reports' },
    { label: 'Delete Inventory Item',  url: '/settings' }
  ];

  toggleMobileNav(): void {
    this.isMobileNavOpen = !this.isMobileNavOpen;
  }

  closeMobileNav(): void {
    this.isMobileNavOpen = false;
  }

  // Keep mobile nav state sane when resizing
  @HostListener('window:resize', [])
  onWindowResize(): void {
    if (window.innerWidth > 900 && this.isMobileNavOpen) {
      this.isMobileNavOpen = false;
    }
  }
}
