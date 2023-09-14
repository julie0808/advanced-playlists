import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, Subject, of, empty } from 'rxjs';
import { catchError, concatMap, map, scan, tap, shareReplay, filter, switchMap } from 'rxjs/operators';

import { ITag } from './tag.model';
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
          tag.lst_children_tag = tags.filter(t => t.parent_tag_id === tag.id);
          return tag;
        });

        return tagsWithChildren;
      }),
      shareReplay(1),
      catchError(err => this.errorService.handleError(err))
    );

    // still used in videoList. will come to disappear
  tagsFormatedForGrouping$: Observable<ITag[]> = this.tagsModified$;



  constructor(private http: HttpClient,
    private errorService: ErrorService) {}

  getTags(): Observable<ITag[]> {
    return this.playlistSelectedAction$
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
  }

  getPlaylists(): Observable<IPlaylist[]> {
    return this.http.get<any>(this.apiURL + '/playlist')
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
  }

  createTag(tag: ITag): Observable<ITag> {
    const body = JSON.stringify(tag);

    return this.http.post<ITag>(this.apiRootURL, body, { headers: this.headers })
      .pipe(
        map(tagReceived => {
          const updatedTag: ITag = { ...tag, ...tagReceived };
          return updatedTag;
        }),
        catchError(err => this.errorService.handleError(err))
      )
  }

  updateTag(tag: ITag): Observable<ITag> {
    const body = JSON.stringify(tag);

    return this.http.put<ITag>(this.apiRootURL, body, { headers: this.headers })
      .pipe(
        map(() => tag),
        catchError(err => this.errorService.handleError(err))
      )
  }

  deleteTag(id: number): Observable<number> {
    return this.http.delete<ITag>(`${this.apiRootURL}/${id}`, {headers: this.headers})
      .pipe(
        map(() => id),
        catchError(err => this.errorService.handleError(err))
      );
  }
    
  saveTagToBackend(tag: ITag): Observable<ITag> {
    if (tag.status === StatusCode.added) {
      return this.createTag(tag)
    }

    if (tag.status === StatusCode.deleted) {
      return this.deleteTag(tag.id).pipe(map(()=> tag));
    }

    if (tag.status === StatusCode.updated) {
      return this.updateTag(tag);
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

  sortAppByPlaylist(playlist: IPlaylist): void {
    this.playlistSelectedSubject.next(playlist);
  }

}