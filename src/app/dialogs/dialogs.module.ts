import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerateInputComponent } from './generate-input/generate-input.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { AddRuleComponent } from './add-rule/add-rule.component';
import {MatSelectModule} from '@angular/material/select';
import { InfoPageComponent } from './info-page/info-page.component';


@NgModule({
  declarations: [GenerateInputComponent, AddRuleComponent, InfoPageComponent],
  exports: [
    GenerateInputComponent,
    AddRuleComponent,
    InfoPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class DialogsModule { }
