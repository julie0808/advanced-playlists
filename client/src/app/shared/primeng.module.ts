import { NgModule } from '@angular/core';

import { ColorPickerModule } from 'primeng/colorpicker';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { RatingModule } from 'primeng/rating';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { ConfirmationService, MessageService } from 'primeng/api';

@NgModule({
  exports: [
    ColorPickerModule,
    DropdownModule,
    InputTextModule,
    MultiSelectModule,
    RatingModule,
    ScrollPanelModule,
    CheckboxModule,
    AccordionModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [
    ConfirmationService,
    MessageService
  ]
})

export class PrimeNgModule {}