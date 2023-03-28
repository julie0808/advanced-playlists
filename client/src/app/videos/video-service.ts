import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, forkJoin, merge, Observable, of, Subject } from 'rxjs';
import { catchError, concatMap, map, shareReplay, tap, scan, expand, takeWhile, reduce, switchMap } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpParams, HttpContext } from '@angular/common/http';

import { ITag } from "../tags/tag-model";
import { IVideo, StatusCode } from "./video.model";
import { ErrorService } from "../shared/error/error/error-service";
import { TagService } from "../tags/tag-service";
import { IPlaylist } from "./playlist.model";
import { CACHEABLE } from "../shared/cache.interceptor";

@Injectable({providedIn: 'root'})
export class VideoService {

  testMode: boolean = false; // va charger une seule page de l'api
  testModeMaxItems: number = 10; // max 50, car on va chercher une seule page 

  nextPageToken: string = '';
  totalVideoInPlaylist: number = 0;
  videosPerPage: number = 50; // max provided by API is 50

  youtubeApiKey: string = "AIzaSyD0d0tKqyP1G_lrNEEiGxEpfuIoRfDWVKs";
  youtubeApiUrl: string = "https://youtube.googleapis.com/youtube/v3";
  videoPlayListKPop: string = "PLwgftAdEcD4rXHmDdFTFI8Hch3BfWBQIt";
  apiRootURL: string = '/api/v1/video';
  apiURL: string = '/api/v1';

  // TODO migrer dans cache service?
  headers = new HttpHeaders()
    .set('content-Type', 'application/json');


  private playlistSelectedSubject = new Subject<IPlaylist>();
  playlistSelectedAction$ = this.playlistSelectedSubject.asObservable();

  private videoTagsModifiedSubject: Subject<IVideo> = new Subject<IVideo>();
  videoTagsModifiedAction$: Observable<IVideo> = this.videoTagsModifiedSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoadingAction$ = this.isLoadingSubject.asObservable();

  private sortByTagSubject = new BehaviorSubject<ITag[]>([]);
  sortByTagAction$ = this.sortByTagSubject.asObservable();  
  private sortByRatingSubject = new BehaviorSubject<number>(0);
  sortByRatingAction$ = this.sortByRatingSubject.asObservable();  
  private sortByNewSubject = new BehaviorSubject<boolean>(false);
  sortByNewAction$ = this.sortByNewSubject.asObservable(); 

  private videoPlayingSubject = new BehaviorSubject<string>(''); 
  videoPlayingAction$ = this.videoPlayingSubject.asObservable();

  private videoSelectedSubject = new BehaviorSubject<string>(''); 
  videoSelectedAction$ = this.videoSelectedSubject.asObservable();



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

  videosFromPlaylist$: Observable<IVideo[]> = this.playlistSelectedAction$
    .pipe(
      tap(() => this.showLoadingRetroaction()),
      switchMap( (playlistId: IPlaylist) => {
        const getVideoPageFromYoutube = this.makeYoutubeAPICall(playlistId.id)
          .pipe(          
            expand(() => this.makeYoutubeAPICall(playlistId.id)),
            takeWhile(() => this.nextPageToken !== '', true),
            reduce((acc, curr) => acc.concat(curr))
          );
        return getVideoPageFromYoutube;
      }),
      shareReplay(1)
    );

    videoTagsAssociationsFromDB$: Observable<any> = this.http.get(`${this.apiRootURL}/tags`)
    .pipe(
      catchError(err => this.errorService.handleError(err))
    );

  videoInfosFromDB$: Observable<IVideo[]> = this.http.get<IVideo[]>(`${this.apiRootURL}/information`, {
      context: new HttpContext().set(CACHEABLE, true)
    })
      .pipe(
        catchError(err => this.errorService.handleError(err))
      );

  tagsInfoFromDB$: Observable<ITag[]> = this.tagService.tagsModified$;

  allInfoFromDB$: Observable<IVideo[]> = combineLatest([
    this.videoInfosFromDB$,
    this.videoTagsAssociationsFromDB$,
    this.tagsInfoFromDB$
  ]).pipe(
    map( ([videoInfo, videoTagAssociation, tagsinformation]) => {
      const videosWithMergedTags: IVideo[] = videoInfo.map((video: any) => {
        const associatedVideoTags = videoTagAssociation.find( (vt: any) => vt.youtubeId === video.youtubeId);
        let associatedVideoTagsWithInfo: ITag[] = [];
        let artistsTags: ITag[] = [];
        let otherTags: ITag[] = [];
    
        if (typeof associatedVideoTags !== 'undefined') {
          associatedVideoTagsWithInfo = associatedVideoTags.tags.map( (avt: any) => {
            return tagsinformation.find(ti => ti.id === avt.id) as ITag;
          });

          artistsTags = associatedVideoTagsWithInfo.filter(tag => {
            if ( tag.parent_tag_id === 55 ) {
              return true;
            } else {
              otherTags.push(tag);
            }
          });
        }

        const videoInfoFromBD: IVideo = ({
          ...video,
          tags: otherTags,
          artists: artistsTags
        }) as IVideo

        return videoInfoFromBD;
      });

      return videosWithMergedTags;

    })
  );
  
