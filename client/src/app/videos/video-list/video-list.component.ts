import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Video } from '../video.model';

import { Store } from '@ngrx/store';
import { State, getVideos, getCurrentVideo, getSortedVideos, getCurrentVideoPosition } from '../state';
import { getCurrentPlaylistId } from '../../shared/state';

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

  currentPlaylistId!: string;
  
  fullVideoData$ = this.store.select(getVideos);
  videosSorted$ = this.store.select(getSortedVideos);
  currentVideoPlaying$ = this.store.select(getCurrentVideo);
  currentVideoPosition$ = this.store.select(getCurrentVideoPosition);

  vm$ = combineLatest([
    this.videosSorted$,
    this.fullVideoData$,
    this.currentVideoPlaying$,
    this.currentVideoPosition$
  ]).pipe(
    map(([sortedVideos, allVideos, videoPlaying, currentVideoPosition]) =>
        ({ sortedVideos, allVideos, videoPlaying, currentVideoPosition}))
  )  

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }
  
  ngOnInit(): void {
    this.store.select(getCurrentPlaylistId)
      .subscribe(playlistId => {
        this.currentPlaylistId = playlistId;
      })
  }

  editTags(objectId: string) {
    this.router.navigate([objectId, 'edit-tag'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

  playVideo(video: Video) {
    this.store.dispatch(VideoPageActions.setCurrentVideo({ videoId: video.youtubeId }));
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
