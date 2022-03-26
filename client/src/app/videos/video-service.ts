import { Injectable } from "@angular/core";
import { Parse } from 'parse';
import { EMPTY, Subject, Subscription } from 'rxjs';
import { catchError, map, takeUntil, tap } from "rxjs/operators";

import { TagService } from "../tags/tag-service";
import { Tag } from "../../models/tag-model";
import { Video } from "../../models/video.model";
import { YoutubeService } from "./youtube.service";


@Injectable({providedIn: 'root'})
export class VideoService {
  VideoTagParse = Parse.Object.extend("VideoTag");
  videosChanged = new Subject<Video[]>();
  assignedTabsChanged = new Subject<Tag[]>();
  sub!: Subscription;

  videoPlaylist$ =  this.youtubeService.getVideosFromPlaylist('PLwgftAdEcD4phH9Z6pCOcW57mdxn5uJG1')
    .pipe(
      catchError(err => {
        console.log(err);
        return EMPTY; 
      })
    );

  //private videoList: Video[] = [];

  constructor(private tagService: TagService,
              private youtubeService: YoutubeService) { 
  }

  fetchVideoList() {

    /*this.sub = this.youtubeService.getVideosFromPlaylist('PLwgftAdEcD4phH9Z6pCOcW57mdxn5uJG1')
        .subscribe({
          next: videos => {
            this.videoList = videos;
            this.videosChanged.next( this.getVideos() );
          },
          error: err => console.log(err)
        });*/

  }

  fetchAndAssignTags() {
    console.log('before fetch tag')

    const fetchAllVideoTags = new Parse.Query(this.VideoTagParse);
    return fetchAllVideoTags
      .find()
      .then( result => {
        console.log('tags fetched')
        /*for ( let i = 0; i < result.length; i++) {
          let tagItem = this.tagService.getTag(result[i].get('tagObjectId'));

          if ( tagItem !== undefined ) {
          
            let videoItem = this.videoList.findIndex( obj => obj.youtubeId === result[i].get('youtubeId') );

            if ( videoItem !== -1 ){
              this.videoList[videoItem].tags
                .push(tagItem);
            }
          } // todo -> delete invalid tag junctions found

        }*/
        console.log('tags assigned');
      })
      .catch( error => {
        console.log('An error occured :' + error.message)
      })  
      .finally( () => {
        console.log('sending updated list')
        //this.videosChanged.next( this.getVideos() );
      });
  }


  /*getVideos() {
    return this.videoList.slice();
  }*/

  getAssignedTags(id: string) {
    /*let tagList: Tag[] = [];
    let videoItem = this.videoList.findIndex( obj => obj.youtubeId === id);

    for ( let i = 0; i < this.videoList[videoItem].tags.length; i++) {
      tagList.push(this.videoList[videoItem].tags[i])
    }

    return tagList;*/

  }

  updateTagsAssigned(newTagsAssigned, id) {
    /*const videoIndex = this.videoList.findIndex( obj => obj.youtubeId === id);
    this.videoList[videoIndex].tags = newTagsAssigned;
    console.log(this.videoList);
    console.log('end before next');
    this.assignedTabsChanged.next( newTagsAssigned );*/
  }

}