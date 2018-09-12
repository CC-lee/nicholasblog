import { Routes, RouterModule } from '@angular/router';

import { Register } from './register.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Register,
    data: { title: '注册' }
  }
];

export const routing = RouterModule.forChild(routes);
