import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { ITag } from '../tag.model';

import { Store } from '@ngrx/store';
import { State, getTags } from '../state/tag.reducer';
import * as TagActions from '../state/tag.action';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['tag-list.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class TagListComponent implements OnInit {

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  tagGroups$!: Observable<ITag[]>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
    private router: Router) { 
  }

  ngOnInit(): void {
    this.tagGroups$ = this.store.select(getTags);
    this.store.dispatch(TagActions.loadTags());
  }

  editTag(objectId: number) {
    this.store.dispatch(TagActions.setCurrentTag({ tagId: objectId }));
    this.router.navigate([objectId, 'edit'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

}
