import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideosComponent } from './videos/videos.component';
import { VideoListComponent } from './videos/video-list/video-list.component';
import { VideoPlayerComponent } from './videos/video-player/video-player.component';
import { TagsComponent } from './tags/tags.component';
import { HeaderComponent } from './header/header.component';
import { FiltersComponent } from './filters/filters.component';
import { TagListComponent } from './tags/tag-list/tag-list.component';
import { TagEditComponent } from './tags/tag-edit/tag-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    VideosComponent,
    VideoListComponent,
    VideoPlayerComponent,
    TagsComponent,
    HeaderComponent,
    FiltersComponent,
    TagListComponent,
    TagEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
