/**
 * Author: John Kuronya
 * Date: 24 November 2025
 * File: app.routes.ts
 * Description: Application routing configuration.
 */

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout/main-layout.component';
import { InventoryItemComponent } from './inventory-item/inventory-item.component';
import { ListInventoryComponent } from './list_inventory/list-inventory/list-inventory.component';
import { InventoryUpdateComponent } from './inventory-update/inventory-update.component';
import { InventoryItemByIdComponent } from './Inventory_id/inventory-item-detail/inventory-item-by-id.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // Default route: shows HomeComponent inside the main layout
      {
        path: '',
        component: HomeComponent,
      },
      // Dashboard route (also using HomeComponent for now)
      {
        path: 'dashboard',
        component: HomeComponent,
      },

      // INVENTORY-inventory-item component
      {
        path: 'inventory',
        component: InventoryItemComponent,
      },
      {
        path: 'reports',
        component: ListInventoryComponent,
      },
      {
        path: 'update',
        component: InventoryUpdateComponent,
      },
      {
        path: 'inventory-by-id',
        component: InventoryItemByIdComponent,
      },
      {
        path: 'settings',
        component: HomeComponent, // replace later
      },
    ],
  },

  // Catch-all: redirect unknown routes back to root
  { path: '**', redirectTo: '' },
];
