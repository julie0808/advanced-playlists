export interface Playlist {
  id: string;
  title: string;
  isYoutube: boolean;
}

export class Playlist {
  id = 'none';
  title = 'invalid';
  isYoutube = false;
}