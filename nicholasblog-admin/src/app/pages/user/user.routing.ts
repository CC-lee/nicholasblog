import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { UserManageComponent } from './user-manage/user-manage.component';
import { OrderlistManageComponent } from './orderlist-manage/orderlist-manage.component';
import { OrderlistEditComponent } from './orderlist-edit/orderlist-edit.component';
import { AuthGuardService } from './auth-guard.service';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    canActivateChild: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'usermanage', pathMatch: 'full' },
      { path: 'usermanage', component: UserManageComponent, data: { title: '用户管理' } },
      { path: 'orderlistmanage', component: OrderlistManageComponent, data: { title: '订单管理' } },
      { path: 'orderlistedit/:id', component: OrderlistEditComponent, data: { title: '订单编辑' } },
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
