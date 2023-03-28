import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['videos.component.scss'],
  encapsulation : ViewEncapsulation.None

})
export class VideosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
