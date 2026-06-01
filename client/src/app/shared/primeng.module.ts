import { NgModule } from '@angular/core';

import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { RatingModule } from 'primeng/rating';
import { ScrollerModule } from 'primeng/scroller';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';

import { ConfirmationService, MessageService } from 'primeng/api';

@NgModule({
  imports: [
    ContextMenuModule,
    AccordionModule,
    CheckboxModule,
    ColorPickerModule,
    ConfirmDialogModule,
    ContextMenuModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    MultiSelectModule,
    RatingModule,
    ScrollerModule,
    ScrollPanelModule,    
    SelectModule,
    ToastModule
  ],
  exports: [
    AccordionModule,
    CheckboxModule,
    ColorPickerModule,
    ConfirmDialogModule,
    ContextMenuModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    MultiSelectModule,
    RatingModule,
    ScrollerModule,
    ScrollPanelModule,  
    SelectModule,  
    ToastModule
  ],
  providers: [
    ConfirmationService,
    MessageService
  ]
})

export class PrimeNgModule {}