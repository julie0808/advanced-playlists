import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

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

  tagGroups$ = this.tagService.tagsFormatedForGrouping$;

  constructor(private route: ActivatedRoute,
              private tagService: TagService,
              private router: Router) { 
  }

  editTag(objectId: number) {
    this.router.navigate([objectId, 'edit'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

}
