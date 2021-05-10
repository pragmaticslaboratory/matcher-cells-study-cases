import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-rule',
  templateUrl: './add-rule.component.html',
  styleUrls: ['./add-rule.component.css']
})
export class AddRuleComponent implements OnInit {
  _nameRule: string = 'NewRule';
  _functionRule: string = `(cells, pattern) => {
      let status = cells.length === 0;
      return status ? [Cell(pattern, null)] : cells;
  }`;


  constructor(
    public dialogRef: MatDialogRef<AddRuleComponent>
  ) { }

  ngOnInit(): void {
  }

  confirmDialog(){
    this.dialogRef.close(
      {
        name: this._nameRule,
        js: this._functionRule
      }
    );
  }
}
