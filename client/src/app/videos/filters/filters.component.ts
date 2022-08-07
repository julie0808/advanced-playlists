import { Component, OnInit } from '@angular/core';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
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

  tagsDropdown: IDropdownSettings = {
    idField: 'id',
    textField: 'title',
    enableCheckAll: false,
    allowSearchFilter: true,
    searchPlaceholderText: 'Sort'
  };
  tagList: ITag[] = [];
  selectedTagList: ITag[] = [];

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  tags$ = this.tagService.tagsModified$
    .pipe(
      //tap(tags => console.log(tags)),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY; 
      })
    );

  constructor(private tagService: TagService,
              private videoService: VideoService) { }

  ngOnInit(): void {
    this.tags$.subscribe(tags => this.tagList = tags || []);
  }

  sortByTag(){
    this.videoService.sortVideoListByTag(this.selectedTagList);
  }

}
