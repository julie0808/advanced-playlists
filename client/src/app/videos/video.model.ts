import { FormGroup, FormControl } from "@angular/forms";
import { ITag } from "../tags/tag-model";

export interface IVideo {
  title: string; 
  youtubeId: string;
  duration: string; // should be valid time format. // not included in "playlistItems" / snippet, view https://developers.google.com/youtube/v3/docs/videos/list
  thumbnailPath: string;
  dateModified: string; // for any change to tags. should be a valid date format. correspond to date it was modified by ME in this app
  tags: ITag[];
  rating: number;
  artist: string; // this might be handle differently with tags actually
  publishedBy: string; // original Channel name on which it was published
  //ytPlaylists: {name: string, id: string, dateAdded: string}[]; // in which lists the video is in. might have duplicates
}

// créer une instance par défaut de vidéo
export class IVideoClass {
  title: string = 'Video test'; 
  youtubeId: string = "12345678910";
  duration: string = ''; 
  thumbnailPath: string = '';
  dateModified: string = ''; 
  tags: ITag[]= [];
  rating: number = 1;
  artist: string = 'Unknown';
  publishedBy: string = '';
}

export interface IVideoForm extends FormGroup<{
  tags: FormControl<ITag[]>;
  rating: FormControl<number>;
}> {}