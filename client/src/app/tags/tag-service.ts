import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, Subject, throwError, of } from 'rxjs';
import { catchError, concatMap, mergeMap, map, scan, shareReplay, tap, toArray } from 'rxjs/operators';


import { ITag } from '../../models/tag-model';

interface myInterface {
  id: number,
  title: string
}

@Injectable({providedIn: 'root'})
export class TagService {

  tagsChanged = new Subject<ITag[]>();
  apiRootURL: string = '/api/v1/tags';
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  private tagList: ITag[] = [];

  constructor(private http: HttpClient) {}

  tags$: Observable<ITag[]> = this.http.get<ITag[]>(this.apiRootURL)
    .pipe(
      shareReplay(1),
      catchError(this.handleError)
    );


  private tagModifiedSubject: Subject<ITag> = new Subject<ITag>();
  tagModifiedAction$: Observable<ITag> = this.tagModifiedSubject.asObservable();

  tagsModified$ = merge(
    this.tags$,
    this.tagModifiedAction$
  )
    .pipe(
      
      // @ts-ignore
      //scan((acc: ITag[], value: ITag) => [...acc, value]), // if tag ADDED

      scan((tags: ITag[], tag: ITag) => {
        // spécifique pour action UPDATE
        
        return tags.map( (t: ITag)=> {
          return t.id === tag.id ? { ...tag } : t as ITag;
        }) as ITag[];
      }),

      //scan((products: Product[], product: Product) => this.modifyProducts(products, product)),
      /*scan((acc: ITag[], value: ITag) => {
        return acc.map(t => t.id === value.id ? {...value} : t); // if modified
        //return [...acc, value] as ITag[];  ----if was added
      }),*/
      shareReplay(1),
      catchError(this.handleError)
    );

  modifyTag(tag: ITag): Observable<ITag> {
    const body = JSON.stringify(tag);

    return this.http.put<ITag>(this.apiRootURL, body, { headers: this.headers })
      .pipe(
        //tap(tag => console.log('Modified tag: ', JSON.stringify(tag))),
        map(() => {
          this.tagModifiedSubject.next(tag);
          return tag;
        }),
        catchError(this.handleError)
      );
  }


  async addNewTag({id, title}: ITag) {
    const data: ITag = {
      id, // will be 0 because we won't use it anyway for insertion
      title
    }
    const body = JSON.stringify(data);

    return await this.http.post<ITag>(this.apiRootURL + '/add-tag', { body }, { headers: this.headers }).toPromise()
      .then((result) => {
          return result;
      });
  }



  private tagSelectedSubject = new BehaviorSubject<number>(0);
  tagSelectedAction$ = this.tagSelectedSubject.asObservable();

  selectedTag$ = combineLatest([
    this.tagsModified$,
    this.tagSelectedAction$
  ]).pipe(
    //tap(data => console.log('combine/selected : ' + JSON.stringify(data))),
    map( ([tags, selectedTagId]) => {
      const tagFound = tags.find( tag => tag.id === selectedTagId);
      
      if (tagFound !== undefined){
        return tagFound;
      }
      return this.initializeTag();
    }),
    shareReplay(1)
  );

  selectedTagChanged(selectedTagId: number): void {
    this.tagSelectedSubject.next(selectedTagId); // emit to the subject the selectedProductId
  }

  initializeTag(): ITag{
    return {
      id: 0, 
      title: ''
    }
  }



  getTags() {
    return this.tagList.slice();
  }

  getTag(tagId: number){

    return this.tagList.find( tag => {
      if ( tag.id === tagId ){
        return tag;
      }
    });

  }

  private handleError(err: any): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}