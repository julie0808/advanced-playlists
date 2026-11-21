import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { Observable, Subject, of } from 'rxjs';

import { Tag } from '../../tags/tag.model';
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
  getSortingFullIncludedTags,
  getSortingIncludedTags, 
  getSortingExcludedTags, 
  getSortingIncludedArtistTags,
  getSortingNeedsReview, 
  getSortingSelectedRatings, 
  getSortingOldestFirst } from '../state';
import { getCurrentPlaylistId } from '../../shared/state';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MultiSelectModule, CheckboxModule, SelectModule, RatingModule],
  templateUrl: './filters.component.html',
  styleUrls: ['filters.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class FiltersComponent implements OnInit {

  includedFullTagList: Tag[] = [];
  includedTagList: Tag[] = [];
  excludedTagList: Tag[] = [];
  includedArtistTagList: Tag[] = [];
  selectedRatings: VideoRating[] = [];
  showNeedsReview: boolean = false;
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
    this.tagListForInclude$ = this.store.select(getIncludedTagsForPrimeNg);//dafuq
    this.tagListForExclude$ = this.store.select(getExcludedTagsForPrimeNg);//dafuqnpm 

    this.store.select(getSortingFullIncludedTags)
      .subscribe(includedFullTagList => {
        this.includedFullTagList = includedFullTagList;
      });

    this.store.select(getSortingIncludedTags)
      .subscribe(includedTagList => {
        this.includedTagList = includedTagList; 
      });

    this.store.select(getSortingExcludedTags)
      .subscribe(excludedTagList => {
        this.excludedTagList = excludedTagList;        
      });

    this.store.select(getSortingIncludedArtistTags)
      .subscribe(includedArtistTagList => {
        this.includedArtistTagList = includedArtistTagList; 
        console.log(this.includedArtistTagList);
      });

    this.store.select(getSortingSelectedRatings)
      .subscribe(rating => {
        this.selectedRatings = rating;        
      });

    this.store.select(getSortingNeedsReview)
      .subscribe(needsReview => {
        this.showNeedsReview = needsReview;        
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
    this.includedFullTagList = [...this.includedTagList, ...this.includedArtistTagList];

    this.store.dispatch(VideoPageActions.setSortingIncludedTags({ 
      tags: this.includedFullTagList, 
      excludedTags: this.excludedTagList })
    );
  }

  sortByRating(){
    this.store.dispatch(VideoPageActions.setSortingSelectedRatings({ ratings: this.selectedRatings }));
  }

  filterNeedsReview(){
    this.store.dispatch(VideoPageActions.setSortingNeedsReview({ needsReview: this.showNeedsReview }));
  }

  orderByOldestFirst(){
    this.store.dispatch(VideoPageActions.setSortingOldestFirst({ isOldestFirst: this.orderOldestFirst }));
  }

  showNumberofTagSelected(){
    const nbSelected: number = this.includedTagList.length;
    let selectionText = '';
    if ( nbSelected > 0 ){
      selectionText = nbSelected > 1 ? `${nbSelected} tags selected` : '1 tag selected';
    }

    return selectionText;
  }

  showNumberofExcludedTagSelected(){
    const nbSelected: number = this.excludedTagList.length;
    let selectionText = '';
    if ( nbSelected > 0 ){
      selectionText = nbSelected > 1 ? `${nbSelected} tags excluded` : '1 tag excluded';
    }
    
    return selectionText;
  }

  showNumberofArtistSelected(){
    const nbSelected: number = this.includedArtistTagList.length;
    let selectionText = '';
    if ( nbSelected > 0 ){
      selectionText = nbSelected > 1 ? `${nbSelected} artist selected` : '1 artist selected';
    }
    
    return selectionText;
  }

  removeSortByRating(){
    this.selectedRatings = [];
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
