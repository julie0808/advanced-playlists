import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Tag } from './tag.model';
import { ErrorService } from '../shared/error/error/error-service';
import { Playlist } from '../shared/model/playlist.model';



@Injectable({providedIn: 'root'})
export class TagService {

  apiRootURL: string = '/api/v1/tags';
  apiURL: string = '/api/v1';
  
  headers = new HttpHeaders()
    .set('content-Type', 'application/json');

  constructor(private http: HttpClient,
    private errorService: ErrorService) {}

  getTags(playlistId: string): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.apiRootURL, {
      params: {
        'playlist_id' : playlistId 
      }
    })
      .pipe(
        catchError(err => this.errorService.handleError(err))
      );
  }

  getPlaylists(): Observable<Playlist[]> {
    return this.http.get<any>(this.apiURL + '/playlist')
    .pipe(
      map( playlists => {
        const finalPlaylistList: Playlist[] = playlists.map( (playlist: any) => {
          const playlistInfo: Playlist = {
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
 
}