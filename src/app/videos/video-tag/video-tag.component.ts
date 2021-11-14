import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Tag } from 'src/app/tags/tag-model';
import { TagService } from 'src/app/tags/tag-service';
import { VideoService } from '../video-service';

@Component({
  selector: 'app-video-tag',
  templateUrl: './video-tag.component.html'
})
export class VideoTagComponent implements OnInit {
  id: string;
  tagList: Tag[];
  tagsAssigned = [];

  constructor(private tagService: TagService,
              private videoService: VideoService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.params 
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
        }
      )

      this.tagList = this.tagService.getTags();
      this.tagsAssigned = this.videoService.getAssignedTags(this.id);
  }

  onAddTag() {

  }

  onRemoveTag() {

  }

}
