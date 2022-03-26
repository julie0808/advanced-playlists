import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

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
import { VideoTagEditComponent } from './videos/video-tag/video-tag-edit.component';


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
    VideoTagEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
