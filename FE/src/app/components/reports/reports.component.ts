import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Organisation } from 'src/app/models/Organisation/Organisation';
import { OrganisationService } from 'src/app/services/firebase/organisation-service/organisation.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ItemService } from 'src/app/services/firebase/item-service/item.service';
import { Item } from 'src/app/models/Item';
import { TransactionService } from 'src/app/services/firebase/transaction-service/transaction.service';
import { GeneralDonations } from 'src/app/models/GeneralDonations/GeneralDonations';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  displayedColumns: string[] = ["name"];
  selectedOrg: Organisation;
  orgData: MatTableDataSource<Organisation>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private ofs: OrganisationService,
    private ifs: ItemService,
    private tfs: TransactionService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initSelectedOrg();
    this.getOrgs();
  }

  generateItemReport() {

    if (this.selectedOrg.id === '') {
      this.snackBar.open("No organisation selected");
      return;
    }

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: `${this.selectedOrg.name}'s Donation Items`,
      useBom: true,
      noDownload: false,
      headers: ["Item Name", "Date Listed", "Initial Price", "Total Donations", "Amount Remaining", "Is Funded", "Date Completed", "Active Status"],
      useHeader: false,
      nullToEmptyString: false,
    };

    this.ifs.getItems(this.selectedOrg.id).subscribe((itemData) => {

      let orgItems = itemData as ItemGetModel[];

      const data: ItemCSVModel[] = orgItems.map((item: ItemGetModel) => {
        const newItem: ItemCSVModel = {
          name: item.name,
          createdAt: item.createdAt.toDate().toLocaleDateString(),
          initialPrice: item.initialPrice,
          totalDonationsValue: item.totalDonationsValue,
          amountRemaining: Math.max(0, (item.initialPrice - item.totalDonationsValue)),
          isFunded: item.totalDonationsValue >= item.initialPrice,
          dateCompleted: item.dateCompleted?.toDate().toLocaleTimeString(),
          activeStatus: item.activeStatus
        }
        return newItem
      });
      
      new AngularCsv(data, `${this.selectedOrg.name}'s Donation Item Report`, options);

    });

  }

  generateDonationReport() {

    if (this.selectedOrg.id === '') {
      this.snackBar.open("No organisation selected");
      return;
    }

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: `${this.selectedOrg.name}'s General Donations`,
      useBom: true,
      noDownload: false,
      headers: ["Donation Date", "Donor Public Name", "Comment", "IsSubscribed", "IsRefunded", "Amount"],
      useHeader: false,
      nullToEmptyString: false,
    };

    
    this.tfs.getOrgGeneralDonations(this.selectedOrg.id).then((resp) => {

      let donations: GeneralDonations[] = [];

      resp.forEach((resp) => {
        donations.push(resp.data() as GeneralDonations);
      });

      const data: DonationCSVModel[] = donations.map((item) => {
        const newItem: DonationCSVModel = {
          donationDate: item.donationDate.toDate().toLocaleDateString(),
          donorPublicName: item.donorPublicName,
          comment: item.comment,
          isSubscribed: item.IsSubscribed,
          isRefunded: item.IsRefunded,
          paidAMT: item.paidAMT
        }
        return newItem;
      });

      new AngularCsv(data, `${this.selectedOrg.name}'s General Donations Report`, options);

    });

  }

  getOrgs() {
    this.ofs.getOrgs().subscribe(orgs => {
      this.orgData = new MatTableDataSource(orgs as Organisation[]);
      this.orgData.paginator = this.paginator;
      this.orgData.sort = this.sort;
    });
  }

  selectRow(org) {
    if (this.selectedOrg.id === org.id) {
      this.initSelectedOrg();
      return;
    }

    this.selectedOrg = org;
  }

  initSelectedOrg() {
    this.selectedOrg = {
      id: '',
      ABN: '',
      activeStatus: true,
      description: '',
      img: '',
      name: '',
      phone: '',
      summary: '',
      totalDonationItems: 0,
      totalDonations: 0,
      website: '',
    };
  }

  applyFilter(event: Event) {
    this.initSelectedOrg();
    const filterValue = (event.target as HTMLInputElement).value;
    this.orgData.filter = filterValue.trim().toLowerCase();

    if (this.orgData.paginator) {
      this.orgData.paginator.firstPage();
    }
  }
}
interface ItemCSVModel {
  name: string;
  initialPrice: number;
  totalDonationsValue: number;
  amountRemaining: number;
  isFunded: boolean;
  activeStatus: boolean;
  createdAt?: string;
  dateCompleted?: string;
}
interface ItemGetModel {
  summary: string;
  description: string;
  id?: string;
  name: string;
  initialPrice: number;
  totalDonationsValue: number;
  activeStatus: boolean;
  orgID: string;
  img: string;
  createdAt?: Timestamp;
  dateCompleted?: Timestamp;
}
interface DonationCSVModel {
  donationDate: string,
  donorPublicName: string,
  comment: string,
  isSubscribed: boolean,
  isRefunded: boolean,
  paidAMT: number
}