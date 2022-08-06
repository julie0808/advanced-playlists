import { FormControl, FormGroup } from "@angular/forms";

export interface ITag {
  id: number;
  title: string;
  status?: StatusCode;
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
}> {}