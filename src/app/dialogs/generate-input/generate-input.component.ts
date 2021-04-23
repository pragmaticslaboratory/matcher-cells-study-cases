import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-generate-input',
  templateUrl: './generate-input.component.html',
  styleUrls: ['./generate-input.component.css']
})
export class GenerateInputComponent implements OnInit {

  _input: string = '';
  _length: number = 1;
  constructor(
    public dialogRef: MatDialogRef<GenerateInputComponent>
    ) { }

  ngOnInit(): void {
  }

  validateForm(){
    return this._length && this._input && this._input.length > 0 && this._length > 0;
  }

  cancelDialog(): void {
    this.dialogRef.close();
  }

  confirmDialog(){
    let chars = this._input.split(',');
    let finalString = '';
    for (let index = 0; index < this._length; index++) {
      const element = chars[this.randomInt(chars.length-1)];
      finalString += element;
    }
    this.dialogRef.close(finalString);
  }

  randomInt(max) { 
    return Math.floor(Math.random()*(max + 1));
  }
}
