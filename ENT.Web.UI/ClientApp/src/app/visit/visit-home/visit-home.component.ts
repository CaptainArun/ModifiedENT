import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'visit-home',
  templateUrl: './visit-home.component.html', 
  styleUrls: ['./visit-home.component.css']
})

export class VisitHomeComponent implements OnInit {
  subMenuVals = [];

  ngOnInit() {
    this.subMenuVals = [
      { "Id": 1, "Title": "Visits", "Url": "visit", "isOpen": null, "Items": [], "Icon": "<i class=\"fa fa-id-card-o\"></i>" },
      //{ "Id": 2, "Title": "Insurance", "Url": "insurance", "isOpen": null, "Items": [], "Icon": "<i class=\"fa fa-id-card-o\"></i>" },
      //{ "Id": 3, "Title": "Work History", "Url": "history", "isOpen": null, "Items": [], "Icon": "<i class=\"fa fa-id-card-o\"></i>" },
      //{ "Id": 4, "Title": "Intake form", "Url": "intake", "isOpen": null, "Items": [], "Icon": "<i class=\"fa fa-id-card-o\"></i>" },
      //{ "Id": 5, "Title": "Family Information", "Url": "familyinfo", "isOpen": null, "Items": [], "Icon": "<i class=\"fa fa-id-card-o\"></i>" },
      //{ "Id": 6, "Title": "Ledger", "Url": "ledger", "isOpen": null, "Items": [], "Icon": "<i class=\"fa fa-id-card-o\"></i>" }
    ]
  }
}
