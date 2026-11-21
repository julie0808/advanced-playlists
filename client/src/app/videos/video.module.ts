import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { YOUTUBE_PLAYER_CONFIG, YouTubePlayerModule } from '@angular/youtube-player';

import { VideoTagEditComponent } from './video-tag-edit/video-tag-edit.component';
import { VideosComponent } from './videos.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { videoReducer } from './state/video.reducer';
import { tagReducer } from '../tags/state/tag.reducer';
import { TagEffects } from '../tags/state/tag.effects';
import { VideoEffects } from './state/video.effects';
@NgModule({
  imports: [
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
    ]),
    StoreModule.forFeature('videos', videoReducer),
    EffectsModule.forFeature([VideoEffects]),
    StoreModule.forFeature('tags', tagReducer),
    EffectsModule.forFeature([TagEffects])
  ],
  providers: [{
    provide: YOUTUBE_PLAYER_CONFIG,
    useValue: {
      loadApi: false,
      controls: 1,
      disablePlaceholder: true
    }
  }]
})

export class VideoModule {}