import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";

import { Tag } from "./tag-model";
import { TagService } from "./tag-service";

@Injectable({providedIn: 'root'})
export class TagsResolverService implements Resolve<Tag[]> {
  
  constructor(private tagService: TagService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const tags = this.tagService.getTags();

    if ( tags.length === 0 ) {
      return this.tagService.fetchTagList();
    } else {
      return tags;
    }

  }
}