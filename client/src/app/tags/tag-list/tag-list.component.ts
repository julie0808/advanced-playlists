import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';

import { AccordionModule } from 'primeng/accordion';
import { ScrollPanel } from 'primeng/scrollpanel';

import { Tag } from '../tag.model';

import { Store } from '@ngrx/store';
import { State, getAllTags } from '../state';
import { TagPageActions } from '../state/actions';


@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AccordionModule, ScrollPanel],
  templateUrl: './tag-list.component.html',
  styleUrls: ['tag-list.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class TagListComponent implements OnInit {

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  tagGroups$: Observable<Tag[]> = this.store.select(getAllTags);

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
    private router: Router) { 
  }

  ngOnInit(): void {

  }

  editTag(objectId: number) {
    this.store.dispatch(TagPageActions.setCurrentTag({ tagId: objectId }));
    this.router.navigate([objectId, 'edit'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

}
