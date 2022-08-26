import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'callCenter-list',
  templateUrl: 'callCenter-list.component.html'
})

export class CallCenterlistComponent {

  constructor(private router: Router) { }

  list() {
    this.router.navigate(['home/opds/OpdListComponent']);
  }
   viewPatient() {
    this.router.navigate(['home/opds/visit']);
  }
}
