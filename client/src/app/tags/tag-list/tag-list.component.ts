import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Observable, Subject } from 'rxjs';

import { TagService } from '../tag-service';

import { State } from '../state/tag.reducer';
import { getTags } from '../state';
import { ITag } from '../tag-model';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['tag-list.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class TagListComponent implements OnInit {

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  tagGroups3$ = Observable<ITag[]>;

  tagGroups$ = this.tagService.tagsModified$;

  //tagGroups2$ = this.store.select(getTags);

  constructor(private route: ActivatedRoute,
              private store: Store<State>,
              private tagService: TagService,
              private router: Router) { 
  }

  ngOnInit(): void {
    // @ts-ignore
    this.tagGroups3$ = this.store.select(getTags);
  }

  editTag(objectId: number) {
    this.router.navigate([objectId, 'edit'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

}
