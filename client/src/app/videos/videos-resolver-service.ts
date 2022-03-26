/*import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";

import { VideoService } from "./video-service";
import { Video } from "./video.model";

@Injectable({providedIn: 'root'})
export class VideosResolverService implements Resolve<Video[]> {
  
  constructor(private videoService: VideoService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const videos = this.videoService.getVideos();
    return videos;

    if ( videos.length === 0 ) {
      const fetchVideoList = this.videoService.fetchVideoList();
      return fetchVideoList;
    } else {
      return videos;
    }

  }
}*/