import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IUserTest } from '../../interfaces/IUserTest';
import { IUserTestSumary } from '../../interfaces/IUserTestSummary';
import { EStatusUserTestSummary } from '../../enums/EStatusUserTestSummary';

@Component({
  selector: 'app-summary-tests',
  templateUrl: './summary-tests.component.html',
  styleUrls: ['./summary-tests.component.css']
})
export class SummaryTestsComponent implements OnInit {
  public readonly EVALUATION_FORM_LINK = 'https://docs.google.com/forms/d/e/1FAIpQLSdvuYk4w-84rlmJg8ULssTi07mIQSNgCSi8_nhNLIrMVw4H0A/viewform';
  testsInformation: IUserTestSumary[] = [];
  constructor(
    public dialogRef: MatDialogRef<SummaryTestsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.testsInformation = data;
    this.testsInformation = this.testsInformation.map((test) => {
      let totalTime: number = -1;
      let status: EStatusUserTestSummary = EStatusUserTestSummary.Incompleto;
      if(test.finalTime){
        totalTime = (test.finalTime.getTime() - test.initTime.getTime()) / 1000;
        status = test.failed ? EStatusUserTestSummary.Fallido : EStatusUserTestSummary.Completado;
      }
      return {...test, totalTime, status};
    });
  }

  ngOnInit(): void {
  }

}
