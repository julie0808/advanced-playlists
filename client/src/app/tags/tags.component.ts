import { Component } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html'
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
