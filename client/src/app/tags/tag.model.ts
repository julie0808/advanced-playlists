import { FormControl, FormGroup } from "@angular/forms";

export interface Tag {
  id: number;
  title: string;
  color: string;
  description: string;
  parent_tag_id: number;
  lst_children_tag: Tag[] | null;
  nb_associated_videos: number;
  playlist_id: string;
}

export class Tag {
    id = 0;
    title = '';
    color = '#777777';
    description = '';
    lst_children_tag = [] as Tag[] | null;
    parent_tag_id = 0;
    nb_associated_videos = 0;
    playlist_id = '';
}

export interface TagForm extends FormGroup<{
  title: FormControl<string>;
  color: FormControl<string>;
  description: FormControl<string>;
  parent_tag_id: FormControl<number>;
}> {}