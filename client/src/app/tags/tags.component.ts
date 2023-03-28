import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['tags.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class TagsComponent {
  loading = false;

  constructor(private router: Router,
              private route: ActivatedRoute) { 
  }

  addNewTag() {
    this.router.navigate([0, 'edit'], {relativeTo: this.route})
  }

}
