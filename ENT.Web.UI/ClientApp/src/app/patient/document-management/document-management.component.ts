import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { documentManagementModel } from '../models/documentManagementModel';
import { CustomHttpService } from '../../core/custom-http.service';
import { TableConfig } from '../../ux/columnConfig';
import { NewPatientService } from '../newPatient.service';
import { MatDialog } from '@angular/material';
import { DocumentManagementViewComponent } from './document-management-view/document-management-view.component';
import { DocumentManagementEditComponent } from './document-management-edit/document-management-edit.component';
import { DocumentManagementAddComponent } from './document-management-add/document-management-add.component';

@Component({
  selector: 'app-document-management',
  templateUrl: './document-management.component.html',
  styleUrls: ['./document-management.component.css']
})
export class DocumentManagementComponent implements OnInit {
  DocumentManagementForm: FormGroup;
  DocumentManagementModel: documentManagementModel = new documentManagementModel();
  tableconfig: TableConfig = new TableConfig();
  tableData: any;
  recordedDuring: any = '';
  visitID:any;
  patientId: number = 1;
  visitDandT: any[] = [];

  facilityId: number = 0;
  recordby: any[] = [];

  constructor(public fb: FormBuilder, public custhttp: CustomHttpService, public serv: NewPatientService, public dialogue: MatDialog) {
    this.tableconfig.showPagination = true;
    this.tableconfig.showView = true;
    this.tableconfig.showIcon = false;
    this.tableconfig.showEdit = true;
    this.tableconfig.showAdd = false;
    this.tableconfig.showDelete = true;


    this.tableconfig.columnConfig = [
      { PropertyName: 'DocumentName', DisplayName: 'Document Name', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'DocumentType', DisplayName: 'Document Type', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'DocumentNotes', DisplayName: 'Document Notes', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
    ];
  }
  

  ngOnInit() {
    this.custhttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getDocumentManagement();
   
  }

  

  getDocumentManagement() {
    this.serv.getDocumentManagementList(this.patientId).then(res => {
      this.tableData = res;
      
    })
  }

  openAddUpdateform() {
    const dialogRef = this.dialogue.open(DocumentManagementAddComponent, {
      height: '500px',
      width: '1500px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "update") {
        this.getDocumentManagement();
      }
    });
  }

  openWorkHistoryViewRecord(element: any) {
    
    this.serv.getDocumentManagementbyId(element.Item.DocumentID).then(data => {
      
      var patientDetail = data;
      const dialogRef = this.dialogue.open(DocumentManagementViewComponent, {
        data: patientDetail,
        height: '350px',
        width: '1500px',
        autoFocus: false,
      });
    });
    
  }

  openWorkHistoryEditRecord(element: any) {
   
    this.serv.getDocumentManagementbyId(element.Item.DocumentID).then(data => {
      
      var patientDetail = data;
      const dialogRef = this.dialogue.open(DocumentManagementEditComponent, {
        data: patientDetail,
        height: '350px',
        width: '1500px',
        autoFocus: false,
      });
    
    });
    
  }


  

  deleteDocumentRecord(element: any) {
    
    this.serv.deleteDocumentRecord(element.Item.DocumentID).then(res => {

    })
  }

  
}
