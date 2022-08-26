import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { eLabService } from 'src/app/e-lab/eLab.service';
import { CustomHttpService } from '../../core/custom-http.service';
import { TableConfig } from '../../ux/columnConfig';
import { NewPatientService } from '../newPatient.service';
import { patienteLabViewComponent } from './patient-eLab-View/patient-eLab-view.component';

@Component({
  selector: 'app-patienteLabComponent',
  templateUrl: './patient-eLab.component.html',
  styleUrls: ['./patient-eLab.component.css']
})

export class patienteLabComponent implements OnInit{

  tableConfigOrder: TableConfig = new TableConfig();
  IsOrderList:boolean=true;
  TableDataOrder: any;
  TableDataRequest: any;
  patientId: any;

    constructor(public dialog: MatDialog,private router: Router,public activateRoute: ActivatedRoute,private customHttpSvc: CustomHttpService,public elabService:NewPatientService){
    this.tableConfigOrder.showPagination = true;
    this.tableConfigOrder.showView = true;
    //this.tableConfigOrder.showIcon = true;
    //this.tableConfigOrder.showEdit = true;
   // this.tableConfigOrder.showAdd = true;
   // this.tableConfigOrder.showDelete = true;
    //this.tableConfigOrder.showOpen = true;

    this.tableConfigOrder.columnConfig = [
      { PropertyName: 'LabOrderNo', DisplayName: 'order No', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'patientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'physicianName', DisplayName: 'Requesting Physician', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'visitDateandTime', DisplayName: 'Visit Date & Time / Admission Date', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'SignOffDate', DisplayName: 'Test On Date',DisplayMode: "DateTime", FormatString: "dd-MM-yyyy", LinkUrl: '' },
      { PropertyName: 'LabOrderStatus', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '' },
    ]; 

   
    }
  ngOnInit() {
    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));
    this.activateRoute.params.subscribe((params) => {
      this.patientId = params["PatientId"];
    });
     this.getTableDataOrder();
     
  }

  getTableDataOrder(){
    this.elabService.getTableDataOrder(this.patientId).then(res=>{
      this.TableDataOrder = res;
    })
  }

  setelab(event: any) {
    if (event.Item) {
      if (event.Item.visitDateandTime == null || event.Item.visitDateandTime == "") {
        event.Item.visitDateandTime = event.Item.AdmissionDateandTime;
      } else{
        event.Item.visitDateandTime = event.Item.visitDateandTime;
      }
    }

  }
  setTableOrder(){
    this.IsOrderList=true;
  }
   setTableRequest(){
    this.IsOrderList=false;
  }
   
  viewItemOrder(element: any) {
    this.elabService.getViewRecordByOrder(element.Item.LabOrderNo).then((data)=>{ 
      let record=data;     
    const dialogRef = this.dialog.open(patienteLabViewComponent, {
      data : record,
      height : 'auto',
      width : 'auto',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result=="Updated"){
        this.getTableDataOrder();        
      }
    })
    });   
  }
 
}
