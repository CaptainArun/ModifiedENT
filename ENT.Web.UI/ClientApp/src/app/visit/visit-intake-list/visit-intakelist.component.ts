import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'visit-intakelist',
  templateUrl: 'visit-intakelist.component.html', 
  styleUrls: ['./visit-intakelist.component.css']
})

export class VisitIntakeListComponent {

  constructor(private router: Router) { }

  list() {
    this.router.navigate(['home/opds/OpdListComponent']);
  }
   viewPatient() {
    this.router.navigate(['home/visits/visitIntake']);
  }
   backVisit() {
    this.router.navigate(['home/visits/visit']);
  }
}
