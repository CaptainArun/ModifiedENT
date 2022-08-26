import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-document-management-view',
  templateUrl: './document-management-view.component.html',
  styleUrls: ['./document-management-view.component.css']
})
export class DocumentManagementViewComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DocumentManagementViewComponent>, @Inject(MAT_DIALOG_DATA) public data1: any) {
    
  }

  ngOnInit() {
  }

}
