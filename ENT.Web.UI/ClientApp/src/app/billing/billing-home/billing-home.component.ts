
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'billingHome',
  templateUrl: './billing-home.component.html',
  styleUrls: ['./billing-home.component.css']
})

export class billingHomeComponent implements OnInit {
  constructor(private router: Router) { }
  ngOnInit() {
    this.openbilling();
  }

  openbilling() {
    this.buttonHighLight("billing");
    document.getElementById("bill").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
    document.getElementById("bill").style.color = "#fff";
    this.router.navigate(["/home/billing/billing"]);
  }
  
  openbillingPaymentRefund() {
    this.buttonHighLight("billingPaymentRefund");
    document.getElementById("refund").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
    document.getElementById("refund").style.color = "#fff";
    this.router.navigate(["/home/billing/billingPaymentRefund"]);
  }

  openbillingledgerDetails() {
    this.buttonHighLight("billingledgerDetails");
    document.getElementById("ledger").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
    document.getElementById("ledger").style.color = "#fff";
    this.router.navigate(["/home/billing/billingledgerDetails"]);
  }
  
  openbillingMastersubmaster() {
    this.buttonHighLight("billingMaster&submaster");
    document.getElementById("master").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
    document.getElementById("master").style.color = "#fff";
    this.router.navigate(["/home/billing/billingMaster&submaster"]);
  }

  openbillingSetup() {
    this.buttonHighLight("billingSetup");
    document.getElementById("setup").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
    document.getElementById("setup").style.color = "#fff";
    this.router.navigate(["/home/billing/billingSetup"]);
  }


  buttonHighLight(data) {

    switch (data) {
      case "billing":
        document.getElementById("ledger").style.background = "#fff";
        document.getElementById("ledger").style.color = "#717c8c";
        document.getElementById("refund").style.background = "#fff";
        document.getElementById("refund").style.color = "#717c8c";
        document.getElementById("master").style.background = "#fff";
        document.getElementById("master").style.color = "#717c8c";
        document.getElementById("setup").style.background = "#fff";
        document.getElementById("setup").style.color = "#717c8c";
        break;

      case "billingPaymentRefund":
        document.getElementById("ledger").style.background = "#fff";
        document.getElementById("ledger").style.color = "#717c8c";
        document.getElementById("master").style.background = "#fff";
        document.getElementById("master").style.color = "#717c8c";
        document.getElementById("setup").style.background = "#fff";
        document.getElementById("setup").style.color = "#717c8c";
        document.getElementById("bill").style.background = "#fff";
        document.getElementById("bill").style.color = "#717c8c";

        break;

      case "billingledgerDetails":
        document.getElementById("bill").style.background = "#fff";
        document.getElementById("bill").style.color = "#717c8c";
        document.getElementById("refund").style.background = "#fff";
        document.getElementById("refund").style.color = "#717c8c";
        document.getElementById("master").style.background = "#fff";
        document.getElementById("master").style.color = "#717c8c";
        document.getElementById("setup").style.background = "#fff";
        document.getElementById("setup").style.color = "#717c8c";
        break;

      case "billingMaster&submaster":
        document.getElementById("bill").style.background = "#fff";
        document.getElementById("bill").style.color = "#717c8c";
        document.getElementById("refund").style.background = "#fff";
        document.getElementById("refund").style.color = "#717c8c";
        document.getElementById("ledger").style.background = "#fff";
        document.getElementById("ledger").style.color = "#717c8c";
        document.getElementById("setup").style.background = "#fff";
        document.getElementById("setup").style.color = "#717c8c";

        break;

      case "billingSetup":
        document.getElementById("bill").style.background = "#fff";
        document.getElementById("bill").style.color = "#717c8c";
        document.getElementById("refund").style.background = "#fff";
        document.getElementById("refund").style.color = "#717c8c";
        document.getElementById("ledger").style.background = "#fff";
        document.getElementById("ledger").style.color = "#717c8c";
        document.getElementById("master").style.background = "#fff";
        document.getElementById("master").style.color = "#717c8c";
        break;

      default:
        break;
    }
  }


}
