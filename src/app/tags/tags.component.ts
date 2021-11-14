import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html'
})
export class TagsComponent implements OnInit {
  loading = false;

  constructor(private router: Router,
              private route: ActivatedRoute) { 
  }

  ngOnInit() {
  
  }

  onNewTag() {
    this.router.navigate(['new'], {relativeTo: this.route})
  }


}
