import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { SharedModule } from '../shared/shared.module';
import { FiltersComponent } from './filters/filters.component';

import { VideoListComponent } from './video-list/video-list.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { VideoTagEditComponent } from './video-tag-edit/video-tag-edit.component';
import { VideosComponent } from './videos.component';

@NgModule({
  imports: [
    SharedModule,
    YouTubePlayerModule,
    RouterModule.forChild([
      {
        path: '',
        component: VideosComponent,
        children: [
          {
            path: ':id/edit-tag',
            component: VideoTagEditComponent
          }
        ]
      }      
    ])
  ],
  declarations: [
    VideosComponent,
    VideoListComponent,
    VideoPlayerComponent,
    VideoTagEditComponent,
    FiltersComponent
  ]
})

export class VideoModule {}