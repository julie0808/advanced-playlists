import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, EMPTY, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, filter, map, shareReplay, switchMap, tap } from "rxjs/operators";
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { TagService } from "../tags/tag-service";
import { ITag } from "../../models/tag-model";
import { IVideo } from "../../models/video.model";
import { ErrorService } from "../shared/error/error/error-service";

@Injectable({providedIn: 'root'})
export class VideoService {

  youtubeApiKey: string = "AIzaSyD0d0tKqyP1G_lrNEEiGxEpfuIoRfDWVKs";
  youtubeApiUrl: string = "https://youtube.googleapis.com/youtube/v3/playlistItems"
  testVideoPlaylistKey: string = "PLwgftAdEcD4phH9Z6pCOcW57mdxn5uJG1";
  apiRootURL: string = '/api/v1';

  constructor(private tagService: TagService,
              private http: HttpClient,
              private errorService: ErrorService) { 
}

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
          ...video,
          title: video.snippet.title,
          youtubeId: video.snippet.resourceId.videoId,
          length: 'duree', // not included in "snippet"
          dateModified: 'date', // date of change by ME
          artist: 'Unknown', // not yet set, has to default to "publishedBy"
          publishedBy: video.snippet.videoOwnerChannelTitle
        } as IVideo )) as IVideo[]
      ),
      catchError(err => this.errorService.handleError(err))
    );

  videoTags$: Observable<any> = this.http.get(this.apiRootURL + '/videotags')
    .pipe(
      shareReplay(1),
      catchError(err => this.errorService.handleError(err))
    );

  videos$ = combineLatest([
    this.videosFromPlaylist$,
    this.videoTags$
      .pipe(
        catchError(err => of([]))
      )
  ]).pipe(
    map( ([videos, tags]) => {
      return videos.map(video => ({
        ...video,
        tags: video.tags = tags.find( (t: any) => t.youtube_id === video.youtubeId)?.tags as ITag[]
      }) as IVideo)
    }),
    tap(videos => console.log(videos))
  );

  private videoSelectedSubject = new BehaviorSubject<string>('default1234'); 
  videoSelectedAction$ = this.videoSelectedSubject.asObservable();

  selectedVideo$ = combineLatest([
    this.videosFromPlaylist$,
    this.videoSelectedAction$
  ]).pipe(
    map( ([videos, selectedVideoId]) => {
      return videos.find( video => video.youtubeId === selectedVideoId)
    }),
    shareReplay(1)
  );

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

  updateTagsAssigned(newTagsAssigned: ITag[], id: number) {
    /*const videoIndex = this.videoList.findIndex( obj => obj.youtubeId === id);
    this.videoList[videoIndex].tags = newTagsAssigned;
    console.log(this.videoList);
    console.log('end before next');
    this.assignedTabsChanged.next( newTagsAssigned );*/
  }

}