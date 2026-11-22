import { FormGroup, FormControl } from "@angular/forms";
import { Tag } from "../tags/tag.model";
import { Playlist } from "../playlists/playlist.model";



export interface Video {
  title: string; 
  youtubeId: string;
  uniqueYoutubeId: string; // identifiant unique d'un item dans une playlist
  duration: string; // formatted video length; fetched from videos.list contentDetails
  note: string;
  thumbnailPath: string;
  dateModified: string; // for any change to tags. should be a valid date format. correspond to date it was modified by ME in this app
  tags: Tag[];
  rating: VideoRating;
  needsReview: boolean;
  artists: Tag[]; 
  publishedBy: string; // original Channel name on which it was published
  datePublished: Date; // date the video was uploaded to youtube
  youtubeStatus: string;
  customPlaylists: Playlist[];
  //ytPlaylists: {name: string, id: string, dateAdded: string}[]; // in which lists the video is in. might have duplicates
}

// créer une instance par défaut de vidéo
export class Video {
  title = 'Video test'; 
  youtubeId = '12345678910';
  uniqueYoutubeId = '';
  duration = ''; 
  note = '';
  thumbnailPath = '';
  dateModified = ''; 
  tags = [] as Tag[];
  rating = VideoRatings[0];
  needsReview = true;
  artists = [] as Tag[];
  publishedBy = '';
  datePublished = new Date();
  youtubeStatus = 'published';
  customPlaylists = [] as Playlist[];
}

export interface VideoForm extends FormGroup<{
  artists: FormControl<Tag[]>;
  tags: FormControl<Tag[]>;
  rating: FormControl<number>;
  needsReview: FormControl<boolean>;
  customPlaylists: FormControl<Playlist[]>;
  note: FormControl<string>;
}> {}
 
export enum VideoPlayerFormats {
  tiny = 'tiny',
  medium = 'medium',
  minimized = 'minimized',
  fullscreen = 'fullscreen',
  hidden = 'hidden'
}

export interface VideoRating {
  ratingValue: number;
  description: string; 
}

export const VideoRatings: VideoRating[] = [
  { ratingValue: 0, description: "Not rated yet" },
  { ratingValue: 1, description: "It exists" },
  { ratingValue: 2, description: "Repeat worthy" },
  { ratingValue: 3, description: "Unskippable" }
]