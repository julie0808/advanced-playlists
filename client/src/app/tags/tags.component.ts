import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from '@angular/common';

import { TagListComponent } from './tag-list/tag-list.component';

import { Store } from '@ngrx/store';
import { State, getCurrentPlaylist } from '../shared/state';

import { Playlist } from '../playlists/playlist.model';



@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [CommonModule,RouterModule, TagListComponent],
  templateUrl: './tags.component.html',
  styleUrls: ['tags.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class TagsComponent {

  currentPlaylist!: Playlist;

  constructor(
    private router: Router,
    private store: Store<State>,
    private route: ActivatedRoute) { 
  }

  ngOnInit() {
    this.store.select(getCurrentPlaylist)
      .subscribe(playlist => {
        const strongTypedPlaylist: Playlist = playlist || new Playlist();

        if ( strongTypedPlaylist.id !== 'none' ) {
          this.currentPlaylist = playlist || new Playlist();
        }
        
      })
  }

  addNewTag() {
    this.router.navigate([0, 'edit'], {relativeTo: this.route})
  }

  isPlaylistLoaded() {
    return this.currentPlaylist && this.currentPlaylist.id !== 'none';
  }

}
