import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import { catchError, concatMap, map, shareReplay, tap, scan, expand, takeWhile, reduce } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ITag } from "../tags/tag-model";
import { IVideo, IVideoClass } from "./video.model";
import { ErrorService } from "../shared/error/error/error-service";
//import { TagService } from "../tags/tag-service";

@Injectable({providedIn: 'root'})
export class VideoService {

  youtubeApiKey: string = "AIzaSyD0d0tKqyP1G_lrNEEiGxEpfuIoRfDWVKs";
  youtubeApiUrl: string = "https://youtube.googleapis.com/youtube/v3";
  //testVideoPlaylistKey: string = "PLwgftAdEcD4phH9Z6pCOcW57mdxn5uJG1";
  videoPlayListKPop: string = "PLwgftAdEcD4rXHmDdFTFI8Hch3BfWBQIt";
  apiRootURL: string = '/api/v1/video';

  headers = new HttpHeaders()
    .set('content-Type', 'application/json');

  nextPageToken: string = '';
  totalVideoInPlaylist: number = 0;
  videosPerPage: number = 50; // max provided by API is 50

  constructor(
    private http: HttpClient,
    private errorService: ErrorService) { }  

  videosFromPlaylistCount$ = this.http.get<any>(this.youtubeApiUrl + '/playlistItems', {params: {
    'key': this.youtubeApiKey,
    'playlistId': this.videoPlayListKPop,
    'maxResults': 1, 
    'part': 'id'
  }})
    .pipe(
      tap( videos => {
        this.totalVideoInPlaylist = videos['pageInfo'].totalResults;
      }),
      catchError(err => this.errorService.handleError(err))
    );

  makeYoutubeAPICall(): Observable<IVideo[]> {
    return this.http
      .get<any>(this.youtubeApiUrl + '/playlistItems', {params: {
        'key': this.youtubeApiKey,
        'playlistId': this.videoPlayListKPop,
        'maxResults': this.videosPerPage, 
        'part': 'snippet',
        'pageToken': this.nextPageToken
      }})
        .pipe(
          map( videos => {
            this.nextPageToken = 'nextPageToken' in videos ? videos['nextPageToken'] : '';

            const formattedVideos = videos['items'].reduce(function(filteredVideos: IVideo[], video: any) {
              if (video.snippet.description !== 'This video is unavailable.') {
                var formattedVideo = {
                    title: video.snippet.title,
                    youtubeId: video.snippet.resourceId.videoId,
                    duration: 'duree', // not included in "playlistItems" / snippet, view https://developers.google.com/youtube/v3/docs/videos/list
                    thumbnailPath: video.snippet.thumbnails.default.url,
                    dateModified: 'date', // date of change by ME
                    artist: 'Unknown', // not yet set, has to default to "publishedBy"
                    publishedBy: video.snippet.videoOwnerChannelTitle,
                    tags: []
                  } as IVideo;

                filteredVideos.push(formattedVideo);
              }
              return filteredVideos;
            }, []) as IVideo[];

            // i don't need the observable, but I need to subscribe to it to have the code run
            // for now, only used to save original video titles, in case it's deleted on youtube
            this.updateNewVideos(formattedVideos).subscribe((videos: IVideo[]) => videos);

            return formattedVideos;
          }),
          catchError(err => this.errorService.handleError(err))
        )
  }

  videosFromPlaylist$ = this.makeYoutubeAPICall()
    .pipe(
      expand(() => this.makeYoutubeAPICall()),
      takeWhile(() => this.nextPageToken !== '', true),
      reduce((acc, curr) => acc.concat(curr))
    );

  getVideoDetail(videoListIds: string[]): Observable<any> {
    return this.http.get<any>(this.youtubeApiUrl + '/videos', {params: {
      'key': this.youtubeApiKey,
      'part': 'contentDetails',
      'id': videoListIds
    }})      
  }

  updateNewVideos(videos: IVideo[]): Observable<IVideo[]> {
    const body = JSON.stringify(videos);

    return this.http.put<IVideo[]>(`${this.apiRootURL}/update`, body, {
      headers: this.headers
    })
    .pipe(
        map(() => videos),
        catchError(err => this.errorService.handleError(err))
      )
  }

  videoTags$: Observable<any> = this.http.get(`${this.apiRootURL}/tags`)
    .pipe(
      shareReplay(1),
      catchError(err => this.errorService.handleError(err))
    );
  
  videosWithTags$ = combineLatest([
    this.videosFromPlaylist$,
    this.videoTags$
  ]).pipe(
    map( ([videos, tags]) => {
      //console.warn('videoWithTags$ count', videos.length, 'first: ', videos[0].title);
      const newVideoArray = videos.map((video: IVideo) => ({
        ...video,
        tags: video.tags = tags.find( (t: any) => t.youtube_id === video.youtubeId)?.tags as ITag[]
      }) as IVideo);

      return newVideoArray;
    }),
    tap(videos => console.warn('videosWithTags$ origin', videos)),
    shareReplay(1)
  );

