import { Routes, RouterModule } from '@angular/router';
import { ShopComponent } from './shop.component';
import { ShopManageComponent } from './shop-manage/shop-manage.component';
import { ItemCreateComponent } from './item-create/item-create.component';
import { ItemEditComponent } from './item-edit/item-edit.component';
import { AuthGuardService } from './auth-guard.service';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: ShopComponent,
    canActivateChild: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'shopmanage', pathMatch: 'full' },
      { path: 'shopmanage', component: ShopManageComponent },
      { path: 'itemcreate', component: ItemCreateComponent },
      { path: 'itemedit/:id', component: ItemEditComponent }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
