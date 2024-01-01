import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';
import { AppComponent } from './app.component';
import { InterfaceComponent } from './interface/interface.component';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/fancyt', 
    pathMatch: 'full' 
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
