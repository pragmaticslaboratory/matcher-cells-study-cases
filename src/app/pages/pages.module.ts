import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { DialogsModule } from '../dialogs/dialogs.module';


import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { ComponentsModule } from '../components/components.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatDialogModule} from '@angular/material/dialog';
import { OfflineComponent } from './offline/offline.component';
import { TwitterComponent } from './twitter/twitter.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { TraceExecutionComponent } from './trace-execution/trace-execution.component';
import { UserEvaluationComponent } from './user-evaluation/user-evaluation.component';

@NgModule({
  declarations: [
    HomeComponent, 
    PagesComponent,
    HomeComponent,
    OfflineComponent,
    TwitterComponent,
    TraceExecutionComponent,
    UserEvaluationComponent,
  ],
  exports: [
    PagesComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    SharedModule,
    DialogsModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    MatListModule,
    MatCardModule,
    MatDialogModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    DragDropModule,
    NgxSpinnerModule
  ]
})
export class PagesModule { }
