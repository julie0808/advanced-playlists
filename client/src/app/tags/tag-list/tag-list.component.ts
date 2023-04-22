import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Subject } from 'rxjs';
import { State } from '../state/tag.reducer';
import { TagService } from '../tag-service';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['tag-list.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class TagListComponent {

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  tagGroups$ = this.tagService.tagsModified$;

  constructor(private route: ActivatedRoute,
              private store: Store<State>,
              private tagService: TagService,
              private router: Router) { 
  }

  editTag(objectId: number) {
    this.router.navigate([objectId, 'edit'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

}
