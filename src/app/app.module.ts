import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { Parse } from "parse";

import { ReactiveFormsModule } from '@angular/forms';

import { VideosComponent } from './videos/videos.component';
import { VideoListComponent } from './videos/video-list/video-list.component';
import { VideoPlayerComponent } from './videos/video-player/video-player.component';
import { TagsComponent } from './tags/tags.component';
import { HeaderComponent } from './header/header.component';
import { FiltersComponent } from './filters/filters.component';
import { TagListComponent } from './tags/tag-list/tag-list.component';
import { TagEditComponent } from './tags/tag-edit/tag-edit.component';

import { TagService } from './tags/tag-service';
import { VideoTagComponent } from './videos/video-tag/video-tag.component';

Parse.initialize(environment.PARSE_APP_ID, environment.PARSE_JS_KEY);
Parse.serverURL = environment.serverURL;

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
    TagEditComponent,
    VideoTagComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
