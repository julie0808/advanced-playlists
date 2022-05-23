import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, EMPTY, Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { ITag } from '../../../models/tag-model';
import { TagService } from '../tag-service';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-tag-edit',
  templateUrl: './tag-edit.component.html'
})
export class TagEditComponent implements OnInit, OnDestroy {

  editMode = false;
  apiRootURL: string = '/api/v1';

  private idSub!: Subscription;
  tagForm!: FormGroup;
  tag!: ITag;

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  selectedTag$ = this.tagService.selectedTag$
    .pipe(
      //tap(e => console.log(e, ' selected test')),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private tagService: TagService,
              private http: HttpClient) { 
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
          const id = +params['id'];
          this.getTag(id);
          this.editMode = id !== 0;
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

  getTag(id: number): void {
    this.tagService.selectedTagChanged(id);
  }

  onSubmit() {

    if (this.tagForm.valid){
      const newData = {...this.tag, ...this.tagForm.value};
      console.log(newData);
      this.tagService.modifyTag(newData)
        .subscribe({
          next: () => {
            this.resetForm();
            this.router.navigate(['/tags']);
          },
          error: err => this.errorMessageSubject.next(err)
        });
              
    }

    /*const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify(data);*/

    /*await this.http.put<ITag>(this.apiRootURL + '/tags', { tag: body }, { headers }).toPromise()
      .then((result) => {
        /*const objIndex = this.tags$.findIndex(obj => obj.id === this.id);
        const updatedObj = { ...this.tags$[objIndex], title: this.tagForm.value['title']};

        this.tags$ = [
          ...this.tags$.slice(0, objIndex),
          updatedObj,
          ...this.tags$.slice(objIndex + 1),
        ];*/

       /* this.router.navigate(['/tags']);
      }).catch( error => { console.log(error)});*/
 
  }

  resetForm(){
    this.tagForm.reset();
  }

  onAddTag() {
   
    const data: ITag = {
      title: this.tagForm.value['title'], 
      id: 0
    }

    this.tagService.modifyTag(data);

    //const headers = { 'content-type': 'application/json'};
    //const body = JSON.stringify(data);

    /*await this.http.post<ITag>(this.apiRootURL + '/tags', { tag: body }, { headers }).toPromise()
    .then((result) => {

      this.tags$.push({
        id: result.id,
        title: this.tagForm.value['tagTitle'], 
      });

      this.router.navigate(['/tags']);
      
    }).catch( error => { console.log(error)});*/

  }

  async onDeleteTag(tagObjectId: number) {

    const headers = { 'content-type': 'application/json'};

    await this.http.delete(this.apiRootURL + '/tags/' + tagObjectId, { headers }).toPromise()
    .then((result) => {
      /*const objIndex = this.tags$.findIndex(obj => obj.id === tagObjectId);
      this.tags$.splice(objIndex, 1);*/

      this.router.navigate(['/tags']);
      
    }).catch( error => { console.log(error)});

  }

  ngOnDestroy(): void {
    this.idSub.unsubscribe();
  }


}