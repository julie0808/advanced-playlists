import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';

import { Tag, TagForm } from '../tag.model';
import { tap } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Store } from '@ngrx/store';
import { State, getCurrentTag, getParentTags } from '../state';
import { getCurrentPlaylistId } from '../../shared/state';
import { TagPageActions } from '../state/actions';



@Component({
  selector: 'app-tag-edit',
  templateUrl: './tag-edit.component.html',
  styleUrls: ['tag-edit.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class TagEditComponent implements OnInit, OnDestroy {

  private idSub!: Subscription;
  tag!: Tag;
  currentPlaylistId = '';
  
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
              private confirmationService: ConfirmationService) {                 
  }

  ngOnInit() {

    this.store.select(getCurrentTag)
      .subscribe(tag => {
        this.displayTag(tag);
      })

    this.store.select(getCurrentPlaylistId)
      .subscribe(playlistId => {
        this.currentPlaylistId = playlistId;
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
            this.store.dispatch(TagPageActions.setCurrentTag({ tagId: id }));
          } else {
            this.store.dispatch(TagPageActions.setCurrentTag({ tagId: 0 }));
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
    newTag.playlist_id = this.currentPlaylistId;

    this.store.dispatch(TagPageActions.createTag({ tag: newTag }));
    this.resetPage();
  }

  updateTag() {
    if (this.tagForm.valid){
      const updatedTag = {...this.tag, ...this.tagForm.value};
      this.store.dispatch(TagPageActions.updateTag({ tag: updatedTag }));
      
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
    this.store.dispatch(TagPageActions.deleteTag({ tagId: this.tag.id }));
    this.resetPage();
  }

  resetForm(){
    this.tagForm.reset();
  }

  resetPage(){
    this.resetForm();
    this.store.dispatch(TagPageActions.setCurrentTag({ tagId: 0 }));
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