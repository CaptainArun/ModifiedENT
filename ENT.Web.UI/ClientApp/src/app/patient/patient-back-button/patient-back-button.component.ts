import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
@Component({
    selector: "app-patientBackbutton",
    templateUrl: "./patient-back-button.component.html",
    styleUrls: ["./patient-back-button.component.css"],
  })
export class patientBackbutton implements OnInit{

    constructor( public router: Router){

    }
    ngOnInit(){

    }
    back() {
        this.router.navigate(["/home/newPatient"]);
      }
}