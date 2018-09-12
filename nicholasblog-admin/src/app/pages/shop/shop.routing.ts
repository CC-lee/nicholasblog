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
      { path: 'shopmanage', component: ShopManageComponent, data: { title: '商品管理' } },
      { path: 'itemcreate', component: ItemCreateComponent, data: { title: '商品创建' } },
      { path: 'itemedit/:id', component: ItemEditComponent, data: { title: '商品编辑' } }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
