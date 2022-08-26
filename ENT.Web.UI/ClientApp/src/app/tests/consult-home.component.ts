import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'consult-home',
  templateUrl: './consult-home.component.html'
})

export class ConsultHomeComponent implements OnInit {
  router: any;
  subMenuVals = [];
  subMenuVals1 = [];
  subMenuVals2 = [];
  subMenuVals3 = [];
  subMenuMedical = [];


  ngOnInit() {
    
    this.subMenuVals3 = [
      { "Id": 1, "Title": "Audiology", "Url": "audiology", "isOpen": null, },
      { "Id": 2, "Title": "Speech Therapy ", "Url": "speechtherapy", "isOpen": null, },
      { "Id": 3, "Title": "Tympanogram", "Url": "tympanogram", "isOpen": null, },
      { "Id": 4, "Title": "OAE Test", "Url": "oaetest", "isOpen": null, },
      { "Id": 5, "Title": "BERA Test", "Url": "beratest", "isOpen": null, },
      { "Id": 6, "Title": "ASSR Test", "Url": "assrtest", "isOpen": null, },
      { "Id": 6, "Title": "Hearing Aid Trial", "Url": "hearingaidtrial", "isOpen": null, },
      { "Id": 6, "Title": "Tinnitus Masking", "Url": "tinnitusmasking", "isOpen": null, },
      { "Id": 7, "Title": "Special Tests", "Url": "specialtests", "isOpen": null, },
      { "Id": 6, "Title": "Electrocochleography", "Url": "electrocochleography", "isOpen": null, },
      { "Id": 7, "Title": "Tuning Fork Test", "Url": "tuningforktest", "isOpen": null, },
    ]
  }
}
