import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Parse } from 'parse';
import { Subscription } from 'rxjs';

import { Tag } from '../../../models/tag-model';
import { TagService } from '../tag-service';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html'
})
export class TagListComponent implements OnInit, OnDestroy {
  TagParse = Parse.Object.extend("Tag");
  tagList: Tag[];
  tagListSub: Subscription;
  isFetching = false;

  constructor(private route: ActivatedRoute,
              private tagService: TagService,
              private router: Router) { 
  }

  ngOnInit() {
    this.tagListSub = this.tagService.tagsChanged
      .subscribe(
        (tags: Tag[]) => {
          this.tagList = tags;
        }
      );
    this.tagList = this.tagService.getTags();
  }

  onEdit(objectId: string) {
    this.router.navigate([objectId, 'edit'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

  ngOnDestroy() {
    this.tagListSub.unsubscribe();
  }

}
