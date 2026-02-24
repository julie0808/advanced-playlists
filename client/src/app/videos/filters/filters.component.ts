import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Observable, Subject, of } from 'rxjs';

import { Tag } from 'src/app/tags/tag.model';
import { VideoRating, VideoRatings } from '../video.model';

import { Store } from '@ngrx/store';
import { 
  State, 
  getArtistTags, 
  getOtherTagsForPrimeNg, 
  getIncludedTagsForPrimeNg,
  getExcludedTagsForPrimeNg
} from '../../tags/state';
import { VideoPageActions } from '../state/actions';
import { 
  getSortingIncludedTags, 
  getSortingExcludedTags, 
  getSortingSelectedNew, 
  getSortingSelectedRatings, 
  getSortingOldestFirst } from '../state';
import { getCurrentPlaylistId } from 'src/app/shared/state';


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['filters.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class FiltersComponent implements OnInit {

  includedTagList: Tag[] = [];
  excludedTagList: Tag[] = [];
  selectedRating: VideoRating[] = [];
  showOnlyNew: boolean = false;
  orderOldestFirst: boolean = false;
  ratingList: VideoRating[] = VideoRatings;
  currentPlaylistId: string = '';

  tagList$: Observable<Tag[]> = of([]);
  tagListForInclude$: Observable<Tag[]> = of([]);
  tagListForExclude$: Observable<Tag[]> = of([]);
  artistTagList$: Observable<Tag[]> = of([]);
  includedTagList$: Observable<Tag[]> = of([]);
  excludedTagList$: Observable<Tag[]> = of([]);

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor(
    private store: Store<State>) { }

  ngOnInit(): void {
    this.artistTagList$ = this.store.select(getArtistTags);
    this.includedTagList$ = this.store.select(getSortingIncludedTags);
    this.excludedTagList$ = this.store.select(getSortingExcludedTags);
    this.tagList$ = this.store.select(getOtherTagsForPrimeNg); 
    this.tagListForInclude$ = this.store.select(getIncludedTagsForPrimeNg);
    this.tagListForExclude$ = this.store.select(getExcludedTagsForPrimeNg);

    this.store.select(getSortingIncludedTags)
      .subscribe(includedTagList => {
        this.includedTagList = includedTagList;        
      });

    this.store.select(getSortingExcludedTags)
      .subscribe(excludedTagList => {
        this.excludedTagList = excludedTagList;        
      });

    this.store.select(getSortingSelectedRatings)
      .subscribe(rating => {
        this.selectedRating = rating;        
      });

    this.store.select(getSortingSelectedNew)
      .subscribe(showNew => {
        this.showOnlyNew = showNew;        
      });

    this.store.select(getSortingOldestFirst)
      .subscribe(byOldestFirst => {
        this.orderOldestFirst = byOldestFirst;        
      });

    this.store.select(getCurrentPlaylistId)
      .subscribe(playlistId => {
        this.currentPlaylistId = playlistId;
      })
  }

  hasPlaylistSelected(): boolean {
    return this.currentPlaylistId !== '' ? true : false;
  }

  sortByTag(){
    this.store.dispatch(VideoPageActions.setSortingIncludedTags({ 
      tags: this.includedTagList, 
      excludedTags: this.excludedTagList })
    );
  }

  sortByRating(){
    this.store.dispatch(VideoPageActions.setSortingSelectedRatings({ ratings: this.selectedRating }));
  }

  sortByNewOnly(){
    this.store.dispatch(VideoPageActions.setSortingSelectedNew({ isNew: this.showOnlyNew }));
  }

  orderByOldestFirst(){
    this.store.dispatch(VideoPageActions.setSortingOldestFirst({ isOldestFirst: this.orderOldestFirst }));
  }

  removeSortByRating(){
    this.selectedRating = [];
    this.sortByRating();
  }

  removeTagFromFilter(tagId: number) {
    const includedTagListUpdated = this.includedTagList.filter(t => t.id !== tagId);
    this.includedTagList = includedTagListUpdated;
    this.sortByTag();
  }

  removeExcludedTagFromFilter(tagId: number) {
    const excludedTagListUpdated = this.excludedTagList.filter(t => t.id !== tagId);
    this.excludedTagList = excludedTagListUpdated;
    this.sortByTag();
  }

}
