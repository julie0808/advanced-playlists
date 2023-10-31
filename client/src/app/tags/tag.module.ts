import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';


import { TagEditComponent } from './tag-edit/tag-edit.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { TagsComponent } from './tags.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { tagReducer } from './state/tag.reducer';
import { TagEffects } from './state/tag.effects';
import { sharedReducer } from '../shared/state/shared.reducer';
import { SharedEffects } from '../shared/state/shared.effect';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: TagsComponent,
        children: [
          {
            path: ':id/edit',
            component: TagEditComponent
          }
        ]
      }
    ]),
    
    StoreModule.forFeature('tags', tagReducer),
    EffectsModule.forFeature([TagEffects]),
    StoreModule.forFeature('shared', sharedReducer),
    EffectsModule.forFeature([SharedEffects])
  ],
  declarations: [
    TagListComponent,
    TagsComponent,
    TagEditComponent
  ]
})

export class TagModule {}