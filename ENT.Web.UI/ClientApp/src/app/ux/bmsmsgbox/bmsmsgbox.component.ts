import { Component, Input, OnInit, OnChanges, ViewContainerRef, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
// import {NgbModal, NgbModalOptions, NgbActiveModal,  ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ColumnConfig, TableConfig } from '../columnConfig';

@Component({
  // selector: 'bms-messagebox',
  templateUrl: 'bmsmsgbox.component.html'
})

export class BMSMessageBox implements OnInit {
  @Input()
  msgBoxTitle: string;

  @Input()
  message: string;

  @Input()
  mode: BMSMessageBoxMode = BMSMessageBoxMode.MessageBox; // Mode of Message box - Values Message, Confirm
  @Input()
  colorMode: BMSMessageBoxColorMode = BMSMessageBoxColorMode.Information;  //Mode for header color  - Info, Danger, Warning

  private isInfo: boolean = true;
  private isDanger: boolean = false;
  private isWarning: boolean = false;
  constructor(public dialogRef: MatDialogRef<BMSMessageBox>

  ) {

  }

  closeDialog(value: any) {
    this.dialogRef.close(value);
  }

  ngOnInit() {
    switch (this.colorMode) {
      case BMSMessageBoxColorMode.Information: {
        this.isInfo = true;
        this.isDanger = false;
        this.isWarning = false;
        break;
      }
      case BMSMessageBoxColorMode.Danger:
        {
          this.isInfo = false;
          this.isDanger = true;
          this.isWarning = false;
          break;
        }
      case BMSMessageBoxColorMode.Warning:
        {
          this.isInfo = false;
          this.isDanger = false;
          this.isWarning = true;
          break;
        }
    }
  }
}

export enum BMSMessageBoxColorMode {
  Information,
  Danger,
  Warning
}

export enum BMSMessageBoxMode {
  MessageBox,
  ConfrimBox
}
