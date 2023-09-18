import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { TagEditComponent } from './tag-edit/tag-edit.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { TagsComponent } from './tags.component';

import { StoreModule } from '@ngrx/store';
import { tagReducer } from './state/tag.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TagEffects } from './state/tag.effects';

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
    EffectsModule.forFeature([TagEffects])
  ],
  declarations: [
    TagListComponent,
    TagsComponent,
    TagEditComponent
  ]
})

export class TagModule {}