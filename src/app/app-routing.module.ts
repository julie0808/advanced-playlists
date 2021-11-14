import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TagsComponent } from './tags/tags.component';
import { VideosComponent } from './videos/videos.component';
import { TagEditComponent } from './tags/tag-edit/tag-edit.component';
import { TagsResolverService } from './tags/tags-resolver-service';
import { VideoTagComponent } from './videos/video-tag/video-tag.component';
import { VideosResolverService } from './videos/videos-resolver-service';

const routes: Routes = [
  { path: '', redirectTo: '/videos', pathMatch: 'full' },
  { path: 'tags', component: TagsComponent, resolve: [TagsResolverService], children: [
    { path: 'new', component: TagEditComponent },
    { path: ':id/edit', component: TagEditComponent }
  ] },
  { path: 'videos', component: VideosComponent, resolve: [TagsResolverService, VideosResolverService], children: [
    { path: ':id/edit-tag', component: VideoTagComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
