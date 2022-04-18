import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';

import { Tag } from '../../models/tag-model';

@Injectable({providedIn: 'root'})
export class TagService {
  tagsChanged = new Subject<Tag[]>();
  rootURL: string = '/api/v1';

  private tagList: Tag[] = [];

  constructor(private http: HttpClient) {}

  async addNewTag({id, title}: Tag) {
    const data: Tag = {
      id, // will be 0 because we won't use it anyway for insertion
      title
    }
    const body = JSON.stringify(data);

    return await this.http.post<Tag>(this.rootURL + '/add-tag', { tag: body }).toPromise()
      .then((result) => {
          return result;
      });
  }

  tagList$ = this.http.get<Tag[]>(this.rootURL + '/tags')
    .pipe(
      //tap(tag => console.log(tag, ' this is tagList$')),
      shareReplay(1),
      catchError(this.handleError)
    );

  private tagSelectedSubject = new BehaviorSubject<number>(0);
  tagSelectedAction$ = this.tagSelectedSubject.asObservable();

  selectedTag$ = combineLatest([
    this.tagList$,
    this.tagSelectedAction$
  ]).pipe(
    map( ([tags, selectedtagId]) => {
      return tags.find( tag => tag.id === selectedtagId);
    },
    shareReplay(1)
  ));

  selectedTagChanged(selectedTagId: number): void {
    this.tagSelectedSubject.next(selectedTagId); // emit to the subject the selectedProductId
  }



  getTags() {
    return this.tagList.slice();
  }

  getTag(tagId: number){

    return this.tagList.find( tag => {
      if ( tag.id === tagId ){
        return tag;
      }
    });

  }

  /*updateTag(newTagList) {
    // also used when item is deleted/added, since the whole array is received
    this.tagList = newTagList;
    this.tagsChanged.next(this.tagList.slice());
  }*/

  private handleError(err: any): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}