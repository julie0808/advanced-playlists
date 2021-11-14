import { Component, OnInit } from '@angular/core';

import { Video } from '../video.model';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html'
})
export class VideoListComponent implements OnInit {
  videos: Video[] = [
    new Video(
      'Tim Schaufert & Cashforgold - I\'ll Know Who I Am In Time',
      '2Q1BxUECk6M',
      '00:26', // type should be valid time format
      '2020-03-03', // type should be changed for valid date
      [{name: 'test', id: 'test'}],
      'Tim Schaufert & Cashforgold',
      [{name: 'Original PL on YT', id: 'PLwgftAdEcD4qcsf5Nv9vZYQdujHqGOfbv', dateAdded: '2020-01-01'}]
    ),
    new Video(
      'Post Malone - Hollywood\'s Bleeding (Audio)',
      'w5GrxfjuTTI',
      '00:26', // type should be valid time format
      '2020-03-03', // type should be changed for valid date
      [],
      'Post Malone',
      [{name: 'Original PL on YT', id: 'PLwgftAdEcD4qcsf5Nv9vZYQdujHqGOfbv', dateAdded: '2020-01-01'}]
    )
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
