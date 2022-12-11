import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { EMPTY, Subject, Subscription } from 'rxjs';

import { ITag, StatusCode, ITagForm } from '../tag-model';
import { TagService } from '../tag-service';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-tag-edit',
  templateUrl: './tag-edit.component.html'
})
export class TagEditComponent implements OnInit, OnDestroy {

  private idSub!: Subscription;
  tag!: ITag;
  editMode: boolean = false;
  
  tagForm: ITagForm = this.fb.group({
    title: this.fb.control('', Validators.required),
    color: this.fb.control('#777777'),
    parent_tag_id: this.fb.control(0)
  });

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  lstValidTagGroup$ = this.tagService.validTagGroups$
    .pipe(
      tap(tags => {
        const noneOption = new ITag();
        noneOption.title = 'None';
        tags.push(noneOption)
////////////// TO FINISH
      })
    );

  selectedTag$ = this.tagService.selectedTag$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: NonNullableFormBuilder,
              private tagService: TagService) {                 
  }

  ngOnInit() {

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

  removeColor() {
    this.tagForm.patchValue({
      color: ''
    })
  }

  displayTag(tag: ITag){

    if (this.tagForm) {
      this.tagForm.reset();
    }

    this.tag = tag;

    this.tagForm.patchValue({
      title: tag.title,
      color: tag.color,
      parent_tag_id: tag.parent_tag_id
    })
  }

  setSelectedTag(id: number): void {
    this.tagService.selectedTagChanged(id);
  }

  addTag() {
    const newTag: ITag = new ITag();
    newTag.title = this.tagForm.value['title']!;
    newTag.color = this.tagForm.value['color']!;
    newTag.parent_tag_id = this.tagForm.value['parent_tag_id']!;
    newTag.status = StatusCode.added;
    
    this.tagService.addTag(newTag);
    this.resetPage();
  }

  updateTag() {
    if (this.tagForm.valid){
      const updatedTag = {...this.tag, ...this.tagForm.value};
      updatedTag.status = StatusCode.updated;
      this.tagService.updateTag(updatedTag);
      this.resetPage();
    }
  }

  deleteTag() {
    const deletedTag = this.tag;
    deletedTag.status = StatusCode.deleted;

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