import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, Subject, of, empty } from 'rxjs';
import { catchError, concatMap, map, scan, tap, shareReplay, filter, switchMap } from 'rxjs/operators';

import { Tag } from './tag.model';
import { ErrorService } from '../shared/error/error/error-service';
import { StatusCode } from '../shared/global-model';
import { IPlaylist } from '../videos/playlist.model';

@Injectable({providedIn: 'root'})
export class TagService {

  apiRootURL: string = '/api/v1/tags';
  apiURL: string = '/api/v1';

  playlistHardcoded = 'PLwgftAdEcD4rXHmDdFTFI8Hch3BfWBQIt';
  
  headers = new HttpHeaders()
    .set('content-Type', 'application/json');

  private playlistSelectedSubject = new BehaviorSubject<IPlaylist>(new IPlaylist());
  playlistSelectedAction$ = this.playlistSelectedSubject.asObservable();

  
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


  constructor(private http: HttpClient,
    private errorService: ErrorService) {}

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.apiRootURL, {
      params: {
        'playlist_id' : this.playlistHardcoded 
      }
    })
      .pipe(
        catchError(err => this.errorService.handleError(err))
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

  createTag(tag: Tag): Observable<Tag> {
    const body = JSON.stringify(tag);

    return this.http.post<Tag>(this.apiRootURL, body, { headers: this.headers })
      .pipe(
        map(tagReceived => {
          const updatedTag: Tag = { ...tag, ...tagReceived };
          return updatedTag;
        }),
        catchError(err => this.errorService.handleError(err))
      )
  }

  updateTag(tag: Tag): Observable<Tag> {
    const body = JSON.stringify(tag);

    return this.http.put<Tag>(this.apiRootURL, body, { headers: this.headers })
      .pipe(
        map(() => tag),
        catchError(err => this.errorService.handleError(err))
      )
  }

  deleteTag(id: number): Observable<number> {
    return this.http.delete<Tag>(`${this.apiRootURL}/${id}`, {headers: this.headers})
      .pipe(
        map(() => id),
        catchError(err => this.errorService.handleError(err))
      );
  }
 
  sortAppByPlaylist(playlist: IPlaylist): void {
    this.playlistSelectedSubject.next(playlist);
  }

}