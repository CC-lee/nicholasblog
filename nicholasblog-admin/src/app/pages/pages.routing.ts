import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { ModuleWithProviders } from '@angular/core';

const routes: Routes = [
  {
    path: 'pages',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'article/articlemanage', pathMatch: 'full' },
      { path: 'article', loadChildren: './article/article.module#ArticleModule' },
      { path: 'class', loadChildren: './class/class.module#ClassModule' },
      { path: 'message', loadChildren: './message/message.module#MessageModule' },
      { path: 'album', loadChildren: './album/album.module#AlbumModule' },
      { path: 'shop', loadChildren: './shop/shop.module#ShopModule' },
      { path: 'user', loadChildren: './user/user.module#UserModule' },
      { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
