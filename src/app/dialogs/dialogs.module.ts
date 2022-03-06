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
import { AddEvolutionComponent } from './add-evolution/add-evolution.component';
import { MenuTestComponent } from './menu-test/menu-test.component';
import { SummaryTestsComponent } from './summary-tests/summary-tests.component';


@NgModule({
  declarations: [GenerateInputComponent, AddRuleComponent, InfoPageComponent, AddEvolutionComponent, MenuTestComponent, SummaryTestsComponent],
  exports: [
    GenerateInputComponent,
    AddRuleComponent,
    InfoPageComponent,
    AddEvolutionComponent,
    MenuTestComponent,
    SummaryTestsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ]
})
export class DialogsModule { }
