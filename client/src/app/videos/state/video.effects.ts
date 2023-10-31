import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { forkJoin, of } from "rxjs";
import { mergeMap, map, catchError, concatMap, switchMap, withLatestFrom } from "rxjs/operators";

import { VideoService } from "../video.service";
import { VideoApiActions, VideoPageActions } from "./actions";
import { Video } from "../video.model";

import { Store } from '@ngrx/store';
import { State, getCurrentPlaylistId } from '../../shared/state';



@Injectable()
export class VideoEffects {

  constructor(
    private actions$: Actions,
    private store$: Store<State>,
    private videoService: VideoService
  ) {}
  
  loadVideos$ = createEffect( () => {
    return this.actions$
      .pipe(
        ofType(VideoPageActions.loadVideos),
        withLatestFrom(
          this.store$.select(getCurrentPlaylistId)
        ),
        switchMap(([action, playlistId]) => {
          const allData = forkJoin([
            this.videoService.getVideosFromYoutube(playlistId),
            this.videoService.getVideosFromDatabase(playlistId)
          ])
          return allData;
        }),
        mergeMap( data => {
          const [dataFromYoutube, dataFromDatabase] = data;
          const newVideosNotInDB: Video[] = [];

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

            const findInDB = dataFromDatabase.find( videoInDB => {
              const findVideo = videoInDB.youtubeId === video.youtubeId || false;
              return findVideo;
            });

            if (!findInDB) {
              newVideosNotInDB.push(video);
            }
        
            return mergedDataVideo;
          });
        
          const allData = forkJoin([of(videos), of(newVideosNotInDB)]);
          return allData;

        }),
        mergeMap( data => {
          const [finalList, newVideoList] = data;
          
          // there is a possibility of bug if over 50 videos
          const actionResultat = this.videoService.updateNewVideos(newVideoList)
            .pipe(
              map(() => {
                return VideoApiActions.loadVideosSuccess({ videos: finalList });
              }),
              catchError(error => {
                throw new Error(error);
              })
            );

            return actionResultat;
        }),
        catchError( error => {
          return of(VideoApiActions.loadVideosFailure({ error }))
        })
      )
  });

  updateVideos$ = createEffect( () => {
    return this.actions$.pipe(
      ofType(VideoPageActions.updateVideo),
      concatMap(action => {
        const actionResultat = this.videoService.updateVideo(action.video)
          .pipe(
            map(video => {
              return VideoApiActions.updateVideoSuccess({ video });
            }),
            catchError(error => {
              return of(VideoApiActions.updateVideoFailure({ error }));
            })
          )
        return actionResultat;
      })
    )
  });
}