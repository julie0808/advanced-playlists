import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { Video } from '../../models/video.model';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  apiKey: string = "AIzaSyD0d0tKqyP1G_lrNEEiGxEpfuIoRfDWVKs";

  constructor(public http: HttpClient) { }

  getVideosFromPlaylist(playlistId) { // change type for Observable<Video[]>

    let url = "https://youtube.googleapis.com/youtube/v3/playlistItems?";
    let urlParams = new HttpParams()
      .set('key', this.apiKey)
      .set('playlistId', playlistId)
      .set('maxResults', '20')
      .set('part', 'snippet');

    return this.http.get<Video[]>(url, {params: urlParams}) // change for get<Video[]>
      .pipe(
        //tap( videos => console.log(JSON.stringify(videos))),
        map( videos => 
          videos['items'].map(video => ({
            title: video.snippet.title,
            youtubeId: video.snippet.resourceId.videoId,
            length: 'durée', // not included in "snippet"
            dateModified: 'date', // date of change by ME
            tags: [],
            artist: 'Unknown', // not yet set, as to default to "publishedBy"
            publishedBy: video.snippet.videoOwnerChannelTitle
          } as Video ))
        ),
        catchError(this.handleError)
      )
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';

    if ( err.error instanceof ErrorEvent ) {
      // client-side error
      errorMessage = `An error occured: ${err.error.message}`;
    } else {
      // server-side error
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }

    console.error(errorMessage); // ideally, we would handle error by logging it in some way
    return throwError(errorMessage); 
  }
}
