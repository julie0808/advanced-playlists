import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import { catchError, concatMap, map, shareReplay, tap, scan, expand, takeWhile, reduce } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ITag } from "../tags/tag-model";
import { IVideo, IVideoClass } from "./video.model";
import { ErrorService } from "../shared/error/error/error-service";
import { TagService } from "../tags/tag-service";

@Injectable({providedIn: 'root'})
export class VideoService {

  youtubeApiKey: string = "AIzaSyD0d0tKqyP1G_lrNEEiGxEpfuIoRfDWVKs";
  youtubeApiUrl: string = "https://youtube.googleapis.com/youtube/v3";
  videoPlayListKPop: string = "PLwgftAdEcD4rXHmDdFTFI8Hch3BfWBQIt";
  apiRootURL: string = '/api/v1/video';

  headers = new HttpHeaders()
    .set('content-Type', 'application/json');

  nextPageToken: string = '';
  totalVideoInPlaylist: number = 0;
  videosPerPage: number = 50; // max provided by API is 50

  constructor(
    private http: HttpClient,
    private tagService: TagService,
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

                  const formattedVideo: IVideo = new IVideoClass();
                  formattedVideo.title = video.snippet.title;
                  formattedVideo.youtubeId = video.snippet.resourceId.videoId;
                  formattedVideo.thumbnailPath = video.snippet.thumbnails.default.url;
                  formattedVideo.publishedBy = video.snippet.videoOwnerChannelTitle;

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

    return this.http.post<IVideo[]>(`${this.apiRootURL}/update`, body, {
      headers: this.headers
    })
    .pipe(
        map(() => videos),
        catchError(err => this.errorService.handleError(err))
      )
  }

  videoTags$: Observable<any> = this.http.get(`${this.apiRootURL}/tags`)
    .pipe(
      catchError(err => this.errorService.handleError(err))
    );

  videoInfos$: Observable<any> = this.http.get(`${this.apiRootURL}/information`)
    .pipe(
      catchError(err => this.errorService.handleError(err))
    );

  tagsInfo: Observable<ITag[]> = this.tagService.tagsModified$;
  
  videosWithTags$ = combineLatest([
    this.videosFromPlaylist$,
    this.videoTags$,
    this.tagsInfo,
    this.videoInfos$
  ]).pipe(
    map( ([videos, videotags, tagsinformation, videoinformation]) => {
      
      const newVideoArray = videos.map((video: IVideo) => {
        let associatedVideoTagsWithInfo: ITag[] = [];
        const associatedVideoTags = videotags.find( (vt: any) => vt.youtube_id === video.youtubeId);

        if (typeof associatedVideoTags !== 'undefined') {
          associatedVideoTagsWithInfo = associatedVideoTags.tags.map( (avt: any) => {
            return tagsinformation.find(ti => ti.id === avt.id) as ITag;
          });
        }

        let associatedVideoInformation: number = 1;
        const findAssociatedVideoInformation = videoinformation.find( (vi: any) => vi.youtube_id === video.youtubeId);

        if (typeof findAssociatedVideoInformation !== 'undefined') {
          associatedVideoInformation = findAssociatedVideoInformation.rating;
        }

        const finalVideo: IVideo = ({
          ...video,
          tags: associatedVideoTagsWithInfo,
          rating: associatedVideoInformation
        }) as IVideo

        return finalVideo;
      });

      return newVideoArray;
    }),
    shareReplay(1)
  );

  private videoTagsModifiedSubject: Subject<IVideo> = new Subject<IVideo>();
  videoTagsModifiedAction$: Observable<IVideo> = this.videoTagsModifiedSubject.asObservable();

  videoTagsModified$: Observable<IVideo[]> = merge(
    this.videosWithTags$,
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
        return videos;
      }),
      shareReplay(1),
      catchError(err => this.errorService.handleError(err))
    );

  adjustVideoList(videos: IVideo[], video: IVideo): IVideo[] {
    // inspiré de tagService, uniquement bon pour un UPDATE
    return videos.map(v => v.youtubeId === video.youtubeId ? video : v);
  }

  updateVideo(updatedVideo: IVideo): void {
    this.videoTagsModifiedSubject.next(updatedVideo);
  }

  private sortByTagSubject = new BehaviorSubject<ITag[]>([]);
  sortByTagAction$ = this.sortByTagSubject.asObservable();  
  private sortByRatingSubject = new BehaviorSubject<number>(0);
  sortByRatingAction$ = this.sortByRatingSubject.asObservable();  
  private sortByNew = new BehaviorSubject<boolean>(false);
  sortByNew$ = this.sortByNew.asObservable(); 

  videosSorted$: Observable<IVideo[]> = combineLatest([
    this.videoTagsModified$,
    this.sortByTagAction$,
    this.sortByRatingAction$,
    this.sortByNew$
  ])
    .pipe(
      map(([videos, selectedTags, selectedRating, showOnlyNew]) => {
        let sortedVideos = videos;

        if(videos.length){
          if (showOnlyNew) {
            return sortedVideos.filter((video: IVideo) => {
              return video.rating === 0;
            });
          }

          if (selectedTags.length) {
            return sortedVideos.filter( (video: IVideo) => {
              const videoTags = video.tags || [];
              if (videoTags.length){
                return videoTags.some(videoTag => {
                  return selectedTags.some(selectedTag => selectedTag.id === videoTag.id);
                })
              }
              return false;
            });
          } 
          if (selectedRating !== 0){
            return sortedVideos.filter((video: IVideo) => {
              return video.rating === selectedRating;
            });
          }
          
          // set default video to the first in the list
          if ( this.videoPlayingSubject.getValue() === '' ) {
            this.videoPlayingIdChanged(videos[0].youtubeId);
          }      
        }  

        return sortedVideos;
      }),
      catchError(err => this.errorService.handleError(err)),
      shareReplay(1)
    );

  sortVideoListByTag(selectedTags: ITag[]): void {
    this.sortByTagSubject.next(selectedTags);
  }

  sortVideoListByRating(rating: number): void {
    this.sortByRatingSubject.next(rating);
  }

  sortVideoListByNewOnly(showOnlyNew: boolean): void {
    this.sortByNew.next(showOnlyNew);
  }

  private videoPlayingSubject = new BehaviorSubject<string>(''); 
  videoPlayingAction$ = this.videoPlayingSubject.asObservable();

  videoPlaying$ = combineLatest([
    this.videosSorted$,
    this.videoPlayingAction$
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

  videoPlayingIdChanged(selectedVideoId: string): void {
    this.videoPlayingSubject.next(selectedVideoId);
  }

  private videoSelectedSubject = new BehaviorSubject<string>(''); 
  videoSelectedAction$ = this.videoSelectedSubject.asObservable();

  selectedVideo$ = combineLatest([
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

  playNextVideo(videoList: IVideo[]) {
    const currentVideoPosition = videoList.findIndex( (v: IVideo) => {
      return v.youtubeId === this.videoPlayingSubject.getValue();
    });
    const videosSortedLength = videoList.length;
    const nextVideoPosition = videosSortedLength - 1 === currentVideoPosition ? 0 : currentVideoPosition + 1;
    this.videoPlayingIdChanged(videoList[nextVideoPosition].youtubeId);
  }

  saveVideoTagsToBackend(video: IVideo): Observable<IVideo> {
    const body = JSON.stringify(video);
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

