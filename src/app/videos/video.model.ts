/* standard structure
export class Ingredient {
  public name: string;
  public amount: number;

  constructor(name: string, amount: number) {
    this.name = name;
    this.amount = amount
  }
}*/ /* todo delete after completion */

/* typescript shortcut */
export class Video {
  constructor(
    public title: string, 
    public youtubeId: string,
    public length: string, // should be valid time format
    //public thumbnailPath: string, // only if I go for custom thumbnail
    public dateModified: string, // for any change to tags and moods. should be a valid date format
    public moods: {name: string, id: number, intensity: number, color: string}[],
    public tags: {name: string, id: number, groupName: string, groupId: number}[], // example: Solo artist
    public artist: string, // original artist under what the song is published
    public ytPlaylists: { name: string, id: number, dateAdded: string}[],
    public isNew: boolean
  ) { }
}