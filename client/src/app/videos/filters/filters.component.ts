import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Observable, Subject, combineLatest, map, of } from 'rxjs';

import { Tag } from 'src/app/tags/tag.model';

import { Store } from '@ngrx/store';
import { State, getArtistTags, getOtherTagsForPrimeNg } from '../../tags/state';
import { VideoPageActions } from '../state/actions';
import { getSortingSelectedTags, getSortingSelectedNew, getSortingSelectedRatings } from '../state';


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['filters.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class FiltersComponent implements OnInit {

  /*tagList: Tag[] = [];
  artistTagList: Tag[] = [];/*/
  selectedTagList: Tag[] = [];
  selectedRating: number[] = [];
  showOnlyNew: boolean = false;

  tagList$: Observable<Tag[]> = of([]);
  artistTagList$: Observable<Tag[]> = of([]);
  selectedTagList$: Observable<Tag[]> = of([]);
  /*selectedRating$: Observable<number[]> = of([]);
  showOnlyNew$: Observable<boolean> = of(false);

  filterVM$ = combineLatest([
    this.tagList$,
    this.artistTagList$,
    this.selectedTagList$,
    this.selectedRating$,
    this.showOnlyNew$
  ]).pipe(
    map(([tagList, artistTagList, selectedTagList, selectedRating, showOnlyNew]) => 
    ({tagList, artistTagList, selectedTagList, selectedRating, showOnlyNew}))
  )*/

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor(
    private store: Store<State>) { }

  ngOnInit(): void {
    this.tagList$ = this.store.select(getOtherTagsForPrimeNg);
    this.artistTagList$ = this.store.select(getArtistTags);

    this.selectedTagList$ = this.store.select(getSortingSelectedTags);

    this.store.select(getSortingSelectedTags)
      .subscribe(selectedTagList => {
        this.selectedTagList = selectedTagList;        
      });

    this.store.select(getSortingSelectedRatings)
      .subscribe(rating => {
        this.selectedRating = rating;        
      });

    this.store.select(getSortingSelectedNew)
      .subscribe(showNew => {
        this.showOnlyNew = showNew;        
      });
  }

  sortByTag(){
    this.store.dispatch(VideoPageActions.setSortingSelectedTags({ tags: this.selectedTagList }));
  }

  sortByRating(){
    this.store.dispatch(VideoPageActions.setSortingSelectedRatings({ ratings: this.selectedRating }));
  }

  sortByNewOnly(){
    this.store.dispatch(VideoPageActions.setSortingSelectedNew({ isNew: this.showOnlyNew }));
  }

  removeSortByRating(){
    this.selectedRating = [];
    this.sortByRating();
  }

  removeTagFromFilter(tagId: number) {
    const selectedTagListUpdated = this.selectedTagList.filter(t => t.id !== tagId);
    this.selectedTagList = selectedTagListUpdated;
    this.sortByTag();
  }

}
