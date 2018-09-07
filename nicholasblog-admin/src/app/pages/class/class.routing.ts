import { Routes, RouterModule } from '@angular/router';
import { ClassComponent } from './class.component';
import { ClassManageComponent } from './class-manage/class-manage.component';
import { ClassCreateComponent } from './class-create/class-create.component';
import { ClassEditComponent } from './class-edit/class-edit.component';
import { AuthGuardService } from './auth-guard.service';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: ClassComponent,
    canActivateChild: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'classmanage', pathMatch: 'full' },
      { path: 'classmanage', component: ClassManageComponent },
      { path: 'classcreate', component: ClassCreateComponent },
      { path: 'classedit/:id', component: ClassEditComponent }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
