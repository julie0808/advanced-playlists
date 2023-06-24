import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, tap } from 'rxjs';

import { IPlaylist } from '../videos/playlist.model';
import { TagService } from './tag-service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['tags.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class TagsComponent {

  loading = false;
  selectedPlaylist!: IPlaylist;

  playlistList$: Observable<IPlaylist[]> = this.tagService.playlists$
    .pipe( 
      tap((playlists: IPlaylist[]) => {
        this.selectedPlaylist = playlists[0];
        this.sortByPlaylist();
      })
    );

  constructor(private router: Router,
              private tagService: TagService,
              private route: ActivatedRoute) { 
  }

  addNewTag() {
    this.router.navigate([0, 'edit'], {relativeTo: this.route})
  }

  sortByPlaylist(): void {
    this.tagService.sortAppByPlaylist(this.selectedPlaylist);
  }

}
