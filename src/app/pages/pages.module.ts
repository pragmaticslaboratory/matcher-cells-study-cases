import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { ComponentsModule } from '../components/components.module';
import { ModelsModule } from '../models/models.module';



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
    FormsModule
  ]
})
export class PagesModule { }
