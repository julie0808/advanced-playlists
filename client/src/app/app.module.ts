import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VideosComponent } from './videos/videos.component';
import { VideoListComponent } from './videos/video-list/video-list.component';
import { VideoPlayerComponent } from './videos/video-player/video-player.component';
import { TagsComponent } from './tags/tags.component';
import { HeaderComponent } from './header/header.component';
import { FiltersComponent } from './filters/filters.component';
import { TagListComponent } from './tags/tag-list/tag-list.component';
import { TagEditComponent } from './tags/tag-edit/tag-edit.component';

import { VideoTagEditComponent } from './videos/video-tag-edit/video-tag-edit.component';
import { ErrorComponent } from './shared/error/error/error.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';


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
    VideoTagEditComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
