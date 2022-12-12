import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { TagService } from '../tag-service';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html'
})
export class TagListComponent {

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  tagGroups$ = this.tagService.tagsFormatedForGrouping$;

  constructor(private route: ActivatedRoute,
              private tagService: TagService,
              private router: Router) { 
  }

  editTag(objectId: number) {
    this.router.navigate([objectId, 'edit'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

}
