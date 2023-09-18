import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';

import { Tag, TagForm } from '../tag.model';
import { TagService } from '../tag.service';
import { tap } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StatusCode } from 'src/app/shared/global-model';
import { IPlaylist } from 'src/app/videos/playlist.model';

import { Store } from '@ngrx/store';
import { State, getCurrentTag, getParentTags } from '../state/tag.reducer';
import * as TagActions from '../state/tag.action';

@Component({
  selector: 'app-tag-edit',
  templateUrl: './tag-edit.component.html',
  styleUrls: ['tag-edit.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class TagEditComponent implements OnInit, OnDestroy {

  private idSub!: Subscription;
  tag!: Tag;
  playlistHardcoded = 'PLwgftAdEcD4rXHmDdFTFI8Hch3BfWBQIt';
  
  tagForm: TagForm = this.fb.group({
    title: this.fb.control('', Validators.required),
    color: this.fb.control('#777777'),
    description: this.fb.control(''),
    parent_tag_id: this.fb.control(0)
  });

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  tagGroupChoices$!: Observable<Tag[]>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<State>,
              private fb: NonNullableFormBuilder,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private tagService: TagService) {                 
  }

  ngOnInit() {

    this.store.select(getCurrentTag)
      .subscribe(tag => {
        this.displayTag(tag);
      })

    this.tagGroupChoices$ = this.store.select(getParentTags).pipe(
      tap(tags => {
        const noneOption = new Tag();
        noneOption.title = 'None';
        tags.unshift(noneOption)
      })
    );
    
    this.idSub = this.route.params 
      .subscribe(
        (params: Params) => {
          const id = +params['id'];
          if ( id !== 0 ){
            this.store.dispatch(TagActions.setCurrentTag({ tagId: id }));
          } else {
            this.store.dispatch(TagActions.setCurrentTag({ tagId: 0 }));
            this.resetForm();
          }
        }
      )

  }

  displayTag(tag: Tag){
    this.tag = tag;

    this.tagForm.patchValue({
      title: tag.title,
      color: tag.color,
      description: tag.description,
      parent_tag_id: tag.parent_tag_id
    })
  }

  addTag() {
    const newTag: Tag = new Tag();
    newTag.title = this.tagForm.value['title']!;
    newTag.color = this.tagForm.value['color']!;
    newTag.description = this.tagForm.value['description']!;
    newTag.parent_tag_id = this.tagForm.value['parent_tag_id']!;
    newTag.status = StatusCode.added;
    newTag.playlist_id = this.playlistHardcoded;
    
    this.store.dispatch(TagActions.createTag({ tag: newTag }));
    this.resetPage();
  }

  updateTag() {
    if (this.tagForm.valid){
      const updatedTag = {...this.tag, ...this.tagForm.value};
      updatedTag.status = StatusCode.updated;
      this.store.dispatch(TagActions.updateTag({ tag: updatedTag }));
      this.resetPage();
    }
  }

  confirmDeletion() {
    this.confirmationService.confirm({
      message: 'Do you want to delete this tag?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteTag();
        this.messageService.add({severity:'info', summary:'Confirmed', detail:'Tag deleted.'});
      },
      reject: ( () => {
        this.messageService.add({severity:'warn', summary:'Cancelled', detail:'Action was cancelled.'});
      })
    });
  }

  deleteTag() {
    const deletedTag = {
      ...this.tag,
      status: StatusCode.deleted
    };

    this.store.dispatch(TagActions.deleteTag({ tagId: deletedTag.id }));
    this.resetPage();
  }

  resetForm(){
    this.tagForm.reset();
  }

  resetPage(){
    this.resetForm();
    this.store.dispatch(TagActions.setCurrentTag({ tagId: 0 }));
    this.router.navigate(['../../'], {relativeTo: this.route})
  }

  removeColor() {
    this.tagForm.patchValue({
      color: ''
    })
  }

  ngOnDestroy(): void {
    this.idSub.unsubscribe();
  }


}