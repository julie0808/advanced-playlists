import { FormGroup, FormControl } from "@angular/forms";
import { ITag } from "../tags/tag-model";

export interface IVideo {
  title: string; 
  youtubeId: string;
  length: string; // should be valid time format
  //thumbnailPath: string; // only if I go for custom thumbnail
  dateModified: string; // for any change to tags and moods. should be a valid date format
  //moods: {name: string, id: number, intensity: number, color: string}[];
  tags: ITag[];
  artist: string; // original artist under what the song is published (manageable by me. default is "publishedBy")
  publishedBy: string; // original Channel name on which it was published
  //ytPlaylists: {name: string, id: string, dateAdded: string}[]; // in which lists the video is in. might have duplicates
}

// créer une instance par défaut de vidéo
export class IVideoClass {
  title: string = 'Video test'; 
  youtubeId: string = "12345678910";
  length: string = ''; 
  dateModified: string = ''; 
  tags: ITag[]= [];
  artist: string = '';
  publishedBy: string = '';
}

export interface IVideoForm extends FormGroup<{
  tags: FormControl<ITag[]>;
}> {}