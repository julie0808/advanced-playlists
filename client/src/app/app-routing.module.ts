import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/videos', 
    pathMatch: 'full' 
  },
  {
    path: 'tags',
    data: { preload: false },
    loadChildren: () =>
      import('./tags/tag.module').then(m => m.TagModule)
  },
  {
    path: 'videos',
    canActivate: [AuthGuardService],
    data: { preload: false },
    loadChildren: () =>
      import('./videos/video.module').then(m => m.VideoModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