  private videoTagsModifiedSubject: Subject<IVideo> = new Subject<IVideo>();
  videoTagsModifiedAction$: Observable<IVideo> = this.videoTagsModifiedSubject.asObservable();

  ///////////////// AJUST DOES NOT CONSIDER LAST EMITTED
  videoTagsModified$: Observable<IVideo[]> = merge(
    this.videosWithTags$
      .pipe(
        tap(videos => console.log('piped', videos))
      ),
    this.videoTagsModifiedAction$
      .pipe(
        concatMap(video => this.saveVideoTagsToBackend(video)),
        catchError(err => this.errorService.handleError(err))
      )
    )
    .pipe(
      // @ts-ignore - typescript a une haine pour "scan"
      scan((acc: IVideo[], video: IVideo) => this.adjustVideoList(acc, video)),
      tap((videos: IVideo[]) => {
        //console.info(videos[0].title);
        return videos;
      }),
      shareReplay(1),
      catchError(err => this.errorService.handleError(err))
    );

  adjustVideoList(videos: IVideo[], video: IVideo): IVideo[] {
    // inspiré de tagService, uniquement bon pour un UPDATE
    console.log('adjust...', videos); // always only have 50...??? always the first batch
    return videos.map(v => v.youtubeId === video.youtubeId ? video : v);
  }

  updateVideo(updatedVideo: IVideo): void {
    this.videoTagsModifiedSubject.next(updatedVideo);
  }

  private sortByTagSubject = new BehaviorSubject<ITag[]>([]);
  sortByTagAction$ = this.sortByTagSubject.asObservable();  

  videosSorted$: Observable<IVideo[]> = combineLatest([
    this.videoTagsModified$,
    this.sortByTagAction$
  ])
    .pipe(
      map(([videos, selectedTags]) => {
        if(videos.length){
          if (selectedTags.length) {
            return videos.filter( (video: IVideo) => {
              const videoTags = video.tags || [];
              if (videoTags.length){
                return videoTags.some(videoTag => {
                  return selectedTags.some(selectedTag => selectedTag.id === videoTag.id);
                })
              }
              return false;
            });
          } 
          
          // set default video to the first in the list
          if ( this.videoSelectedSubject.getValue() === '' ) {
            this.selectedVideoIdChanged(videos[0].youtubeId);
          }      
        }  

        return videos;
      }),
      catchError(err => this.errorService.handleError(err)),
      shareReplay(1)
    );

  sortVideoListByTag(selectedTags: ITag[]): void {
    this.sortByTagSubject.next(selectedTags);
  }

  private videoSelectedSubject = new BehaviorSubject<string>(''); 
  videoSelectedAction$ = this.videoSelectedSubject.asObservable();

  selectedVideo$ = combineLatest([
    //this.videoTagsModified$,  /////////////////////////////// i hve the feeling this is the culprit.
    this.videosSorted$,
    this.videoSelectedAction$
  ]).pipe(
    map( ([videos, selectedVideoId]) => {
      if (selectedVideoId) {
        const searchForVideo = videos.find( video => video.youtubeId === selectedVideoId);
        if (searchForVideo !== undefined){
          return searchForVideo;
        } 

        this.errorService.handleError('Video inexistant');
        return new IVideoClass(); 
      }
      // videoList is not yet loaded with default video
      return new IVideoClass();
    }),
    catchError(err => this.errorService.handleError(err)),
    shareReplay(1)
  );

  selectedVideoIdChanged(selectedVideoId: string): void {
    this.videoSelectedSubject.next(selectedVideoId);
  }

  playNextVideo() {
    // logic may b e flawed, since I can't be sure all components
    // depends on the videosSorted$ list
    this.videosSorted$.subscribe(videos => {
      const currentVideoPosition = videos.findIndex( (v: IVideo) => v.youtubeId === this.videoSelectedSubject.getValue())
      const videosSortedLength = videos.length;
      const nextVideoPosition = videosSortedLength - 1 === currentVideoPosition ? 0 : currentVideoPosition + 1;

      this.selectedVideoIdChanged(videos[nextVideoPosition].youtubeId);
    });
  }

  saveVideoTagsToBackend(video: IVideo): Observable<IVideo> {
    const body = JSON.stringify(video.tags);
    let params = new HttpParams(); 
    params = params.append('id', video.youtubeId);

    return this.http.put(`${this.apiRootURL}/tags/update/${video.youtubeId}`, body, { 
      headers: this.headers,
      params: params 
    })
      .pipe(
        map(() => video),
        catchError(err => this.errorService.handleError(err))
      )

  }




}

