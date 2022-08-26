import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-view-submaster-billing',
  templateUrl: './view-submaster-billing.component.html',
  styleUrls: ['./view-submaster-billing.component.css']
})
export class ViewSubmasterBillingComponent implements OnInit {

  constructor(public dialog: MatDialogRef<ViewSubmasterBillingComponent>, @Inject(MAT_DIALOG_DATA) public data: any ) { }

  ngOnInit() {
  }

}
