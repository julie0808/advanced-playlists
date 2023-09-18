import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { forkJoin, of } from "rxjs";
import { mergeMap, map, catchError, concatMap, tap, switchMap } from "rxjs/operators";

import { VideoService } from "../video.service";
import * as VideoActions from "./video.action";
import { Video } from "../video.model";



@Injectable()
export class VideoEffects {

  constructor(
    private actions$: Actions,
    private videoService: VideoService
  ) {}
  
  loadVideos$ = createEffect( () => {
    return this.actions$
      .pipe(
        ofType(VideoActions.loadVideos),
        switchMap(() => {
          return forkJoin([
            this.videoService.getVideosFromYoutube(),
            this.videoService.getVideosFromDatabase()
          ])
        }),
        mergeMap( data => {
          const [dataFromYoutube, dataFromDatabase] = data;

          const videos = dataFromYoutube.map((video: Video) => {

            const checkForDuplicates = dataFromYoutube.filter(checkForVideo => {
              return checkForVideo.youtubeId === video.youtubeId;
            });
      
            if( checkForDuplicates.length > 1 ){ 
              console.warn('Duplicate found: ', video.youtubeId, video.title);
            }
      
            const mergedDataVideo: Video = {
              ...video, 
              ...dataFromDatabase.find(i=> i.youtubeId === video.youtubeId)
            }        

            //const findInDB = videosFromDatabase.find( (videoInDB: any) => {
            //  return videoInDB.youtubeId === video.youtubeId;
            //});

            //if (typeof findInDB === 'undefined') {
            //    newVideosNotInDB.push(video);
            //} 
        
            return mergedDataVideo;
          });
        
          // TECHNICAL DEBT TODO i don't need the observable, but I need to subscribe to it to have the code run
          // for now, only used to save original video titles, in case it becomes unavailable on youtube
          //this.updateNewVideos(newVideosNotInDB).subscribe((videos: Video[]) => videos);
          
          return of(VideoActions.loadVideosSuccess({ videos }));
        }),
        catchError( error => {
          return of(VideoActions.loadVideosFailure({ error }))
        })
      )
  });

  updateVideos$ = createEffect( () => {
    return this.actions$.pipe(
      ofType(VideoActions.updateVideo),
      concatMap(action => {
        return this.videoService.updateVideo(action.video).pipe(
          map(video => {
            return VideoActions.updateVideoSuccess({ video });
          }),
          catchError(error => {
            return of(VideoActions.updateVideoFailure({ error }));
          })
        )
      })
    )
  });
}