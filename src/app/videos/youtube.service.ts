import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  apiKey : string = "AIzaSyD0d0tKqyP1G_lrNEEiGxEpfuIoRfDWVKs";

  constructor(public http: HttpClient) { }

  getVideoFromPlaylist(playlistId): Observable<Object> {
    let url = "https://youtube.googleapis.com/youtube/v3/playlistItems?playlistId=" + playlistId + '&key=' + this.apiKey + '&maxResults=20&part=snippet';
    let urlParams = new HttpParams();

    urlParams.append('key', this.apiKey);
    urlParams.append('id', playlistId);

    return this.http
      .get(
        url,
        {
          params: urlParams // todo - bug - this is not working
        }
      )
      .pipe(map((res) => {
        return res;
      }))
  }
}
