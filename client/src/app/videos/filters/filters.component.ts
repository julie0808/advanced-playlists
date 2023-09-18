import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';

import { Tag } from 'src/app/tags/tag.model';
import { VideoService } from '../video.service';

import { Store } from '@ngrx/store';
import { State, getArtistTags, getOtherTagsForPrimeNg } from '../../tags/state/tag.reducer';
import * as TagActions from '../../tags/state/tag.action';
import { setSortingSelectedNew, setSortingSelectedTags, setSortingSelectedRatings } from '../state/video.action';


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['filters.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class FiltersComponent implements OnInit {

  tagList: Tag[] = [];
  artistTagList: Tag[] = [];
  selectedTagList: Tag[] = [];
  selectedRating: number = 0;
  showOnlyNew: boolean = false;

  tagList$ = this.store.select(getOtherTagsForPrimeNg);
  artistTagList$ = this.store.select(getArtistTags);

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor(
    private store: Store<State>,
    private videoService: VideoService) { }

  ngOnInit(): void {
    this.store.dispatch(TagActions.loadTags());
  }

  sortByTag(){
    this.store.dispatch(setSortingSelectedTags({ tags: this.selectedTagList }));
  }

  sortByRating(){
    // temp, until ratings are made multi selectable
    const ratingAsArray = [this.selectedRating];

    this.store.dispatch(setSortingSelectedRatings({ ratings: ratingAsArray }));
  }

  sortByNewOnly(){
    this.store.dispatch(setSortingSelectedNew({ isNew: this.showOnlyNew }));
  }

  removeSortByRating(){
    this.selectedRating = 0;
    this.sortByRating();
  }

  removeTagFromFilter(tagId: number) {
    const selectedTagListUpdated = this.selectedTagList.filter(t => t.id !== tagId);
    this.selectedTagList = selectedTagListUpdated;
    this.sortByTag();
  }

}
