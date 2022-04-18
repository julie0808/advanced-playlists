import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, EMPTY, Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Tag } from '../../../models/tag-model';
import { TagService } from '../tag-service';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-tag-edit',
  templateUrl: './tag-edit.component.html'
})
export class TagEditComponent implements OnInit {

  editMode = false;
  apiRootURL: string = '/api/v1';

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  //tagList$ = this.tagService.getTags();

  tag$ = this.tagService.selectedTag$
    .pipe(
      //tap(e => console.log(e, ' selected test')),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )

  tagTitle$ = this.tag$
    .pipe(
      map(t => t ? t.title : ''),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )

  tagForm: FormGroup = new FormGroup({
    'tagTitle': new FormControl('this is to be dynamic', [Validators.required])
  });

  constructor(private route: ActivatedRoute,
              private router: Router,
              private tagService: TagService,
              private http: HttpClient) { 
  }

  ngOnInit() {
    
    this.route.params 
      .subscribe(
        (params: Params) => {
          this.tagService.selectedTagChanged(+params['id']);
          this.editMode = params['id'] != null;
        }
      )
  }

  async onSubmit() {

    const data: Tag = {
      title: this.tagForm.value['tagTitle'], 
      //id: this.tagSelectedSubject.getValue()
      id: 0 // to fix
    }

    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify(data);

    await this.http.put<Tag>(this.apiRootURL + '/tags', { tag: body }, { headers }).toPromise()
      .then((result) => {
        /*const objIndex = this.tagList$.findIndex(obj => obj.id === this.id);
        const updatedObj = { ...this.tagList$[objIndex], title: this.tagForm.value['tagTitle']};

        this.tagList$ = [
          ...this.tagList$.slice(0, objIndex),
          updatedObj,
          ...this.tagList$.slice(objIndex + 1),
        ];*/

        this.router.navigate(['/tags']);
      }).catch( error => { console.log(error)});
 
  }

  async onAddTag() {

    const data: Tag = {
      title: this.tagForm.value['tagTitle'], 
      id: 0
    }

    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify(data);

    await this.http.post<Tag>(this.apiRootURL + '/tags', { tag: body }, { headers }).toPromise()
    .then((result) => {

      /*this.tagList$.push({
        id: result.id,
        title: this.tagForm.value['tagTitle'], 
      });*/

      this.router.navigate(['/tags']);
      
    }).catch( error => { console.log(error)});

  }

  async onDeleteTag(tagObjectId: number) {

    const headers = { 'content-type': 'application/json'};

    await this.http.delete(this.apiRootURL + '/tags/' + tagObjectId, { headers }).toPromise()
    .then((result) => {
      /*const objIndex = this.tagList$.findIndex(obj => obj.id === tagObjectId);
      this.tagList$.splice(objIndex, 1);*/

      this.router.navigate(['/tags']);
      
    }).catch( error => { console.log(error)});

  }


}