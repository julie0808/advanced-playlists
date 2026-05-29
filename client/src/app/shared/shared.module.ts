import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ErrorComponent } from './error/error/error.component';
import { PrimeNgModule } from './primeng.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule
  ],
  declarations: [
    ErrorComponent
  ],
  exports: [
    CommonModule, 
    PrimeNgModule, 
    ReactiveFormsModule,
    FormsModule,   
    ErrorComponent
  ]
})
export class SharedModule { }
