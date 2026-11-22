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

import * as SharedHelperFunc from '../../shared/state/shared-helper-func';



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
        map(data => {
          const [dataFromYoutube, dataFromDatabase] = data;
          const newVideosNotInDB: Video[] = [];
          const videoCountById = new Map<string, number>();
          const databaseVideosById = new Map<string, Video>();

          for (const video of dataFromDatabase) {
            databaseVideosById.set(video.youtubeId, video);
          }

          for (const video of dataFromYoutube) {
            videoCountById.set(
              video.youtubeId,
              (videoCountById.get(video.youtubeId) ?? 0) + 1
            );
          }

          const videos = dataFromYoutube.map(video => {
            if ((videoCountById.get(video.youtubeId) ?? 0) > 1) {
              console.warn('Duplicate found: ', video.youtubeId, video.title);
            }

            const existingVideo = databaseVideosById.get(video.youtubeId);
            if (!existingVideo) {
              newVideosNotInDB.push(video);
            }

            return { ...video, ...existingVideo };
          });

          return { videos, newVideosNotInDB };
        }),
        mergeMap(({ videos, newVideosNotInDB }) =>
          this.videoService.updateNewVideos(newVideosNotInDB).pipe(
            map(() => VideoApiActions.loadVideosSuccess({ videos }))
          )
        ),
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

        const newVideoList = videoList.map((v: Video) => {

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

  randomizeVideos$ = createEffect( () => {
    return this.actions$.pipe(
      ofType(VideoPageActions.randomizeVideos),
      withLatestFrom(
        this.store$.select(getVideos)
      ),
      mergeMap(([action, videoList]) => {

        const newVideoList = SharedHelperFunc.shuffle(videoList);
        console.log('random me!');

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