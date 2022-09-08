import { Component, OnInit } from '@angular/core';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { serverTimestamp, Timestamp } from 'firebase/firestore';
import { reportData, reportModel } from './report-mock-data';

//convert to YYYY-MM-DD
// let test:Date = items[0].createdAt.toDate()
// console.log(test.toISOString().split('T')[0])


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  angularCsvExt(){
    //https://www.npmjs.com/package/angular-csv-ext
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'Your title',
      useBom: true,
      noDownload: false,
      headers: ["Date", "Name", "Email", "Donation Amount", "Organisation", "Item"],
      useHeader: false,
      nullToEmptyString: true,
    };

    interface csvModel{
      donationDate:string,
      name:string,
      email:string,
      donationAmount:number,
      organisation:string,
      item:string
  }

    let total:number = 0;

    const data:csvModel[] = reportData.map((item:reportModel) => {
      const newItem:csvModel = {
        donationDate: new Date(item.donationDate).toISOString().split('T')[0],
        name:item.name,
        email:item.email,
        donationAmount:item.donationAmount,
        organisation:item.organisation,
        item:item.item
      }
      total += item.donationAmount;
      return newItem;
    })
    new AngularCsv([...data,{colOne:"",colTwo:"",colThree:"Total:",Total:total}], 'Donation_Report',options);
  }

}
