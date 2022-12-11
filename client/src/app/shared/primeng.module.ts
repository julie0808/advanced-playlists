import { NgModule } from '@angular/core';

import {ColorPickerModule} from 'primeng/colorpicker';
import {DropdownModule} from 'primeng/dropdown';

@NgModule({
  exports: [
    ColorPickerModule,
    DropdownModule
  ]
})

export class PrimeNgModule {}