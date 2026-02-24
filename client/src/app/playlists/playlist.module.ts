import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { PlaylistsComponent } from './playlists.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { sharedReducer } from '../shared/state/shared.reducer';
import { SharedEffects } from '../shared/state/shared.effect';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: PlaylistsComponent,
      }
    ]),
    
    StoreModule.forFeature('shared', sharedReducer),
    EffectsModule.forFeature([SharedEffects])
  ],
  declarations: [
    PlaylistsComponent
  ]
})

export class PlaylistModule {}