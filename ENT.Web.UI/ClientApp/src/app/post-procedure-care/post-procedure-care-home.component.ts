import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'post-procedure-home',
  templateUrl: './post-procedure-care-home.component.html',
  styleUrls: ['./post-procedure-care-home.component.css']
})

export class PostProcedureHomeComponent {
  subMenuVals2 = [];

  ngOnInit() {
    this.subMenuVals2 = [
   //  { "Id": 1, "Title": "postprocedurehome", "Url": "OtPostSurgicalListComponent", "isOpen": null, },
      { "Id": 1, "Title": "postProcedureAddComponent", "Url": "postProcedureAddComponent", "isOpen": null, },
     // { path: "postProcedureAddComponent", component: PostProcedureAddComponent },
     // { "Id": 2, "Title": "Observation Notes", "Url": "#", "isOpen": null, },
      { "Id": 2, "Title": "postprocedureadmissiondrugchart", "Url": "DrugchartAddListComponent", "isOpen": null, },
    ]
  }
}