  videosWithTags$: Observable<IVideo[]> = combineLatest([
    this.videosFromPlaylist$,
    this.allInfoFromDB$
  ]).pipe(
    map( ([videos, infoFromDB]) => {
      const newVideosNotInDB: IVideo[] = [];

      const videoWithAllInfo = videos.map((video: IVideo) => {

        const checkForDuplicates = videos.filter(checkForVideo => checkForVideo.youtubeId === video.youtubeId);
        if( checkForDuplicates.length > 1 ){ console.warn('Duplicate found: ', video.youtubeId, video.title)}

        const mergedDataVideo: IVideo = {...video, ...infoFromDB.find(i=> i.youtubeId === video.youtubeId)}

        const findInDB = infoFromDB.find( (videoInDB: any) => videoInDB.youtubeId === video.youtubeId);

        if (typeof findInDB === 'undefined') {
            newVideosNotInDB.push(video);
        }  

        return mergedDataVideo;
      });

      // TECHNICAL DEBT TODO i don't need the observable, but I need to subscribe to it to have the code run
      // for now, only used to save original video titles, in case it becomes unavailable on youtube
      this.updateNewVideos(newVideosNotInDB).subscribe((videos: IVideo[]) => videos);

      return videoWithAllInfo;
    })
  );

  videoTagsModified$: Observable<IVideo[]> = this.videosWithTags$
    .pipe(
      switchMap( (videosWithTags: IVideo[]) => merge(
          of(videosWithTags),
          this.videoTagsModifiedAction$.pipe(
            concatMap(video => this.saveVideoTagsToBackend(video)),
            catchError(err => this.errorService.handleError(err))
          )
        ).pipe(
          // @ts-ignore - typescript a une haine pour "scan"
          scan((acc: IVideo[], video: IVideo) => {
            return this.adjustVideoList(acc, video);
          }),
          // needed to return correctly an IVideo[] type
          tap((videos: IVideo[]) => {
            return videos;
          }),
          //shareReplay(1),
          catchError(err => this.errorService.handleError(err))
        )
      )
    );

