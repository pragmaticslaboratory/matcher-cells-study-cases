import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MetaInformation } from 'src/app/models/match-cells/metaInformationModel';
import { Symbol } from 'src/app/models/match-cells/patterns/symbol.model';
import { Cell } from '../../models/match-cells/cell.model';

@Component({
  selector: 'app-add-rule',
  templateUrl: './add-rule.component.html',
  styleUrls: ['./add-rule.component.css']
})
export class AddRuleComponent implements OnInit {
  _nameRule: string = 'NewRule';
  _functionRule: string = `(cells, pattern) => {
        return cells;
  }`;


  constructor(
    public dialogRef: MatDialogRef<AddRuleComponent>
  ) { }

  ngOnInit(): void {
  }

  test(){
    return 100;
  }

  confirmDialog(){
    window.eval(`function foo() {
      import { Symbol } from 'src/app/models/match-cells/patterns/symbol.model';
      const y = new Symbol('x');
      return y;
    }`);
    console.log(eval('foo()'));
    // this.dialogRef.close(
    //   {
    //     name: this._nameRule,
    //     js: this._functionRule
    //   }
    // );
  }
}
