import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { ComponentsModule } from '../components/components.module';
import { ModelsModule } from '../models/models.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {DragDropModule} from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    HomeComponent, 
    PagesComponent,
    HomeComponent
  ],
  exports: [
    PagesComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    ModelsModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    DragDropModule
  ]
})
export class PagesModule { }
