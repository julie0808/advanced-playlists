import { NgModule } from '@angular/core';

import { ColorPickerModule } from 'primeng/colorpicker';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { RatingModule } from 'primeng/rating';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  exports: [
    ColorPickerModule,
    DropdownModule,
    InputTextModule,
    MultiSelectModule,
    RatingModule,
    ScrollPanelModule,
    CheckboxModule
  ]
})

export class PrimeNgModule {}