import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, Subject, of, empty } from 'rxjs';
import { catchError, concatMap, map, scan, tap, shareReplay, filter, switchMap } from 'rxjs/operators';

import { ITag } from './tag-model';
import { ErrorService } from '../shared/error/error/error-service';
import { StatusCode } from '../shared/global-model';
import { IPlaylist } from '../videos/playlist.model';

@Injectable({providedIn: 'root'})
export class TagService {

  apiRootURL: string = '/api/v1/tags';
  apiURL: string = '/api/v1';
  
  headers = new HttpHeaders()
    .set('content-Type', 'application/json');

  private playlistSelectedSubject = new BehaviorSubject<IPlaylist>(new IPlaylist());
  playlistSelectedAction$ = this.playlistSelectedSubject.asObservable();

  private tagModifiedSubject: Subject<ITag> = new Subject<ITag>();
  tagModifiedAction$: Observable<ITag> = this.tagModifiedSubject.asObservable();
  
  private tagSelectedSubject = new BehaviorSubject<number>(0);
  tagSelectedAction$ = this.tagSelectedSubject.asObservable();    

  playlists$: Observable<IPlaylist[]> = this.http.get<any>(this.apiURL + '/playlist')
    .pipe(
      map( playlists => {
        const finalPlaylistList: IPlaylist[] = playlists.map( (playlist: any) => {
          const playlistInfo: IPlaylist = {
            id: playlist.id,
            title: playlist.title
          };
          return playlistInfo;
        });
        return finalPlaylistList;
      }),
      catchError(err => this.errorService.handleError(err))
    );

  tagsFromDatabase$: Observable<ITag[]> = this.playlistSelectedAction$
    .pipe(
      switchMap( (playlistId: IPlaylist) => {
        return this.http.get<ITag[]>(this.apiRootURL, {
          params: {
            'playlist_id' : playlistId.id 
          }
        })
          .pipe(
            catchError(err => this.errorService.handleError(err))
          );
      })
    );




  // would need to be updated if videos datastream is modified
  // view playlistSelectedAction$ for implementation
  tagsAssociations$: Observable<any> = this.http.get<ITag[]>(this.apiRootURL + '/associations')
    .pipe(
      catchError(err => this.errorService.handleError(err))
    );

  tags$: Observable<ITag[]> = combineLatest([
    this.tagsFromDatabase$,
    this.tagsAssociations$
  ]).pipe(
    map( ([tags, associations]) => {
      const newTagArray = tags.map((tag: ITag) => {
        const associationArray = associations.filter((association: any) => {
          return association.tag_id === tag.id
        });
        tag.nb_associated_videos = associationArray.length;
        return tag;
      })
      return newTagArray;
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
      scan((tags: ITag[], tag: ITag) => {
        if (tag instanceof Array) {
          return [...tag];
        } else {
          return this.adjustTagList(tags, tag);
        }
      }),
      map((tags: ITag[]) => {
        const alphaSortedArray = tags.sort( (x: ITag, y: ITag) => {
          return x.title.localeCompare(y.title);
        });
        

        tags.map(tag => {
          if ( tag.parent_tag_id > 0 ) {
            const parentTag = tags.find(t => t.id === tag.parent_tag_id);
            if (typeof parentTag !== 'undefined') {
              tag.color = parentTag.color;
            }
          }
        });

        const tagsWithChildren = alphaSortedArray.map(tag => {
          tag.lst_children_tag_id = tags.filter(t => t.parent_tag_id === tag.id);
          return tag;
        });

        return tagsWithChildren;
      }),
      shareReplay(1),
      catchError(err => this.errorService.handleError(err))
    );

  tagsFormatedForGrouping$: Observable<ITag[]> = this.tagsModified$
    .pipe(
      map(tag => {
        const finalTagList: ITag[] = [];

        // standalone parents need to be put under "Other" 
        // tag group for multiselect from PrimeNg to work properly
        const otherTagGroup: ITag = new ITag();
        otherTagGroup.title = 'Other';   
        otherTagGroup.color = '#000000';     

        tag.map(t => {
          if ( t.lst_children_tag_id.length > 0 ){
            finalTagList.push(t); 
          } else if ( t.parent_tag_id === 0 || t.parent_tag_id === null) {
            otherTagGroup.lst_children_tag_id.push(t);
          }
        });

        finalTagList.push(otherTagGroup);

        return finalTagList;
      })
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

  sortAppByPlaylist(playlist: IPlaylist): void {
    this.playlistSelectedSubject.next(playlist);
  }

}