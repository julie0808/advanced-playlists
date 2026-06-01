import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from "@angular/router";

import { TagListComponent } from './tag-list/tag-list.component';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [RouterModule, TagListComponent],
  templateUrl: './tags.component.html',
  styleUrls: ['tags.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class TagsComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute) { 
  }

  addNewTag() {
    this.router.navigate([0, 'edit'], {relativeTo: this.route})
  }

}
