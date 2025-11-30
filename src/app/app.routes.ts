import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListInventoryComponent } from './list_inventory/list-inventory/list-inventory.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'inventory',
    component: ListInventoryComponent
  }
];