  videosSorted$: Observable<IVideo[]> = combineLatest([
    this.videoTagsModified$,
    this.sortByTagAction$,
    this.sortByRatingAction$,
    this.sortByNewAction$
  ])
    .pipe(
      tap(() => this.showLoadingRetroaction()),
      map(([videos, selectedTags, selectedRating, showOnlyNew]) => {
        
        let sortedVideos: IVideo[] = videos;

        if(videos.length){

          if (showOnlyNew) {
            sortedVideos = sortedVideos.filter((video: IVideo) => {
              return video.rating === 0;
            });
          }

          if (selectedTags.length) {
            sortedVideos = sortedVideos.filter( (video: IVideo) => {
              const combineTagTypes = video.tags.concat(video.artists);
              const videoTags = combineTagTypes || [];
              if (videoTags.length){
                return videoTags.some(videoTag => {
                  return selectedTags.some(selectedTag => selectedTag.id === videoTag.id);
                })
              }
              return false;
            });
          } 

          if (selectedRating !== 0){
            sortedVideos = sortedVideos.filter((video: IVideo) => {
              return video.rating === selectedRating;
            });
          }

          // set default video to the first in the list
          if ( this.videoPlayingSubject.getValue() === '' && sortedVideos.length ) {
            this.videoPlayingIdChanged(sortedVideos[0].youtubeId);
          }      
        }  

        return sortedVideos;
      }),
      tap(() => this.hideLoadingRetroaction()),
      catchError(err => this.errorService.handleError(err)),
      shareReplay(1)
    );

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
        return new IVideo(); 
      }
      // videoList is not yet loaded with default video
      return new IVideo();
    }),
    catchError(err => this.errorService.handleError(err)),
    shareReplay(1)
  );

  // only used for video-edit.
  editedVideo$ = combineLatest([
    this.videoTagsModified$,
    this.videoSelectedAction$
  ]).pipe(
    map( ([videos, selectedVideoId]) => {
      if (selectedVideoId) {
        const searchForVideo = videos.find( video => video.youtubeId === selectedVideoId);
        if (searchForVideo !== undefined){
          return searchForVideo;
        } 

        this.errorService.handleError('Video not found for editing.');
        return new IVideo(); 
      }

      // videoList is not yet loaded with default video
      return new IVideo();
    }),
    catchError(err => this.errorService.handleError(err)),
    shareReplay(1)
  );



  constructor(
    private http: HttpClient,
    private tagService: TagService,
    private errorService: ErrorService) { }     

  makeYoutubeAPICall(playlistId: string): Observable<IVideo[]> {
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
              const mappedVideo: IVideo = this.mapYTInfoToVideoInterface(video);
              return mappedVideo;
            }
          )

          return mappedVideosToInterface;
        }),
        map(videos => {
          // filter out unavailable to play videos until we have other options to manage them
          return videos.filter((video: IVideo) => video.youtubeStatus !== 'private' && video.youtubeStatus !== 'unavailable');
        }),
        catchError(err => this.errorService.handleError(err))
      )
  }

  mapYTInfoToVideoInterface(video: any): IVideo {
    const mappedVideo = new IVideo();

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

  updateNewVideos(videos: IVideo[]): Observable<IVideo[]> {
    const body = JSON.stringify(videos);

    // trop lourd pour le serveur si on envoie TOUS les vidéos pour mise jour
    // utiliser forkjoin ?
  
    return this.http.post<IVideo[]>(`${this.apiRootURL}/update`, body, {
      headers: this.headers
    })
    .pipe(
        map(() => videos),
        catchError(err => this.errorService.handleError(err))
      )
  }

  adjustVideoList(videos: IVideo[], video: IVideo): IVideo[] {
    let updatedVideoList = videos;

    if (video.status === StatusCode.updated) {
      updatedVideoList = videos.map(v => v.youtubeId === video.youtubeId ? {...video, status: StatusCode.unchanged} : v);
    }

    if (video.status === StatusCode.deleted) {
      updatedVideoList = videos.filter(v => v.youtubeId !== video.youtubeId);
    }

    return updatedVideoList;
  }

  updateVideo(updatedVideo: IVideo): void {
    const modifiedVideo = { ...updatedVideo };
    modifiedVideo.status = StatusCode.updated;
    this.videoTagsModifiedSubject.next(modifiedVideo);
  }

  deleteVideo(deletedVideo: IVideo): void {
    const modifiedVideo = { ...deletedVideo };
    modifiedVideo.status = StatusCode.deleted;
    this.videoTagsModifiedSubject.next(modifiedVideo);
  }

  showLoadingRetroaction() {
    this.isLoadingSubject.next(true);
  }

  hideLoadingRetroaction() {
    this.isLoadingSubject.next(false);
  }

  sortVideoListByTag(selectedTags: ITag[]): void {
    this.videoPlayingSubject.next('');
    this.sortByTagSubject.next(selectedTags);
  }

  sortVideoListByRating(rating: number): void {
    this.videoPlayingSubject.next('');
    console.log('rating sort', this.videoPlayingSubject.getValue() + '---');
    this.sortByRatingSubject.next(rating);
  }

  sortVideoListByNewOnly(showOnlyNew: boolean): void {
    this.videoPlayingSubject.next('');
    this.sortByNewSubject.next(showOnlyNew);
  }

  videoPlayingIdChanged(selectedVideoId: string): void {
    this.videoPlayingSubject.next(selectedVideoId);
  }

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

  playPreviousVideo(videoList: IVideo[]) {
    const currentVideoPosition = videoList.findIndex( (v: IVideo) => {
      return v.youtubeId === this.videoPlayingSubject.getValue();
    });
    const videosSortedLength = videoList.length;
    const previousVideoPosition = currentVideoPosition === 0 ? videosSortedLength - 1 : currentVideoPosition - 1;
    this.videoPlayingIdChanged(videoList[previousVideoPosition].youtubeId);
  }

  saveVideoTagsToBackend(video: IVideo): Observable<IVideo> {
    const body = JSON.stringify(video);
    let params = new HttpParams(); 
    params = params.append('id', video.youtubeId);

    if (video.status === StatusCode.updated) {
      return this.http.put(`${this.apiRootURL}/tags/update/${video.youtubeId}`, body, { 
        headers: this.headers,
        params: params 
      })
        .pipe(
          map(() => video),
          catchError(err => this.errorService.handleError(err))
        )
    } else if (video.status === StatusCode.deleted) {
      return this.http
        .delete(this.youtubeApiUrl + '/playlistItems', {
          params: {
            'key': this.youtubeApiKey,
            'id': video.uniqueYoutubeId
          }
      })
        .pipe(
          switchMap(apiResponse => {
            // TODO finish this
            // blocked at the part that I think I dont have to right credentials to use that endpoint of the API
            /*if (apiResponse === 1){*/
              return this.http.delete(`${this.apiRootURL}/video/${video.uniqueYoutubeId}`, { 
                headers: this.headers
              })
                .pipe(
                  map(() => video),
                  catchError(err => this.errorService.handleError(err))
                );
            /*} else {
              // throw error             
            }*/

          }),
          map(() => video),
          catchError(err => this.errorService.handleError(err))
        )
    } else {
      return of(video);
    }

  }

}

