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

  onNewTag() {
    this.router.navigate(['new'], {relativeTo: this.route})
  }


}
