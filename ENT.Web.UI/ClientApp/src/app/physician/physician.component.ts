import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { PhysicianAddComponent } from './physician-add.component';

@Component({
  selector: 'app-physician',
  templateUrl: './physician.component.html',
})
export class PhysicianComponent implements OnInit {


   constructor(private router: Router, public dialog: MatDialog) { }

  list() {
    this.router.navigate(['home/opds/OpdListComponent']);
  }
   openOPD() {
    this.router.navigate(['./home/opds/visit']);
  }
  ngOnInit() {

  }

}

