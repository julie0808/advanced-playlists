import { NgModule } from '@angular/core';

import { ColorPickerModule } from 'primeng/colorpicker';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { RatingModule } from 'primeng/rating';

@NgModule({
  exports: [
    ColorPickerModule,
    DropdownModule,
    InputTextModule,
    MultiSelectModule,
    RatingModule
  ]
})

export class PrimeNgModule {}