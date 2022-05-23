import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, EMPTY, Subject } from 'rxjs';

import { ITag } from 'src/models/tag-model';
import { TagService } from 'src/app/tags/tag-service';
import { VideoService } from '../video-service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-video-tag-edit',
  templateUrl: './video-tag-edit.component.html'
})
export class VideoTagEditComponent implements OnInit {

  //tagsAssigned: ITag[] = [];

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  private videoSelectedSubject = new BehaviorSubject<number>(0); 
  videoSelectedAction$ = this.videoSelectedSubject.asObservable();

  video$ = this.videoService.selectedVideo$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )
    
  // pour pouvoir choisir dans la liste les tags disponibles pour assignation
  tags$ = this.tagService.tags$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY; 
      })
    );

  constructor(private tagService: TagService,
              private videoService: VideoService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {

    this.route.params 
      .subscribe(
        (params: Params) => {
          this.videoSelectedSubject.next(+params['id']);

          /* latence a recevoir les données. pas toujours prêt */
          //this.tagsAssigned = this.videoService.getAssignedTags(this.id);
          //console.log(this.tagsAssigned);
        }
      )

   /* this.videoTagSub = this.videoService.assignedTabsChanged
      .subscribe(
        (tags: Tag[]) => {
          this.tagsAssigned = tags;
        }
      );*/

  }

  checkInTagsAssigned(id: number) {
    let isAssigned = false;

    /*if ( this.tagsAssigned.findIndex( obj => obj.id === id) > -1 ) {
      isAssigned = true;
    }*/

    return isAssigned;
  }

  onAddTag(id: number) {
    // to redo without Parse   
    //this.videoService.updateTagsAssigned(this.tagsAssigned, this.id);
  }

  onRemoveTag(id: number) {
    /*
    const objIndex = this.tagsAssigned.findIndex( obj => obj.id === id)
    this.tagsAssigned.splice(objIndex, 1);
    this.videoService.updateTagsAssigned(this.tagsAssigned, this.id);
    */
  }


}
