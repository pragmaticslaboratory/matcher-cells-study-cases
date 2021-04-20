import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerateInputComponent } from './generate-input/generate-input.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [GenerateInputComponent],
  exports: [
    GenerateInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class DialogsModule { }
