import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FiltersComponent } from './filters/filters.component';
import { VideoListComponent } from './video-list/video-list.component';
import { VideoPlayerComponent } from './video-player/video-player.component';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [RouterModule, FiltersComponent, VideoListComponent, VideoPlayerComponent],
  templateUrl: './videos.component.html',
  styleUrls: ['videos.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class VideosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
