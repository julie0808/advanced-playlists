import { Injectable } from "@angular/core";
import { Parse } from 'parse';
import { Subject } from 'rxjs';

import { TagService } from "../tags/tag-service";

import { Tag } from "../tags/tag-model";
import { Video } from "./video.model";

@Injectable({providedIn: 'root'})
export class VideoService {
  VideoTagParse = Parse.Object.extend("VideoTag");
  videosChanged = new Subject<Video[]>();
  assignedTabsChanged = new Subject<Tag[]>();

  private videoList: Video[] = [];

  constructor(private tagService: TagService) { 
  }

  fetchVideoList() {
    // videos eventually come from YoutubeAPI

    this.videoList = [
      new Video(
        'Tim Schaufert & Cashforgold - I\'ll Know Who I Am In Time',
        '2Q1BxUECk6M',
        '00:26', // type should be valid time format
        '2020-03-03', // type should be changed for valid date
        [],
        'Tim Schaufert & Cashforgold',
        [{name: 'Original PL on YT', id: 'PLwgftAdEcD4qcsf5Nv9vZYQdujHqGOfbv', dateAdded: '2020-01-01'}]
      ),
      new Video(
        'Post Malone - Hollywood\'s Bleeding (Audio)',
        'w5GrxfjuTTI',
        '00:26', // type should be valid time format
        '2020-03-03', // type should be changed for valid date
        [],
        'Post Malone',
        [{name: 'Original PL on YT', id: 'PLwgftAdEcD4qcsf5Nv9vZYQdujHqGOfbv', dateAdded: '2020-01-01'}]
      )
    ];

    const fetchAllVideoTags = new Parse.Query(this.VideoTagParse);
    return fetchAllVideoTags
      .find()
      .then( result => {

        for ( let i = 0; i < result.length; i++) {
          // todo - bug - if ctrl R but not F5, tags cant be found with getTag()
          let tagItem = this.tagService.getTag(result[i].get('tagObjectId'));

          if ( tagItem !== undefined ) {
           
            let videoItem = this.videoList.findIndex( obj => obj.youtubeId === result[i].get('youtubeId') );

            if ( videoItem !== -1 ){
              this.videoList[videoItem].tags
                .push(tagItem);
            }
          } // todo -> delete invalid tag junction found

        }
        
      })
      .catch( error => {
        console.log('An error occured :' + error.message)
      })  
      .finally( () => {
        this.videosChanged.next( this.getVideos() );
      });

  }

  getVideos() {
    return this.videoList.slice();
  }

  getAssignedTags(id: string) {
    let tagList: Tag[] = [];
    let videoItem = this.videoList.findIndex( obj => obj.youtubeId === id);

    for ( let i = 0; i < this.videoList[videoItem].tags.length; i++) {
      tagList.push(this.videoList[videoItem].tags[i])
    }

    return tagList;

  }

  updateTagsAssigned(newTagsAssigned, id) {
    const videoIndex = this.videoList.findIndex( obj => obj.youtubeId === id);
    this.videoList[videoIndex].tags = newTagsAssigned;
    console.log(this.videoList);
    console.log('end before next');
    this.assignedTabsChanged.next( newTagsAssigned );
  }

}