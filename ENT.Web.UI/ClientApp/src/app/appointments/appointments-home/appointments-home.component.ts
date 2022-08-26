import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CustomHttpService } from 'src/app/core/custom-http.service';

@Component({
  selector: 'appointment-home',
  templateUrl: './appointments-home.component.html',
  styleUrls: ['./appointments-home.component.css']
})

export class AppointmentsHomeComponent {

  constructor(private router: Router, private customHttpSvc: CustomHttpService) {
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
  }

}

