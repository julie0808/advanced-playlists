import { Injectable } from '@angular/core';
import { Parse } from 'parse';
import { Subject } from 'rxjs';

import { Tag } from './tag-model';

@Injectable({providedIn: 'root'})
export class TagService {
  TagParse = Parse.Object.extend("Tag");
  tagsChanged = new Subject<Tag[]>();

  private tagList: Tag[] = [];

  fetchTagList() {
    const fetchAllTags = new Parse.Query(this.TagParse);
    return fetchAllTags
      .find()
      .then( result => {
        for (let i = 0; i < result.length; i++) {
          this.tagList.push({
            name: result[i].get('name'), 
            objectId: result[i].id,
            //parentId: result[i].get('parentId')
          });
        }
      })
      .catch( error => {
        console.log('An error occured :' + error.message)
      }).finally( () => {
        return this.tagList;
      });
  }

  getTags() {
    return this.tagList.slice();
  }

  updateTag(newTagList) {
    // also used when item is deleted/added, since the whole array is received
    this.tagList = newTagList;
    this.tagsChanged.next(this.tagList.slice());
  }

}