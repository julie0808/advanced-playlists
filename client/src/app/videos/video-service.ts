import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, EMPTY, of, Subject, throwError } from 'rxjs';
import { catchError, filter, map, shareReplay, switchMap, tap } from "rxjs/operators";
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { TagService } from "../tags/tag-service";
import { ITag } from "../../models/tag-model";
import { IVideo } from "../../models/video.model";

@Injectable({providedIn: 'root'})
export class VideoService {

  /*  videosChanged = new Subject<Video[]>();
  assignedTabsChanged = new Subject<Tag[]>();
  */

  youtubeApiKey: string = "AIzaSyD0d0tKqyP1G_lrNEEiGxEpfuIoRfDWVKs";
  youtubeApiUrl: string = "https://youtube.googleapis.com/youtube/v3/playlistItems"
  testVideoPlaylistKey: string = "PLwgftAdEcD4phH9Z6pCOcW57mdxn5uJG1";
  rootURL: string = '/api/v1';

  videosFromPlaylist$ =  this.http.get<any>(this.youtubeApiUrl, {params: {
    'key': this.youtubeApiKey,
    'playlistId': this.testVideoPlaylistKey,
    'maxResults': 20,
    'part': 'snippet'
  }})
    .pipe(
      //tap( videos => console.log(JSON.stringify(videos))),
      map( videos => 
        videos['items'].map( (video: any) => ({
          title: video.snippet.title,
          youtubeId: video.snippet.resourceId.videoId,
          length: 'duree', // not included in "snippet"
          dateModified: 'date', // date of change by ME
          tagIds: [],
          artist: 'Unknown', // not yet set, as to default to "publishedBy"
          publishedBy: video.snippet.videoOwnerChannelTitle
        } as IVideo )) as IVideo[]
      ),
      catchError(this.handleError)
    );


  private videoSelectedSubject = new BehaviorSubject<string>('default1234'); // default selected video emitted is 0
  videoSelectedAction$ = this.videoSelectedSubject.asObservable();

  selectedVideo$ = combineLatest([
    this.videosFromPlaylist$,
    this.videoSelectedAction$
  ]).pipe(
    map( ([videos, selectedVideoId]) =>
    videos.find( video => video.youtubeId === selectedVideoId),
    shareReplay(1)
  ));

  selectedVideoTags$ = this.selectedVideo$
  .pipe(
    filter(selectedVideo => Boolean(selectedVideo)),
    switchMap(selectedVideo => {
      if (selectedVideo?.tagIds) {
        ////// THAT NOT WHAT I NEED. I dont have the tags ids yet, im getting to that
        /*return forkJoin(selectedVideo.tagIds.map(tagId => 
          this.http.get<Supplier>(`${this.apiRootURL}/${tagId}`)))*/
        return of([]);
      } else {
        return of([]);
      }
    })
  )
  
  
  
  /*this.http.get<Tag[]>(this.apiRootURL + '/videotags/' + ID!!)
    .pipe(
      shareReplay(1),
      catchError(this.handleError)
    );*/



  constructor(private tagService: TagService,
              private http: HttpClient) { 
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
    // refaire sans PARSE
    //this.videosChanged.next( this.getVideos() );
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

  updateTagsAssigned(newTagsAssigned: ITag[], id: number) {
    /*const videoIndex = this.videoList.findIndex( obj => obj.youtubeId === id);
    this.videoList[videoIndex].tags = newTagsAssigned;
    console.log(this.videoList);
    console.log('end before next');
    this.assignedTabsChanged.next( newTagsAssigned );*/
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';

    if ( err.error instanceof ErrorEvent ) {
      // client-side error
      errorMessage = `An error occured: ${err.error.message}`;
    } else {
      // server-side error
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }

    console.error(errorMessage); // ideally, we would handle error by logging it in some way
    return throwError(errorMessage); 
  }

}