import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admissionHeaderComponent',
  templateUrl: './admission-header.component.html',
  styleUrls: ['./admission-header.component.css']
})

export class admissionHeaderComponent implements OnInit {


  constructor(private router: Router) {

  }
  ngOnInit() {
    this.buttonHighLight();
  }

  //#region "Button HighLight"
  buttonHighLight() {
    const path = (this.router as any).location.path();
    if (path.includes("ProcedureConvert")) {
      document.getElementById("procedure").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
      document.getElementById("procedure").style.color = "#fff";
    }
    else {
      document.getElementById("admission").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
      document.getElementById("admission").style.color = "#fff";
    }
  }
  //#endregion

  openAdmission() {
    this.router.navigate(["home/admission"]);
    document.getElementById("admission").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
    document.getElementById("admission").style.color = "#fff";

    document.getElementById("procedure").style.background = "#fff";
    document.getElementById("procedure").style.color = "#717c8c";
  }

  openProcedure() {
    this.router.navigate(["home/admission/ProcedureConvert"]);
    document.getElementById("procedure").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
    document.getElementById("procedure").style.color = "#fff";

    document.getElementById("admission").style.background = "#fff";
    document.getElementById("admission").style.color = "#717c8c";
  }
}

