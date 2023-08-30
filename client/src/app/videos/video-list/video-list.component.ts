import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { Subject, combineLatest, Observable } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';

import { VideoService } from '../video-service';
import { IVideo } from '../video.model';
import { IPlaylist } from '../playlist.model';

import { Store } from '@ngrx/store';
import { State } from '../state/video.reducer';
import * as VideoActions from "../state/video.action";


@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['video-list.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class VideoListComponent {

  currentlyPlayingVideoPosition: number = 0;

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  videos$ = this.videoService.videosSorted$;
  allVideos$ = this.videoService.videoTagsModified$;
  videoPlaying$ = this.videoService.videoPlaying$;

  selectedPlaylist!: IPlaylist;

  isLoading$ = this.videoService.isLoadingAction$;

  playlistList$: Observable<IPlaylist[]> = this.videoService.playlists$
    .pipe( 
      tap((playlists: IPlaylist[]) => {
        this.selectedPlaylist = playlists[0];
        this.sortByPlaylist();
      })
    );

  currentlyPlayingVideoPosition$: Observable<number> = combineLatest([
      this.videos$,
      this.videoPlaying$
    ])
    .pipe(
      map( ([videoList, currentVideoPlaying]) => {
        const videoPositionInList: number = videoList.indexOf(currentVideoPlaying);
        return videoPositionInList + 1;
      })
    );

  vm$ = combineLatest([
    this.videos$,
    this.allVideos$,
    this.videoPlaying$
  ]).pipe(
    map(([sortedVideos, allVideos, videoPlaying]) =>
        ({ sortedVideos, allVideos, videoPlaying }))
  )  

  constructor(private route: ActivatedRoute,
              private store: Store<State>,
              private router: Router,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private videoService: VideoService) { }

  updateFromYoutube(): void {
    // to do
  }
  
              editTags(objectId: string) {
    this.router.navigate([objectId, 'edit-tag'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

  playVideo(video: IVideo) {
    this.store.dispatch(VideoActions.setCurrentVideo({ video }));
    this.videoService.videoPlayingIdChanged(video.youtubeId);
  }

  sortByPlaylist(): void {
    this.videoService.sortAppByPlaylist(this.selectedPlaylist);
  }

  deleteVideo(selectedForDeletion: IVideo): void {
    this.videoService.deleteVideo(selectedForDeletion);
  }

  scrollToCurrentlyPlaying(videoList: any): void {
    // get current id of video playing
    // get its top position
    // use .scrollTop(value)
  }

  confirmDeletion(selectedForDeletion: IVideo) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this video form the Youtube Playlist?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.videoService.deleteVideo(selectedForDeletion);
        this.messageService.add({severity:'info', summary:'Confirmed', detail:'Tag deleted.'});
      },
      reject: ( () => {
        this.messageService.add({severity:'warn', summary:'Cancelled', detail:'Action was cancelled.'});
      })
    });
  }

}
