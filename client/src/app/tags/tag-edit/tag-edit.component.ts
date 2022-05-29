import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Subject, Subscription } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

import { ITag, StatusCode } from '../../../models/tag-model';
import { TagService } from '../tag-service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-tag-edit',
  templateUrl: './tag-edit.component.html'
})
export class TagEditComponent implements OnInit, OnDestroy {

  private idSub!: Subscription;
  tagForm!: FormGroup;
  tag!: ITag;
  editMode: boolean = false;

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  selectedTag$ = this.tagService.selectedTag$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private tagService: TagService) { 
  }

  ngOnInit() {

    this.tagForm = this.fb.group({
      title: ['', Validators.required],
      //tags: this.fb.array([])
    });

    this.selectedTag$.subscribe(tag => {
      this.displayTag(tag);
    })
    
    this.idSub = this.route.params 
      .subscribe(
        (params: Params) => {
          this.resetForm();
          const id = +params['id'];
          if ( id !== 0 ){
            this.setSelectedTag(id);
            this.editMode = id !== 0;
          }
        }
      )
  }

  displayTag(tag: ITag){

    if (this.tagForm) {
      this.tagForm.reset();
    }

    this.tag = tag;

    this.tagForm.patchValue({
      title: tag.title
    })
  }

  setSelectedTag(id: number): void {
    this.tagService.selectedTagChanged(id);
  }

  addTag() {
    const newTag: ITag = {
      title: this.tagForm.value['title'], 
      id: 0,
      status: StatusCode.added
    }
    // todo : errorhandling if update fail on the backend?
    this.tagService.addTag(newTag);
    this.resetPage();
  }

  updateTag() {
    if (this.tagForm.valid){
      const updatedTag = {...this.tag, ...this.tagForm.value};
      updatedTag.status = StatusCode.updated;
      // todo : errorhandling if update fail on the backend?
      this.tagService.updateTag(updatedTag);
      this.resetPage();
    }
  }

  deleteTag() {
    const deletedTag = this.tag;
    deletedTag.status = StatusCode.deleted;

    // todo : errorhandling if update fail on the backend?
    this.tagService.updateTag(deletedTag);
    this.resetPage();
  }

  resetForm(){
    this.tagForm.reset();
    this.editMode = false;
  }

  resetPage(){
    this.resetForm();
    //this.router.navigate(['/tags']);
    this.router.navigate(['../../'], {relativeTo: this.route})
  }

  ngOnDestroy(): void {
    this.idSub.unsubscribe();
  }


}