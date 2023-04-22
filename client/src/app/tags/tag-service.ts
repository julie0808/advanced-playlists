import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, Subject, of, empty } from 'rxjs';
import { catchError, concatMap, map, scan, tap, shareReplay, filter } from 'rxjs/operators';

import { ITag, StatusCode } from './tag-model';
import { ErrorService } from '../shared/error/error/error-service';

@Injectable({providedIn: 'root'})
export class TagService {

  apiRootURL: string = '/api/v1/tags';
  
  headers = new HttpHeaders()
    .set('content-Type', 'application/json');


  private tagModifiedSubject: Subject<ITag> = new Subject<ITag>();
  tagModifiedAction$: Observable<ITag> = this.tagModifiedSubject.asObservable();
  
  private tagSelectedSubject = new BehaviorSubject<number>(0);
  tagSelectedAction$ = this.tagSelectedSubject.asObservable();
    

  tagsFromDatabase$: Observable<ITag[]> = this.http.get<ITag[]>(this.apiRootURL)
    .pipe(
      catchError(err => this.errorService.handleError(err))
    );

  getTagsFromDatabase(): Observable<ITag[]> {
    return this.http.get<ITag[]>(this.apiRootURL)
      .pipe(
        catchError(err => this.errorService.handleError(err))
      );
  }

  // would need to be updated if videos datastream is modified
  // view playlistSelectedAction$ for implementation
  tagsAssociations$: Observable<any> = this.http.get<ITag[]>(this.apiRootURL + '/associations')
    .pipe(
      catchError(err => this.errorService.handleError(err))
    );

  getTagAssociations(): Observable<any> {
    return this.http.get<ITag[]>(this.apiRootURL + '/associations')
    .pipe(
      catchError(err => this.errorService.handleError(err))
    );
  }

  tags$: Observable<ITag[]> = combineLatest([
    this.tagsFromDatabase$,
    this.tagsAssociations$
  ]).pipe(
    map( ([tags, associations]) => {
      return tags.map(tag => {
        const associationArray = associations.filter((association: any) => association.tag_id === tag.id);
        tag.nb_associated_videos = associationArray.length;
        return tag;
      })
    })
  );

  tagsModified$: Observable<ITag[]> = merge(
    this.tags$,
    this.tagModifiedAction$
      .pipe(
        concatMap(tag => this.saveTagToBackend(tag)),
        catchError(err => this.errorService.handleError(err))
      ),
  )
    .pipe(
      // @ts-ignore - typescript a une haine pour "scan"
      scan((tags: ITag[], tag: ITag) => this.adjustTagList(tags, tag)),
      map((tags: ITag[]) => {
        const alphaSortedArray = tags.sort( (x: ITag, y: ITag) => {
          return x.title.localeCompare(y.title);
        });

        // mettre les tags sans parent (standalone) sous un parent fictif
        // contrainte technique pour que le dropdown de PrimeNg fonctionne correctement
        const otherTagGroup: ITag = new ITag();
        otherTagGroup.title = 'Other';   
        otherTagGroup.color = '#000000'; 
        tags.push(otherTagGroup);

        // associer la couleur du tag parent au tag enfant
        tags.map(tag => {
          if ( tag.parent_tag_id > 0 ) {
            const parentTag = tags.find(t => t.id === tag.parent_tag_id);
            if (typeof parentTag !== 'undefined') {
              tag.color = parentTag.color;
            }
          }
        });

        // associer les enfants aux parents
        const tagsWithChildren = alphaSortedArray.map(tag => {
          tag.lst_children_tag_id = tags.filter(t => t.parent_tag_id === tag.id);
          return tag;
        });        

        // retourner seulement les parents pour avoir la bonne hiérarchie
        const tagsFilteredForGrouping = tagsWithChildren.filter(t => t.lst_children_tag_id.length > 0);

        return tagsFilteredForGrouping;
      }),
      shareReplay(1),
      catchError(err => this.errorService.handleError(err))
    );
  
  validTagGroups$: Observable<ITag[]> = this.tagsModified$
  .pipe(
    map(tag => {
      return tag.filter(tag => tag.parent_tag_id === 0 || tag.parent_tag_id === null);
    })
  );

  selectedTag$ = combineLatest([
    this.tagsModified$,
    this.tagSelectedAction$
  ]).pipe(
    map( ([tags, selectedTagId]) => {
      if ( selectedTagId !== 0 ){
        const tagFound = tags.find( tag => tag.id === selectedTagId);
        
        if (tagFound !== undefined){
          return tagFound;
        } else {
          // this.errorService.handleError("Tag inexistant")
          // todo - handle error correctly. function is expecting a ITag...
          // but we should redirect to homepage with correct error message
          const emptyTag: ITag = new ITag();
          emptyTag.status = StatusCode.unchanged;
          return emptyTag;
        }
      } else {
        // todo instanciate ITag correctly...
        const emptyTag: ITag = new ITag();
        emptyTag.status = StatusCode.unchanged;
        return emptyTag;
      }     
    }),
    shareReplay(1)
  );



  constructor(private http: HttpClient,
    private errorService: ErrorService) {}
    
  saveTagToBackend(tag: ITag): Observable<ITag> {
    if (tag.status === StatusCode.added) {
      const body = JSON.stringify(tag);
      return this.http.post<ITag>(this.apiRootURL, body, { headers: this.headers })
        .pipe(
          map(tagReceived => {
            tag.id = tagReceived.id;
            return tag;
          }),
          catchError(err => this.errorService.handleError(err))
        )
    }
    if (tag.status === StatusCode.deleted) {
      return this.http.delete<ITag>(`${this.apiRootURL}/${tag.id}`, {headers: this.headers})
        .pipe(
          map(() => tag),
          catchError(err => this.errorService.handleError(err))
        );
    }
    if (tag.status === StatusCode.updated) {
      const body = JSON.stringify(tag);
      return this.http.put<ITag>(this.apiRootURL, body, { headers: this.headers })
        .pipe(
          map(() => tag),
          catchError(err => this.errorService.handleError(err))
        )
    }
    // fallback, return received tag
    return of(tag);
  }

  adjustTagList(tags: ITag[], tag: ITag): ITag[] {
    if (tag.status === StatusCode.added) {
      return [
        ...tags,
        { ...tag, status: StatusCode.unchanged }
      ];
    }
    if (tag.status === StatusCode.deleted) {
      return tags.filter(t => t.id !== tag.id);
    }
    if (tag.status === StatusCode.updated) {
      return tags.map(t => t.id === tag.id ?
        { ...tag, status: StatusCode.unchanged } : t);
    }
    // fallback, return initial tag list
    return tags;
  }
  
  addTag(newTag: ITag): void {
    this.tagModifiedSubject.next(newTag);
  }

  updateTag(updatedTag: ITag): void {
    this.tagModifiedSubject.next(updatedTag);
  }

  selectedTagChanged(selectedTagId: number): void {
    this.tagSelectedSubject.next(selectedTagId);
  }

}