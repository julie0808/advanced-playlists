import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, merge, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, concatMap, map, shareReplay, tap, scan } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ITag } from "../tags/tag-model";
import { IVideo, IVideoClass } from "./video.model";
import { ErrorService } from "../shared/error/error/error-service";

@Injectable({providedIn: 'root'})
export class VideoService {

  youtubeApiKey: string = "AIzaSyD0d0tKqyP1G_lrNEEiGxEpfuIoRfDWVKs";
  youtubeApiUrl: string = "https://youtube.googleapis.com/youtube/v3/playlistItems"
  testVideoPlaylistKey: string = "PLwgftAdEcD4phH9Z6pCOcW57mdxn5uJG1";
  apiRootURL: string = '/api/v1/video';

  headers = new HttpHeaders()
    .set('content-Type', 'application/json');

  constructor(private http: HttpClient,
              private errorService: ErrorService) { 
}

  videosFromPlaylist$ = this.http.get<any>(this.youtubeApiUrl, {params: {
    'key': this.youtubeApiKey,
    'playlistId': this.testVideoPlaylistKey,
    'maxResults': 150,
    'part': 'snippet'
  }})
    .pipe(
      map( videos => {
        const formattedVideos = videos['items'].map( (video: any) => ({
          title: video.snippet.title,
          youtubeId: video.snippet.resourceId.videoId,
          length: 'duree', // not included in "snippet"
          dateModified: 'date', // date of change by ME
          artist: 'Unknown', // not yet set, has to default to "publishedBy"
          publishedBy: video.snippet.videoOwnerChannelTitle,
          tags: [] // is added in subsequent request
        } as IVideo )) as IVideo[];
        
        // i don't need the observable, but I need to subscribe to it to have it "run"
        this.updateNewVideos(formattedVideos).subscribe((videos: IVideo[]) => videos);

        return formattedVideos;
      }),     
      catchError(err => this.errorService.handleError(err))
    );

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

  videos$ = combineLatest([
    this.videosFromPlaylist$,
    this.videoTags$
  ]).pipe(
    map( ([videos, tags]) => {
      return videos.map(video => ({
        ...video,
        // todo i need to make sure that an empty array is returned if no tags found
        tags: video.tags = tags.find( (t: any) => t.youtube_id === video.youtubeId)?.tags as ITag[]
      }) as IVideo)
    })
  );

  private videoTagsModifiedSubject: Subject<IVideo> = new Subject<IVideo>();
  videoTagsModifiedAction$: Observable<IVideo> = this.videoTagsModifiedSubject.asObservable();

  videoTagsModified$ = merge(
    this.videos$,
    this.videoTagsModifiedAction$
      .pipe(
        tap(video => {
          return video;
        }),
        concatMap(video => this.saveVideoTagsToBackend(video)),
        catchError(err => this.errorService.handleError(err))
      )
  )
    .pipe(
      // @ts-ignore - typescript a une haine pour "scan"
      scan((videos: IVideo[], video: IVideo) => this.adjustVideoList(videos, video)),
      shareReplay(1),
      catchError(err => this.errorService.handleError(err))
    );

  updateVideo(updatedVideo: IVideo): void {
    this.videoTagsModifiedSubject.next(updatedVideo);
  }

  private sortByTagSubject = new BehaviorSubject<ITag[]>([]);
  sortByTagAction$ = this.sortByTagSubject.asObservable();  

  videosSorted$ = combineLatest([
    this.videoTagsModified$,
    this.sortByTagAction$
  ])
    .pipe(
      map(([videos, selectedTags]) => {
        if (selectedTags.length) {
          return videos.filter(video => {
            const videoTags = video.tags || [];
            if (videoTags.length){
              return videoTags.some(videoTag => {
                return selectedTags.some(selectedTag => selectedTag.id === videoTag.id);
              })
            }
            return false;
          });
        } 
    
        return videos;
      }),
      catchError(err => this.errorService.handleError(err)),
      shareReplay(1)
    );

  sortVideoListByTag(selectedTags: ITag[]): void {
    this.sortByTagSubject.next(selectedTags);
  }

  private videoSelectedSubject = new BehaviorSubject<string>('defaut12345'); 
  videoSelectedAction$ = this.videoSelectedSubject.asObservable();

  selectedVideo$ = combineLatest([
    this.videoTagsModified$,
    this.videoSelectedAction$
  ]).pipe(
    map( ([videos, selectedVideoId]) => {
      const searchForVideo = videos.find( video => video.youtubeId === selectedVideoId);
      if (searchForVideo !== undefined){
        return searchForVideo;
      } 
      this.errorService.handleError('Video inexistant');
      return new IVideoClass(); 
    }),
    catchError(err => this.errorService.handleError(err)),
    shareReplay(1)
  );

  selectedVideoTagChanged(selectedVideoTagId: string): void {
    this.videoSelectedSubject.next(selectedVideoTagId);
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

  adjustVideoList(videos: IVideo[], video: IVideo): IVideo[] {
    return videos.map(v => v.youtubeId === video.youtubeId ? video : v);
  }

}

