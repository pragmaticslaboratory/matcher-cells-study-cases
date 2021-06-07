import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.css']
})
export class InfoPageComponent implements OnInit {

  title: string = 'Information';
  constructor(
    public dialogRef: MatDialogRef<InfoPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if(data.title){
      this.title = data.title;
    }
  }

  ngOnInit(): void {
  }

}
