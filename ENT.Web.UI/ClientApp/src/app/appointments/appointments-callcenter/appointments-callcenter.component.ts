import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AppointmentsPopupHistoryComponent } from '../appointments-popupHistory/appointments-popupHistory.component';

@Component({
  selector: 'appointments-callcenter',
  templateUrl: 'appointments-callcenter.component.html',
  styleUrls: [ './appointments-callcenter.component.css' ]
})

export class AppointmentsCallcenterComponent {

  constructor(public dialog: MatDialog) { }

  
 history() {
    const dialogRef = this.dialog.open(AppointmentsPopupHistoryComponent , {
      height: 'auto',
      width: 'auto',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }


}
