
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-view-billing-master',
  templateUrl: './view-billing-master.component.html',
  styleUrls: ['./view-billing-master.component.css']
})
export class ViewBillingMasterComponent implements OnInit {

  constructor(public dialog: MatDialogRef<ViewBillingMasterComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
