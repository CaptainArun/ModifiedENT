import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CallCenterPopupHistoryComponent } from './callCenter-popupHistory/callCenter-popupHistory.component';

@Component({
  selector: 'callCenter-labList',
  templateUrl: './callCenter-labList.component.html',
})
export class CallCenterLabListComponent implements OnInit {

 public show: boolean = false;
 search() {
    this.show = !this.show;
  }
  constructor(public dialog: MatDialog) { }

  history() {
    const dialogRef = this.dialog.open(CallCenterPopupHistoryComponent , {
      height: 'auto',
      width: 'auto',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  ngOnInit() {

  }

}

