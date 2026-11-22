import { AfterViewInit, ChangeDetectorRef, Component, DestroyRef, ElementRef, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';

import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { RatingModule } from 'primeng/rating';
import { ScrollPanel } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';

import { Video } from '../video.model';

import { Store } from '@ngrx/store';
import { State, getVideos, getCurrentVideo, getSortedVideos, getCurrentVideoPosition, getVideosLoading } from '../state';
import { getCurrentPlaylistId } from '../../shared/state';

import { VideoPageActions } from "../state/actions";


@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ConfirmDialogModule, ContextMenuModule, ScrollPanel, RatingModule, ToastModule],
  templateUrl: './video-list.component.html',
  styleUrls: ['video-list.component.scss'],
  encapsulation : ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class VideoListComponent implements AfterViewInit, OnDestroy {
  menuTagOptions: MenuItem[] = [];
  currentlyPlayingVideoPosition: number = 0;
  isCurrentlyPlayingVisible = true;

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  private scrollViewport?: HTMLElement;
  private visibilityCheckFrame: number | null = null;

  currentPlaylistId: string = '';
  
  fullVideoData$ = this.store.select(getVideos);
  videosLoading$ = this.store.select(getVideosLoading);
  videosSorted$ = this.store.select(getSortedVideos);
  currentVideoPlaying$ = this.store.select(getCurrentVideo);
  currentVideoPosition$ = this.store.select(getCurrentVideoPosition);

  @ViewChild('cm') cm!: ContextMenu;
  @ViewChild('videoList') videoList!: ScrollPanel;
  @ViewChild('videoList', { read: ElementRef }) videoListElement!: ElementRef<HTMLElement>;

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
    private confirmationService: ConfirmationService,
    private changeDetectorRef: ChangeDetectorRef,
    private destroyRef: DestroyRef) { }
  
  ngOnInit(): void {
    this.store.select(getCurrentPlaylistId)
      .subscribe(playlistId => {
        this.currentPlaylistId = playlistId;
      })

    this.menuTagOptions = [
      { label: 'Show matching', icon: 'pi pi-plus-circle', command: () => this.addToIncludedTags() },
      { label: 'Filter out', icon: 'pi pi-minus-circle', command: () => this.addToExcludedTags() }
    ];

  }

  ngAfterViewInit(): void {
    this.scrollViewport = this.videoList.contentViewChild?.nativeElement;
    this.scrollViewport?.addEventListener('scroll', this.updateCurrentlyPlayingVisibility);

    combineLatest([this.vm$, this.videosLoading$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.scheduleVisibilityCheck());

    this.scheduleVisibilityCheck();
  }

  ngOnDestroy(): void {
    this.scrollViewport?.removeEventListener('scroll', this.updateCurrentlyPlayingVisibility);
    if (this.visibilityCheckFrame !== null) {
      cancelAnimationFrame(this.visibilityCheckFrame);
    }
  }

  hasPlaylistSelected(): boolean {
    return this.currentPlaylistId !== '' ? true : false;
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

  scrollToCurrentlyPlaying(): void {
    const activeVideo = this.scrollViewport?.querySelector<HTMLElement>('.video--active');
    if (!activeVideo || !this.scrollViewport) {
      return;
    }

    const topInset = 10;
    const top = this.scrollViewport.scrollTop
      + activeVideo.getBoundingClientRect().top
      - this.videoListElement.nativeElement.getBoundingClientRect().top
      - topInset;
    this.scrollViewport.scrollTo({ top, behavior: 'smooth' });
  }

  private scheduleVisibilityCheck(): void {
    if (this.visibilityCheckFrame !== null) {
      cancelAnimationFrame(this.visibilityCheckFrame);
    }
    this.visibilityCheckFrame = requestAnimationFrame(() => {
      this.visibilityCheckFrame = null;
      this.updateCurrentlyPlayingVisibility();
    });
  }

  private updateCurrentlyPlayingVisibility = (): void => {
    if (!this.scrollViewport) {
      return;
    }

    const activeVideo = this.scrollViewport.querySelector<HTMLElement>('.video--active');
    if (!activeVideo) {
      if (!this.isCurrentlyPlayingVisible) {
        this.isCurrentlyPlayingVisible = true;
        this.changeDetectorRef.markForCheck();
      }
      return;
    }

    const viewportBounds = this.videoListElement.nativeElement.getBoundingClientRect();
    const activeBounds = activeVideo.getBoundingClientRect();
    const isVisible = activeBounds.bottom > viewportBounds.top
      && activeBounds.top < viewportBounds.bottom;

    if (this.isCurrentlyPlayingVisible !== isVisible) {
      this.isCurrentlyPlayingVisible = isVisible;
      this.changeDetectorRef.markForCheck();
    }
  };

  addToIncludedTags() {

  }

  addToExcludedTags() {

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
