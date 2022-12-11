import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ErrorComponent } from './error/error/error.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PrimeNgModule } from './primeng.module';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ErrorComponent
  ],
  exports: [
    CommonModule, 
    NgMultiSelectDropDownModule,  
    PrimeNgModule, 
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
