import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Parse } from 'parse';
import { Subscription } from 'rxjs';

import { Tag } from 'src/app/tags/tag-model';
import { TagService } from 'src/app/tags/tag-service';
import { VideoService } from '../video-service';

@Component({
  selector: 'app-video-tag',
  templateUrl: './video-tag.component.html'
})
export class VideoTagComponent implements OnInit, OnDestroy {
  id: string;
  tagList: Tag[];
  tagsAssigned = [];
  videoTagSub: Subscription; // to get changed in assigned tags
  VideoTagParse = Parse.Object.extend("VideoTag");

  constructor(private tagService: TagService,
              private videoService: VideoService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.params 
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
        }
      )

    this.videoTagSub = this.videoService.assignedTabsChanged
      .subscribe(
        (tags: Tag[]) => {
          this.tagsAssigned = tags;
        }
      );

    this.tagList = this.tagService.getTags();
    console.log(this.tagList);
    this.tagsAssigned = this.videoService.getAssignedTags(this.id);
  }

  checkInTagsAssigned(id) {
    let isAssigned = false;

    if ( this.tagsAssigned.findIndex( obj => obj.id === id) > -1 ) {
      isAssigned = true;
    }

    return isAssigned;
  }

  onAddTag(id) {
    let newVideoTag = new this.VideoTagParse();
    newVideoTag.set("youtubeId", this.id);
    newVideoTag.set("tagObjectId", id);
    
    newVideoTag
      .save()
      .then( () => {         

        this.tagsAssigned.push({
          name: this.tagList.find(obj => obj.id === id).name,
          id: id,
        });

        this.videoService.updateTagsAssigned(this.tagsAssigned, this.id);

      }).catch( error => {
        console.log('Error: ' + error.message);
      }); 
  }

  onRemoveTag(id) {
    const removeVideoTag = new Parse.Query(this.VideoTagParse);
    removeVideoTag.equalTo("tagObjectId", id);
    removeVideoTag.equalTo("youtubeId", this.id);

    removeVideoTag
      .first()
      .then( tag => {
        if (tag) {
          tag
            .destroy()
            .then( () => {
              const objIndex = this.tagsAssigned.findIndex( obj => obj.id === id)
              this.tagsAssigned.splice(objIndex, 1);
              this.videoService.updateTagsAssigned(this.tagsAssigned, this.id);
          })
          .catch( error => {
            console.log('Error: '+ error.message);
          });
        } else {
          console.log("Nothing found, please try again");
        }
      }).catch(function (error) {
        console.log("Error: " + error.code + " " + error.message);
      });
  }

  ngOnDestroy() {
    this.videoTagSub.unsubscribe();
  }

}
