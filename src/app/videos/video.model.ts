import { Tag } from "../tags/tag-model";

export class Video {
  public title: string; 
  public youtubeId: string;
  public length: string; // should be valid time format
  //public thumbnailPath: string; // only if I go for custom thumbnail
  public dateModified: string; // for any change to tags and moods. should be a valid date format
  //public moods: {name: string, id: number, intensity: number, color: string}[];
  public tags: Tag[]; // example: Solo artist
  public artist: string; // original artist under what the song is published
  public ytPlaylists: {name: string, id: string, dateAdded: string}[];

  constructor(title: string, youtubeId: string, length: string, dateModified: string, tags: Tag[], artist: string, ytPlaylists: {name: string, id: string, dateAdded: string}[] ) { 
    this.title = title;
    this.youtubeId = youtubeId;
    this.length = length;
    this.dateModified = dateModified;
    this.tags = tags;
    this.artist = artist;
    this.ytPlaylists = ytPlaylists;
  }
}