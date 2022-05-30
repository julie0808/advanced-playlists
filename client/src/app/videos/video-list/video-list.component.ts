import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { VideoService } from '../video-service';

import { IVideo } from '../../../models/video.model';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html'
})
export class VideoListComponent implements OnInit {

  videos$ = this.videoService.videos$;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private videoService: VideoService) { }

  ngOnInit(): void {
    
  }

  editTags(objectId: string) {
    this.router.navigate([objectId, 'edit-tag'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

}
