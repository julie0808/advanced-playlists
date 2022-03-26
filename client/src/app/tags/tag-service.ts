import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Tag } from '../../models/tag-model';

@Injectable({providedIn: 'root'})
export class TagService {
  tagsChanged = new Subject<Tag[]>();
  rootURL: string = '/api';

  private tagList: Tag[] = [];

  constructor(private http: HttpClient) {}

  async addNewTag({id, title}: Tag) {
    const data: Tag = {
      id, // will be 0 because we won't use it anyway for insertion
      title
    }
    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify(data);

    return await this.http.post<Tag>(this.rootURL + '/add-tag', { tag: body }, { headers }).toPromise()
      .then((result) => {
          return result;
      });
  }

  fetchTagList() {
    const headers = { 'content-type': 'application/json'};
    
    return this.http
      .get<Tag[]>(this.rootURL + '/tags', { headers })
      .pipe(
        tap(
          tags => {
            this.updateTag(tags);
          }
        )
      );

  }

  getTags() {
    return this.tagList.slice();
  }

  getTag(tagId){

    return this.tagList.find( tag => {
      if ( tag.id === tagId ){
        return tag;
      }
    });

  }

  updateTag(newTagList) {
    // also used when item is deleted/added, since the whole array is received
    this.tagList = newTagList;
    this.tagsChanged.next(this.tagList.slice());
  }

}