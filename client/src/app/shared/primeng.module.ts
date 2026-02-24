import { NgModule } from '@angular/core';

import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { RatingModule } from 'primeng/rating';
import { ScrollerModule } from 'primeng/scroller';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';

import { ConfirmationService, MessageService } from 'primeng/api';

@NgModule({
  imports: [
    ContextMenuModule
  ],
  exports: [
    AccordionModule,
    CheckboxModule,
    ColorPickerModule,
    ConfirmDialogModule,
    ContextMenuModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    MultiSelectModule,
    RatingModule,
    ScrollerModule,
    ScrollPanelModule,    
    ToastModule
  ],
  providers: [
    ConfirmationService,
    MessageService
  ]
})

export class PrimeNgModule {}