
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})

export class BillingComponent implements OnInit {
  subMenuVals = [];
  constructor() { }

  ngOnInit() {
     this.subMenuVals = [
      { "Id": 0, "Title": "Billing Master", "Url": "billing", "isOpen": null, "Items": [], "Icon": "<i class=\"fa fa-id-card-o\"></i>" },
      // { "Id": 1, "Title": "Billing Master", "Url": "billing/billingPaymentRefund", "isOpen": null, "Items": [], "Icon": "<i class=\"fa fa-id-card-o\"></i>" },
      // { "Id": 2, "Title": "Billing Master", "Url": "billing/billingledgerDetails", "isOpen": null, "Items": [], "Icon": "<i class=\"fa fa-id-card-o\"></i>" },
      // { "Id": 3, "Title": "Billing Master", "Url": "billing/billingMaster&submaster", "isOpen": null, "Items": [], "Icon": "<i class=\"fa fa-id-card-o\"></i>" },
      // { "Id": 4, "Title": "Billing Master", "Url": "billing/billingSetup", "isOpen": null, "Items": [], "Icon": "<i class=\"fa fa-id-card-o\"></i>"},
     ]
  }
  

}
