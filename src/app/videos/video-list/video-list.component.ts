import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from '../video-service';

import { Video } from '../video.model';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html'
})
export class VideoListComponent implements OnInit {
  videoList: Video[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private videoService: VideoService) { }

  ngOnInit(): void {
    this.videoList = this.videoService.getVideos();
  }

  onEditTags(objectId: string) {
    this.router.navigate([objectId, 'edit-tag'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

}
