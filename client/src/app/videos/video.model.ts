import { FormGroup, FormControl } from "@angular/forms";
import { Tag } from "../tags/tag.model";

export interface Video {
  title: string; 
  youtubeId: string;
  uniqueYoutubeId: string; // identifiant unique d'un item dans une playlist
  duration: string; // should be valid time format. // not included in "playlistItems" / snippet, view https://developers.google.com/youtube/v3/docs/videos/list
  thumbnailPath: string;
  dateModified: string; // for any change to tags. should be a valid date format. correspond to date it was modified by ME in this app
  tags: Tag[];
  rating: number;
  artists: Tag[]; 
  publishedBy: string; // original Channel name on which it was published
  youtubeStatus: string;
  //ytPlaylists: {name: string, id: string, dateAdded: string}[]; // in which lists the video is in. might have duplicates
}

// créer une instance par défaut de vidéo
export class Video {
  title = 'Video test'; 
  youtubeId = '12345678910';
  uniqueYoutubeId = '';
  duration = ''; 
  thumbnailPath = '';
  dateModified = ''; 
  tags = [] as Tag[];
  rating = 0;
  artists = [] as Tag[];
  publishedBy = '';
  youtubeStatus = 'published';
}

export interface VideoForm extends FormGroup<{
  artists: FormControl<Tag[]>;
  tags: FormControl<Tag[]>;
  rating: FormControl<number>;
}> {}
 
export enum VideoPlayerFormats {
  tiny = 'tiny',
  medium = 'medium',
  minimized = 'minimized',
  fullscreen = 'fullscreen',
  hidden = 'hidden'
}


export interface VideoRating {
  rating: number;
  description: string; 
}

export const VideoRatings: VideoRating[] = [
  { rating: 1, description: "It exists" },
  { rating: 2, description: "Repeat worthy" },
  { rating: 3, description: "Unskippable" }
]