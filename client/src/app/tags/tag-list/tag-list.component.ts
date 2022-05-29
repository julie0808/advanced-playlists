import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TagService } from '../tag-service';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html'
})
export class TagListComponent {

  isFetching = false;

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  tags$ = this.tagService.tagsModified$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY; 
      })
    );

  constructor(private route: ActivatedRoute,
              private tagService: TagService,
              private router: Router) { 
  }

  editTag(objectId: number) {
    this.router.navigate([objectId, 'edit'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

}
