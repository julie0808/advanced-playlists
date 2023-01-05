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
  artists: ITag[]; 
  publishedBy: string; // original Channel name on which it was published
  status: string;
  //ytPlaylists: {name: string, id: string, dateAdded: string}[]; // in which lists the video is in. might have duplicates
}

// créer une instance par défaut de vidéo
export class IVideo {
  title = 'Video test'; 
  youtubeId = "12345678910";
  duration = ''; 
  thumbnailPath = '';
  dateModified = ''; 
  tags = [] as ITag[];
  rating = 0;
  artists = [] as ITag[];
  publishedBy = '';
  status = 'published';
}

export interface IVideoForm extends FormGroup<{
  artists: FormControl<ITag[]>;
  tags: FormControl<ITag[]>;
  rating: FormControl<number>;
}> {}