import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { Subject, Observable, combineLatest } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';

import { VideoService } from '../video.service';
import { Video } from '../video.model';
import { IPlaylist } from '../playlist.model';

import { Store } from '@ngrx/store';
import { State, getVideos, getCurrentVideo, getSortedVideos, getCurrentVideoPosition } from '../state';
import { VideoPageActions } from "../state/actions";


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

  selectedPlaylist!: IPlaylist;

  playlistList$: Observable<IPlaylist[]> = this.videoService.playlists$
    .pipe( 
      tap((playlists: IPlaylist[]) => {
        this.selectedPlaylist = playlists[0];
        this.sortByPlaylist();
      })
    );

  fullVideoData$ = this.store.select(getVideos);
  videosSorted$ = this.store.select(getSortedVideos);
  currentVideoPlaying$ = this.store.select(getCurrentVideo);
  currentVideoPosition$ = this.store.select(getCurrentVideoPosition);

  vm$ = combineLatest([
    this.videosSorted$,
    this.fullVideoData$,
    this.currentVideoPlaying$,
    this.playlistList$,
    this.currentVideoPosition$
  ]).pipe(
    map(([sortedVideos, allVideos, videoPlaying, playlistList, currentVideoPosition]) =>
        ({ sortedVideos, allVideos, videoPlaying, playlistList, currentVideoPosition}))
  )  

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private videoService: VideoService) { }
  
  ngOnInit(): void {
    
  }

  editTags(objectId: string) {
    this.router.navigate([objectId, 'edit-tag'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

  playVideo(video: Video) {
    this.store.dispatch(VideoPageActions.setCurrentVideo({ videoId: video.youtubeId }));
  }

  sortByPlaylist(): void {
    this.videoService.sortAppByPlaylist(this.selectedPlaylist);
  }

  deleteVideo(selectedForDeletion: Video): void {
    // will be a store dispatch eventually. unfinished
  }

  scrollToCurrentlyPlaying(videoList: any): void {
    // get current id of video playing
    // get its top position
    // use .scrollTop(value)
  }

  confirmDeletion(selectedForDeletion: Video) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this video form the Youtube Playlist?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteVideo(selectedForDeletion);
        this.messageService.add({severity:'info', summary:'Confirmed', detail:'Tag deleted.'});
      },
      reject: ( () => {
        this.messageService.add({severity:'warn', summary:'Cancelled', detail:'Action was cancelled.'});
      })
    });
  }

}
