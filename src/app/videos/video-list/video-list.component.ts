import { Component, OnInit } from '@angular/core';

import { Video } from '../video.model';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html'
})
export class VideoListComponent implements OnInit {
  videos: Video[] = [
    new Video(
      'The Boyz - MAMA 2020 - Reveal & Checkmate',
      'n8aOScCgPYg',
      '00:26', // type should be valid time format
      '2020-03-03', // type should be changed for valid date
      [{name: 'uplifting', id: 3, intensity: 1, color: '#C99997'},{name: 'epic', id: 1, intensity: 2, color: '#94AD9C'},{name: 'sad', id: 1, intensity: 3, color: '#94AD9C'}],
      [{name: 'The song that started it all', id: 2, groupName: 'Fandom', groupId: 1},{name: 'Pop', id: 2, groupName: 'Musical style', groupId: 1}],
      'The Boyz',
      [{name: 'Original PL on YT', id: 12345, dateAdded: '2020-01-01'}],
      false
    ),
    new Video(
      'SKZ - Side effects',
      '5rPluw_-Eb4',
      '00:26', // type should be valid time format
      '2020-03-03', // type should be changed for valid date
      [{name: 'energetic', id: 3, intensity: 3, color: '#C99997'}],
      [{name: 'Right in the feels', id: 2, groupName: 'Awesome group name', groupId: 1},{name: 'The song that started it all', id: 2, groupName: 'Fandom', groupId: 1}],
      'Stray Kids',
      [{name: 'Original PL on YT', id: 12345, dateAdded: '2020-01-01'}],
      true
    )
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
