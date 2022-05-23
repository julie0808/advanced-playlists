import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TagsComponent } from './tags/tags.component';
import { VideosComponent } from './videos/videos.component';
import { TagEditComponent } from './tags/tag-edit/tag-edit.component';
import { VideoTagEditComponent } from './videos/video-tag/video-tag-edit.component';

const routes: Routes = [
  { path: '', redirectTo: '/videos', pathMatch: 'full' },
  { path: 'tags', component: TagsComponent, children: [
    { path: ':id/edit', component: TagEditComponent }
  ] },
  { path: 'videos', component: VideosComponent, children: [
    { path: ':id/edit-tag', component: VideoTagEditComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
