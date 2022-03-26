import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Parse } from 'parse';
import { Subscription } from 'rxjs';

import { Tag } from '../../../models/tag-model';
import { TagService } from '../tag-service';

@Component({
  selector: 'app-tag-edit',
  templateUrl: './tag-edit.component.html'
})
export class TagEditComponent implements OnInit {
  id: string;
  tagForm: FormGroup;
  TagParse = Parse.Object.extend("Tag");
  tagList: Tag[];
  tagListSub: Subscription;
  isFetching = false;
  editMode = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private tagService: TagService) { 
  }

  ngOnInit() {
    this.tagListSub = this.tagService.tagsChanged
      .subscribe(
        (tags: Tag[]) => {
          this.tagList = tags;
        }
      );
    this.tagList = this.tagService.getTags();
    
    this.route.params 
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      )
  }

  private initForm() {
    let tagName = '';

    if (this.editMode) {
      tagName = this.tagList.find( tag => tag.id === this.id).title;
    }

    this.tagForm = new FormGroup({
      'tagName': new FormControl(tagName, Validators.required),
    });
  }

  onSubmit() {
    this.isFetching = true;

    let fetchTag = new Parse.Query(this.TagParse);
    fetchTag.equalTo("objectId", this.id);

    fetchTag
      .first()
      .then( receivedTag => {
        if (receivedTag) {
          receivedTag.set('name', this.tagForm.value['tagName']);
          receivedTag.save()
          .then( tags => {             
            const objIndex = this.tagList.findIndex(obj => obj.id === this.id);
            const updatedObj = { ...this.tagList[objIndex], name: this.tagForm.value['tagName']};
            
            this.tagList = [
              ...this.tagList.slice(0, objIndex),
              updatedObj,
              ...this.tagList.slice(objIndex + 1),
            ];
        
            this.tagService.updateTag(this.tagList);
            this.router.navigate(['/tags']);
          })
          .catch( error => {
            console.log('Error: ' + error.message);
          });
        this.isFetching = false;
        } else {
          console.log('There was no tag matching the criteria.');
          this.isFetching = false;
        }
      })
      .catch( error => {
        console.log('There was an unexpected error after fetching: ' + error.message);
        this.isFetching = false;
      });
  }

  onAddTag() {
    let newTag = new this.TagParse();
    newTag.set("title", this.tagForm.value['tagName']);
    
    newTag
      .save()
      .then( tags => {         

        this.tagList.push({
          id: tags.id,
          title: this.tagForm.value['tagName'], 
        });

        this.tagService.updateTag(this.tagList);
        this.router.navigate(['/tags']);

      }).catch( error => {
        console.log('Error: ' + error.message);
      }); 
  }

  onDeleteTag(tagObjectId) {
    console.log(tagObjectId);

    let fetchTag = new Parse.Query(this.TagParse);
    fetchTag.equalTo("objectId", this.id);

    fetchTag
      .first()
      .then( receivedTag => {
        if (receivedTag) {
          receivedTag.destroy().then( () => {
            const objIndex = this.tagList.findIndex(obj => obj.id === this.id);
            this.tagList.splice(objIndex, 1);

            this.tagService.updateTag(this.tagList);
            this.router.navigate(['/tags']);
          }).catch(function(response, error) {
            console.log('Error: '+ error.message);
          });
        } else {
          console.log('There was no tag matching the criteria.');
        }
      })
      .catch( error => {
        console.log('There was an unexpected error after fetching: ' + error.message);
      });

  }


}