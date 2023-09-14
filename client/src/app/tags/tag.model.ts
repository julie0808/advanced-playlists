import { FormControl, FormGroup } from "@angular/forms";
import { StatusCode } from "../shared/global-model";

export interface ITag {
  id: number;
  title: string;
  color: string;
  description: string;
  parent_tag_id: number;
  lst_children_tag: ITag[] | null;
  nb_associated_videos: number;
  playlist_id: string;
  status?: StatusCode;
}

export class ITag {
    id = 0;
    title = '';
    color = '#777777';
    description = '';
    lst_children_tag = [] as ITag[] | null;
    parent_tag_id = 0;
    nb_associated_videos = 0;
    playlist_id = '';
}

export interface ITagForm extends FormGroup<{
  title: FormControl<string>;
  color: FormControl<string>;
  description: FormControl<string>;
  parent_tag_id: FormControl<number>;
}> {}