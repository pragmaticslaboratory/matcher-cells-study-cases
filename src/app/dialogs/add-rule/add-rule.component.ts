import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-rule',
  templateUrl: './add-rule.component.html',
  styleUrls: ['./add-rule.component.css']
})
export class AddRuleComponent implements OnInit {
  _nameRule: string = 'NewRule';
  _functionRule: string = `apply(cells: Cell[], pattern: Pattern): Cell[]{
        return cells;
  }`;

  _textfunc = 'this.b+this.c';
  constructor(
    public dialogRef: MatDialogRef<AddRuleComponent>
  ) { }

  ngOnInit(): void {
  }

  confirmDialog(){
    console.log(this.evalInContext(this._textfunc, {b: 10,c: 7}));
    
    // this.dialogRef.close();
  }


  evalInContext(js, context) {
    //# Return the results of the in-line anonymous function we .call with the passed context
    return function() { return eval(js); }.call(context);
}
}
