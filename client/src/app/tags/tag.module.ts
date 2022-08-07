import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { TagEditComponent } from './tag-edit/tag-edit.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { TagsComponent } from './tags.component';

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
    ])
  ],
  declarations: [
    TagListComponent,
    TagsComponent,
    TagEditComponent
  ]
})

export class TagModule {}