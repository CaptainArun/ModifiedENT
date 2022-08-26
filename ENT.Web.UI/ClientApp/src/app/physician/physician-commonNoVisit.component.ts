import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'physician-commonNoVisit',
  templateUrl: 'physician-commonNoVisit.component.html'
})

export class PhysicianCommonNoVisitComponent {
selected = 'option1';
  disableSelect = true;

  constructor(private router: Router) { }
  
  viewPatient() {
    this.router.navigate(['home/opds/visit']);
  }
}