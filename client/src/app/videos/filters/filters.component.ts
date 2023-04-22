import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {  Subject } from 'rxjs';

import { ITag } from 'src/app/tags/tag-model';
import { TagService } from 'src/app/tags/tag-service';
import { VideoService } from '../video-service';

import { Store } from '@ngrx/store';
import { State } from '../../tags/state/tag.reducer';
import { TagApiActions, TagPageActions } from 'src/app/tags/state/actions';
import { getTags } from 'src/app/tags/state';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['filters.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class FiltersComponent implements OnInit {

  tagList: ITag[] = [];
  artistTagList: ITag[] = [];
  selectedTagList: ITag[] = [];
  selectedRating: number = 0;
  showOnlyNew: boolean = false;

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  tags$ = this.tagService.tagsModified$;

  constructor(private tagService: TagService,
              private store: Store<State>,
              private videoService: VideoService) { }

  ngOnInit(): void {
    this.tags$.subscribe(tags => {
      this.tagList = tags.filter(tag => tag.id !== 55);
      this.artistTagList = tags.filter(tag => tag.id === 55);
    });
  }

  sortByTag(){
    this.commonSortingAction();
    this.videoService.sortVideoListByTag(this.selectedTagList);
  }

  sortByRating(){
    this.commonSortingAction();
    this.videoService.sortVideoListByRating(this.selectedRating);
  }

  sortByNewOnly(){
    this.commonSortingAction();
    this.videoService.sortVideoListByNewOnly(this.showOnlyNew);
  }

  removeSortByRating(){
    this.commonSortingAction();
    this.selectedRating = 0;
    this.sortByRating();
  }

  removeTagFromFilter(tagId: number) {
    this.commonSortingAction();
    
    const selectedTagListUpdated = this.selectedTagList.filter(t => t.id !== tagId);
    this.selectedTagList = selectedTagListUpdated;
    this.videoService.sortVideoListByTag(this.selectedTagList);
  }

  commonSortingAction() {
    this.videoService.showLoadingRetroaction();
  }

}
