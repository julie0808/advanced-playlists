import { Injectable } from "@angular/core";
import { Observable, Subject } from 'rxjs';
import { catchError, map, tap, expand, takeWhile, reduce } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpParams, HttpContext } from '@angular/common/http';
import { CACHEABLE } from "../shared/cache.interceptor";
import { ErrorService } from "../shared/error/error/error-service";

import { Video } from "./video.model";

import { IPlaylist } from "./playlist.model";


@Injectable({providedIn: 'root'})
export class VideoService {

  testMode: boolean = false; // va charger une seule page de l'api
  testModeMaxItems: number = 25; // max 50, car on va chercher une seule page 

  nextPageToken: string = '';
  totalVideoInPlaylist: number = 0;
  videosPerPage: number = 50; // max provided by API is 50

  youtubeApiKey: string = "AIzaSyD0d0tKqyP1G_lrNEEiGxEpfuIoRfDWVKs";
  youtubeApiUrl: string = "https://youtube.googleapis.com/youtube/v3";
  videoPlayListKPop: string = "PLwgftAdEcD4rXHmDdFTFI8Hch3BfWBQIt";
  apiRootURL: string = '/api/v1/video';
  apiURL: string = '/api/v1';

  headers = new HttpHeaders()
    .set('content-Type', 'application/json');


  private playlistSelectedSubject = new Subject<IPlaylist>();
  playlistSelectedAction$ = this.playlistSelectedSubject.asObservable();


  playlists$: Observable<IPlaylist[]> = this.http.get<any>(this.apiURL + '/playlist')
    .pipe(
      map( playlists => {
        const finalPlaylistList: IPlaylist[] = playlists.map( (playlist: any) => {
          const playlistInfo: IPlaylist = {
            id: playlist.id,
            title: playlist.title
          };
          return playlistInfo;
        });
        return finalPlaylistList;
      }),
      catchError(err => this.errorService.handleError(err))
    );

  // not used. I use the length of actual returned array
  videosFromPlaylistCount$ = this.http.get<any>(this.youtubeApiUrl + '/playlistItems', {
      params: {
        'key': this.youtubeApiKey,
        'playlistId': this.videoPlayListKPop,
        'maxResults': 1, 
        'part': 'id'
      }
    })
    .pipe(
      tap( videos => {
        this.totalVideoInPlaylist = videos['pageInfo'].totalResults;
      }),
      catchError(err => this.errorService.handleError(err))
    );



  constructor(
    private http: HttpClient,
    private errorService: ErrorService) { }   
    

  getVideosFromYoutube(): Observable<Video[]> {
    // we can't. that observable doesnt END (forkjoin constraint)
    // const playlist = this.store.select(getCurrentPlaylistId);

    const getVideoPageFromYoutube = this.makeYoutubeAPICall(this.videoPlayListKPop)
      .pipe(          
        expand(() => this.makeYoutubeAPICall(this.videoPlayListKPop)),
        takeWhile(() => this.nextPageToken !== '', true),
        reduce((acc, curr) => acc.concat(curr))
      );

      return getVideoPageFromYoutube;

  }

  getVideosFromDatabase(): Observable<Video[]> {
    // we can't. that observable doesnt END (forkjoin constraint)
    // const playlist = this.store.select(getCurrentPlaylistId);

    return this.http.get<Video[]>(`${this.apiRootURL}`, {
      context: new HttpContext().set(CACHEABLE, true),
      params: {
        'playlist_id' : this.videoPlayListKPop 
      }
    })
      .pipe(
        map(videos => {
          return videos.map(v => {
            return {
              ...v,
              tags: v.tags ? v.tags : [],
              artists: v.artists ? v.artists : []
            };
          })
        }),
        catchError(err => this.errorService.handleError(err))
      );
      
  }

  makeYoutubeAPICall(playlistId: string): Observable<Video[]> {
    return this.http.get<any>(this.youtubeApiUrl + '/playlistItems', {
        params: {
          'key': this.youtubeApiKey,
          'playlistId': playlistId,
          'maxResults': this.testMode ? this.testModeMaxItems : this.videosPerPage, 
          'part': 'snippet',
          'pageToken': this.nextPageToken
        },
        context: new HttpContext().set(CACHEABLE, true)
    })
      .pipe(
        map( videos => {
          this.nextPageToken = 'nextPageToken' in videos && this.testMode === false ? videos['nextPageToken'] : '';

          const mappedVideosToInterface = videos['items'].map(
            (video: any) => {
              const mappedVideo: Video = this.mapYTInfoToVideoInterface(video);
              return mappedVideo;
            }
          )

          return mappedVideosToInterface;
        }),
        map(videos => {
          // filter out unavailable to play videos until we have other options to manage them
          return videos.filter((video: Video) => video.youtubeStatus !== 'private' && video.youtubeStatus !== 'unavailable');
        }),
        catchError(err => this.errorService.handleError(err))
      )
  }

  mapYTInfoToVideoInterface(video: any): Video {
    const mappedVideo = new Video();

    mappedVideo.uniqueYoutubeId = video.id;
    mappedVideo.youtubeId = video.snippet.resourceId.videoId;

    if (video.snippet.description === 'This video is unavailable.' ||
        video.snippet.description === 'This video is private.') {
      mappedVideo.youtubeStatus = video.snippet.description.includes('private') ? 'private' : 'unavailable';
      mappedVideo.title = `[${mappedVideo.youtubeStatus} - ${video.snippet.resourceId.videoId}]`;
    } else {
      mappedVideo.title = video.snippet.title;
      mappedVideo.thumbnailPath = typeof video.snippet.thumbnails.default !== "undefined" ? video.snippet.thumbnails.default.url : '';
      mappedVideo.publishedBy = video.snippet.videoOwnerChannelTitle;
    }

    return mappedVideo;
  } 

  sortAppByPlaylist(playlist: IPlaylist): void {
    this.playlistSelectedSubject.next(playlist);
  }

  getVideoDetail(videoListIds: string[]): Observable<any> {
    return this.http.get<any>(this.youtubeApiUrl + '/videos', {params: {
      'key': this.youtubeApiKey,
      'part': 'contentDetails',
      'id': videoListIds
    }})      
  }

  updateNewVideos(videos: Video[]): Observable<Video[]> {
    const body = JSON.stringify(videos);

    return this.http.post<Video[]>(`${this.apiRootURL}/update`, body, {
      headers: this.headers
    })
    .pipe(
        map(() => videos),
        catchError(err => this.errorService.handleError(err))
      )
  }

  updateVideo(video: Video): Observable<Video> {
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

