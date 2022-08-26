import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audiology-home',
  templateUrl: './audiology-home.component.html',
  styleUrls: ['./audiology-home.component.css']
})
export class AudiologyHomeComponent implements OnInit {
  subMenu = [];
  
  constructor() { }

  ngOnInit() {
    this.subMenu = [
      { "Id": 2, "Title": "Special Test", "Url": "specialtest", "isOpen": null, },
      { "Id": 4, "Title": "OAE Test", "Url": "oaetest", "isOpen": null, },
      { "Id": 5, "Title": "BERA Test", "Url": "beratest", "isOpen": null, },
      { "Id": 6, "Title": "ASSR Test", "Url": "assrtest", "isOpen": null, },
      { "Id": 7, "Title": "Hearing Aid Trial", "Url": "hearingaidtrial", "isOpen": null, },
      { "Id": 8, "Title": "Tinnitus Masking", "Url": "tinnitusmasking", "isOpen": null, },
      { "Id": 9, "Title": "Speech Therapy", "Url": "speechtherapy", "isOpen": null, },
      { "Id": 10, "Title": "Electrocochleography", "Url": "electrocochleography", "isOpen": null, },
    ]
  }

}
