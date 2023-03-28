import { FormControl, FormGroup } from "@angular/forms";

export interface ITag {
  id: number;
  title: string;
  color: string;
  description: string;
  parent_tag_id: number;
  lst_children_tag_id: ITag[];
  nb_associated_videos: number;
  status?: StatusCode;
}

export class ITag {
    id = 0;
    title = '';
    color = '#777777';
    description = '';
    lst_children_tag_id = [] as ITag[];
    parent_tag_id = 0;
    nb_associated_videos = 0;
}

// to handle CRUD operations
export enum StatusCode {
  unchanged,
  added,
  deleted,
  updated
}

export interface ITagForm extends FormGroup<{
  title: FormControl<string>;
  color: FormControl<string>;
  description: FormControl<string>;
  parent_tag_id: FormControl<number>;
}> {}