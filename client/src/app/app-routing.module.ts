import { Routes } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';
import { InterfaceComponent } from './interface/interface.component';
import { LoginComponent } from './auth/login.component';



export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/fancyt', 
    pathMatch: 'full' 
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'fancyt',
    canActivate: [AuthGuardService],
    component: InterfaceComponent,
    children: [
      { path: '', redirectTo: 'videos', pathMatch: 'full' },
      { 
        path: 'videos', 
        data: { preload: false },
        loadChildren: () =>
          import('./videos/video.module').then(m => m.VideoModule)
      },
      { 
        path: 'tags', 
        data: { preload: false },
        loadChildren: () =>
          import('./tags/tag.module').then(m => m.TagModule)
      },
      { 
        path: 'playlists', 
        data: { preload: false },
        loadChildren: () =>
          import('./playlists/playlist.module').then(m => m.PlaylistModule)
      }
    ]
  }
];