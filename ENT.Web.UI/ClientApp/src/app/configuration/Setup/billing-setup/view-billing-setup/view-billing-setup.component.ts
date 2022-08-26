import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-view-billing-setup',
  templateUrl: './view-billing-setup.component.html',
  styleUrls: ['./view-billing-setup.component.css']
})
export class ViewBillingSetupComponent implements OnInit {

  constructor(public dialog: MatDialogRef<ViewBillingSetupComponent>, @Inject(MAT_DIALOG_DATA) public data: any ) { }

  ngOnInit() {
  }

}
