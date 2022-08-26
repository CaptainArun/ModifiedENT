import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CallCenterPopupHistoryComponent } from './callCenter-popupHistory/callCenter-popupHistory.component';

@Component({
  selector: 'callCenter',
  templateUrl: './callCenter.component.html',
})
export class CallCenterComponent implements OnInit {


 public show: boolean = false;
 search() {
    this.show = !this.show;
  }
 constructor(public dialog: MatDialog) { }

  history() {
    const dialogRef = this.dialog.open(CallCenterPopupHistoryComponent , {
      height: 'auto',
      width: '1200px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }


  ngOnInit() {

  }

}

