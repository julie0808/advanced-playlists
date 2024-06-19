import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { forkJoin, of } from "rxjs";
import { mergeMap, map, catchError, concatMap, switchMap, withLatestFrom } from "rxjs/operators";

import { VideoService } from "../video.service";
import { VideoApiActions, VideoPageActions } from "./actions";
import { Video } from "../video.model";

import { Store } from '@ngrx/store';
import { State, getCurrentPlaylistId } from '../../shared/state';
import { getVideos } from ".";



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

          // save to database new videos
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

  updateVideo$ = createEffect( () => {
    return this.actions$.pipe(
      ofType(VideoPageActions.updateVideo),
      withLatestFrom(
        this.store$.select(getCurrentPlaylistId)
      ),
      concatMap(([action, playlistId]) => {
        const actionResultat = this.videoService.updateVideo(action.video, playlistId)
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

  updateVideoTag$ = createEffect( () => {
    return this.actions$.pipe(
      ofType(VideoPageActions.updateVideoTag),
      withLatestFrom(
        this.store$.select(getVideos)
      ),
      mergeMap(([action, videoList]) => {

        const newVideoList = videoList.map(v => {

          const tagList = v.tags.map(t => {
            return t.id === action.tag.id ? action.tag : t;
          });

          const artistList = v.artists.map(a => {
            return a.id === action.tag.id ? action.tag : a;
          });

          const updatedVideo: Video = {
            ...v,
            tags: tagList,
            artists: artistList
          };

          return updatedVideo;
        });

        return of(VideoPageActions.refreshVideos({ videos: newVideoList }));

      })
    )
  });

  setFirstVideo$ = createEffect( () => {
    return this.actions$.pipe(
      ofType(VideoApiActions.loadVideosSuccess),
      concatMap(action => {
        return of(VideoPageActions.setCurrentVideo( 
          { videoId: action.videos[0].youtubeId }
        ));
      })
    )
  });


}