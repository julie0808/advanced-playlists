import { Injectable } from "@angular/core";
import { Parse } from 'parse';
import { Subject } from 'rxjs';

import { Video } from "./video.model";

@Injectable({'providedIn': 'root'})
export class VideoService {
  VideoTagParse = Parse.Object.extend("VideoTag");
  viddeosChanged = new Subject<Video[]>();

  private videoList: Video[] = [];

  fetchVideoList() {
    // will eventually come from YoutubeAPI
    // tags list will need to come from Back4app database

    return this.videoList = [
      new Video(
        'Tim Schaufert & Cashforgold - I\'ll Know Who I Am In Time',
        '2Q1BxUECk6M',
        '00:26', // type should be valid time format
        '2020-03-03', // type should be changed for valid date
        [{name: 'Dolor sit amet', id: 'hPEzISkVxY'}],
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
  }

  getVideos() {
    return this.videoList.slice();
  }

  getAssignedTags(id: string) {
    let tagList = [];
    let videoItem = this.videoList.findIndex( obj => obj.youtubeId === id);

    for ( let i = 0; i < this.videoList[videoItem].tags.length; i++) {
      tagList.push(this.videoList[videoItem].tags[i])
    }

    console.log(tagList);

    return tagList;

  }

}