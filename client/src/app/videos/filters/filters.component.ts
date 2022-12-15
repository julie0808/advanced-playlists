import { Component, OnInit } from '@angular/core';

import { EMPTY, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ITag } from 'src/app/tags/tag-model';
import { TagService } from 'src/app/tags/tag-service';
import { VideoService } from '../video-service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html'
})
export class FiltersComponent implements OnInit {

  tagList: ITag[] = [];
  selectedTagList: ITag[] = [];
  selectedRating: number = 0;

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  tags$ = this.tagService.tagsFormatedForGrouping$;

  constructor(private tagService: TagService,
              private videoService: VideoService) { }

  ngOnInit(): void {
    this.tags$.subscribe(tags => this.tagList = tags || []);
  }

  sortByTag(){
    this.videoService.sortVideoListByTag(this.selectedTagList);
  }

  sortByRating(){
    this.videoService.sortVideoListByRating(this.selectedRating);
  }

  removeSortByRating(){
    this.selectedRating = 0;
    this.sortByRating();
  }

  removeTagFromFilter(tagId: number) {
    const selectedTagListUpdated = this.selectedTagList.filter(t => t.id !== tagId);
    this.selectedTagList = selectedTagListUpdated;
    this.videoService.sortVideoListByTag(this.selectedTagList);
  }

}
