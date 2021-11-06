import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html'
})
export class TagListComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router) { 
  }

  ngOnInit() {

  }

  onEdit() {
    this.router.navigate([1, 'edit'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

}
