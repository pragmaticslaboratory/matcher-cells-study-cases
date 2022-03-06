import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { IUserTest } from '../../interfaces/IUserTest';

@Component({
  selector: 'app-menu-test',
  templateUrl: './menu-test.component.html',
  styleUrls: ['./menu-test.component.css']
})
export class MenuTestComponent implements OnInit {

  test: IUserTest = null;
  constructor(
    public dialogRef: MatDialogRef<MenuTestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.test = data;
  }

  ngOnInit(): void {
  }

  startTest(){
    this.dialogRef.close({ id: this.test.id, content: { ...this.test, started: true, completed: false, failed: false, initTime: new Date(), finalTime: null, icon: 'pending' } });
  }
  
  setComplete(){
    this.dialogRef.close({ id: -1, content: { ...this.test, started: false, completed: true, finalTime: new Date(), icon: 'beenhere' } });
  }
  
  setFailed(){
    this.dialogRef.close({ id: -1, content: { ...this.test, started: false, failed: true, finalTime: new Date(), icon: 'dangerous'} });
  }


}
