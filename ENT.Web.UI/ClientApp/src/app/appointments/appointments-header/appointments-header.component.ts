import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CustomHttpService } from 'src/app/core/custom-http.service';

@Component({
  selector: 'app-appointment-header',
  templateUrl: './appointments-header.component.html',
  styleUrls: ['./appointments-header.component.css']
})

export class AppointmentsHeaderComponent implements OnInit {

  constructor(private router: Router, private customHttpSvc: CustomHttpService) { }

  ngOnInit(): void {

    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.buttonHighLight();
  }

  openAppointment() {
    this.router.navigate(['home/appointments']);
  }
  openCalender() {
    this.router.navigate(['home/appointments/appointmentcalendar']);
  }
  openList() {
    this.router.navigate(['home/appointments/appointmentslist']);
  }

  //#region "Button HighLight"
  buttonHighLight() {
    let path = (this.router as any).location.path();

    if (path == "/home/appointments/appointmentcalendar") {
      document.getElementById("calendar").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
      document.getElementById("calendar").style.color = "#fff";
    }
    else if (path == "/home/appointments/appointmentslist") {
      document.getElementById("List").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
      document.getElementById("List").style.color = "#fff";
    }
    else {
      document.getElementById("Add").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
      document.getElementById("Add").style.color = "#fff";
    }
  }
  //#endregion

  //#Pratice Region
}

