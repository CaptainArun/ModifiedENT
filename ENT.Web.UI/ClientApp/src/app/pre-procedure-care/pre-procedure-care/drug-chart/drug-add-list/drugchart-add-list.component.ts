import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DrugchartModel } from '../../../models/DrugchartModel';
import { CustomHttpService } from '../../../../core/custom-http.service';
import { DrugCharteditRecordComponent } from '../drug-edit-record/drugchart-edit-record.component';
import { ProcedureService } from '../../../procedure.service';
import { MatAutocompleteTrigger, MatDialog } from '@angular/material';
import { DrugchartViewRecordComponent } from '../drug-view-record/drugchart-view-record.component';
import { UtilService } from '../../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from '../../../../ux/columnConfig';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ProcedureCareSignOffModel } from '../../../models/preProcedureCareSignOffModel';

@Component({
  selector: 'app-drugchart-add-list',
  templateUrl: './drugchart-add-list.component.html',
  styleUrls: ['./drugchart-add-list.component.css']
})
export class DrugchartAddListComponent implements OnInit {

  //#region "Property Declaration"

  tableConfig: TableConfig = new TableConfig();
  griddata: any;
  drugchartModel: DrugchartModel = new DrugchartModel();
  ProcedureCareSignOffModel: ProcedureCareSignOffModel = new ProcedureCareSignOffModel();
  DrugForm: FormGroup;
  orderPhysician: any;
  recordby: any;
  recordduring: any;
  facilityId: number = 0;
  drugName: string[];
  AdmissionID: any;
  admissionbind: any;
  AdmissionDateTime = "";
  AdmissionNo: any = "";
  PatientID: any;
  routeData: any;
  IsSignOff: boolean = false;
  drugToolTip: any = "";
  drugTimeToolTip: any = "";
  tableToBeShow: boolean = false;
  @ViewChild('autoCompletePhysicianInput', { static: false, read: MatAutocompleteTrigger }) trigger1: MatAutocompleteTrigger;
  @ViewChild('autoCompletedrug', { static: false, read: MatAutocompleteTrigger }) triggerDrug: MatAutocompleteTrigger;

  //#endregion "Property Declaration"

  //#region "Constructor"
  constructor(public fb: FormBuilder, private activatedRoute: ActivatedRoute,
    private router: Router, public dialog: MatDialog, @Optional() public dialogRef: MatDialogRef<DrugchartAddListComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public procedureService: ProcedureService, public custHttp: CustomHttpService, private util: UtilService,) {

    this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;

    this.tableConfig.columnConfig = [
      { PropertyName: 'DrugDate', DisplayName: 'Drug Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
      { PropertyName: 'DrugName', DisplayName: 'Drug Name', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'DrugRoute', DisplayName: 'Route', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'DosageDesc', DisplayName: 'Dosage Desc...', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'DrugTime', DisplayName: 'Time', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'RateOfInfusion', DisplayName: 'Rate Of Infusion', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'OrderingPhysician', DisplayName: 'Ordering Physician', DisplayMode: 'Text', LinkUrl: '' }
    ];
  }
  //#endregion

  //#region "time"

  time = [
    { id: 3, Value: '6.00 AM' },
    { id: 2, Value: '6.15 AM' },
    { id: 3, Value: '6.30 AM' },
    { id: 4, Value: '6.45 AM' },
    { id: 5, Value: '7.00 AM' },
    { id: 6, Value: '7.15 AM' },
    { id: 7, Value: '7.30 AM' },
    { id: 8, Value: '7.45 AM' },
    { id: 9, Value: '8.00 AM' },
    { id: 2, Value: '8.15 AM' },
    { id: 3, Value: '8.30 AM' },
    { id: 4, Value: '8.45 AM' },
    { id: 5, Value: '9.00 AM' },
    { id: 6, Value: '9.15 AM' },
    { id: 7, Value: '9.30 AM' },
    { id: 8, Value: '9.45 AM' },
    { id: 5, Value: '10.00 AM' },
    { id: 6, Value: '10.15 AM' },
    { id: 7, Value: '10.30 AM' },
    { id: 8, Value: '10.45 AM' },
    { id: 5, Value: '11.00 AM' },
    { id: 6, Value: '11.15 AM' },
    { id: 7, Value: '11.30 AM' },
    { id: 8, Value: '11.45 AM' },
    { id: 5, Value: '12.00 PM' },
    { id: 6, Value: '12.15 PM' },
    { id: 7, Value: '12.30 PM' },
    { id: 8, Value: '12.45 PM' },
    { id: 5, Value: '1.00 PM' },
    { id: 6, Value: '1.15 PM' },
    { id: 7, Value: '1.30 PM' },
    { id: 8, Value: '1.45 PM' },
    { id: 5, Value: '2.00 PM' },
    { id: 6, Value: '2.15 PM' },
    { id: 7, Value: '2.30 PM' },
    { id: 8, Value: '2.45 PM' },
    { id: 5, Value: '3.00 PM' },
    { id: 6, Value: '3.15 PM' },
    { id: 7, Value: '3.30 PM' },
    { id: 8, Value: '3.45 PM' },
    { id: 5, Value: '4.00 PM' },
    { id: 6, Value: '4.15 PM' },
    { id: 7, Value: '4.30 PM' },
    { id: 8, Value: '4.45 PM' },
    { id: 5, Value: '5.00 PM' },
    { id: 6, Value: '5.15 PM' },
    { id: 7, Value: '5.30 PM' },
    { id: 8, Value: '5.45 PM' },
    { id: 5, Value: '6.00 PM' },
    { id: 6, Value: '6.15 PM' },
    { id: 7, Value: '6.30 PM' },
    { id: 8, Value: '6.45 PM' },
    { id: 5, Value: '7.00 PM' },
    { id: 6, Value: '7.15 PM' },
    { id: 7, Value: '7.30 PM' },
    { id: 8, Value: '7.45 PM' },
    { id: 5, Value: '8.00 PM' },
    { id: 6, Value: '8.15 PM' },
    { id: 7, Value: '8.30 PM' },
    { id: 8, Value: '8.45 PM' },
    { id: 5, Value: '9.00 PM' },
    { id: 6, Value: '9.15 PM' },
    { id: 7, Value: '9.30 PM' },
    { id: 8, Value: '9.45 PM' },
    { id: 5, Value: '10.00 PM' },
    { id: 6, Value: '10.15 PM' },
    { id: 7, Value: '10.30 PM' },
    { id: 8, Value: '10.45 PM' },
    { id: 5, Value: '11.00 PM' },
    { id: 6, Value: '11.15 PM' },
    { id: 7, Value: '11.30 PM' },
    { id: 8, Value: '11.45 PM' },
    { id: 5, Value: '12.00 AM' },
    { id: 6, Value: '12.15 AM' },
    { id: 7, Value: '12.30 AM' },
    { id: 8, Value: '12.45 AM' },
    { id: 5, Value: '1.00 AM' },
    { id: 6, Value: '1.15 AM' },
    { id: 7, Value: '1.30 AM' },
    { id: 8, Value: '1.45 AM' },
    { id: 5, Value: '2.00 AM' },
    { id: 6, Value: '2.15 AM' },
    { id: 7, Value: '2.30 AM' },
    { id: 8, Value: '2.45 AM' },
    { id: 5, Value: '3.00 AM' },
    { id: 6, Value: '3.15 AM' },
    { id: 7, Value: '3.30 AM' },
    { id: 8, Value: '3.45 AM' },
    { id: 5, Value: '4.00 AM' },
    { id: 6, Value: '4.15 AM' },
    { id: 7, Value: '4.30 AM' },
    { id: 8, Value: '4.45 AM' },
    { id: 5, Value: '5.00 AM' },
    { id: 6, Value: '5.15 AM' },
    { id: 7, Value: '5.30 AM' },
    { id: 8, Value: '5.45 AM' },
  ];
  //#endregion "time"

  //#region ngOnInit
  ngOnInit() {
    this.custHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.activatedRoute.params.subscribe(params => {

      this.AdmissionID = params.AdmissionID;
      this.PatientID = params.patientid;

    });

    this.DrugForm = this.fb.group({

      Drug: ['', Validators.required],
      Route: ['', Validators.required],
      RecordedBy: ['', Validators.required],
      Date: ['', Validators.required],
      RateOfInflation: ['', Validators.required],
      time: ['', Validators.required],
      RecordedDuring: ['', Validators.required],
      DosageDescription: ['', Validators.required],
      Frequency: ['', Validators.required],
      orderingPhysician: ['', Validators.required],
      StopMedicine: [''],
      AdditionalNotes: [''],
      UserName: [localStorage.getItem('LoggedinUser')],
      Password: [""],

    });

    this.getAdmissionDetails();
    this.getRecordby();
    this.getRecordDuring();
    this.getOrderingPhysician();
    this.getOrderingDrug();
    this.dialogClose();
    this.getRouteData();
  }
  ngAfterViewInit() {
    this.trigger1.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.DrugForm.get('orderingPhysician').setValue('');
        }
      });

    this.triggerDrug.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.DrugForm.get('Drug').setValue('');
        }
      });
  }
  //#endregion ngOnInit  

  //#region Save Function

  //submit value
  save() {
    if (this.DrugForm.valid) {

      this.drugchartModel.AdmissionNo = this.AdmissionNo;
      this.drugchartModel.PatientID = this.admissionbind.PatientID;
      this.drugchartModel.RecordedBy = this.DrugForm.get('RecordedBy').value;
      this.drugchartModel.RecordedDuringID = this.DrugForm.get('RecordedDuring').value;
      this.drugchartModel.DrugDate = this.DrugForm.get('Date').value;
      this.drugchartModel.DrugName = this.DrugForm.get('Drug').value;
      this.drugchartModel.DrugRoute = this.DrugForm.get('Route').value;
      this.drugchartModel.DosageDesc = this.DrugForm.get('DosageDescription').value;
      this.drugchartModel.DrugTimes = this.DrugForm.get('time').value;
      this.drugchartModel.RateOfInfusion = this.DrugForm.get('RateOfInflation').value;
      this.drugchartModel.Frequency = this.DrugForm.get('Frequency').value;
      this.drugchartModel.ProcedureType = "Preprocedure";
      this.drugchartModel.OrderingPhysician = this.DrugForm.get('orderingPhysician').value;
      this.drugchartModel.StopMedicationOn = this.DrugForm.get('StopMedicine').value;
      this.drugchartModel.DrugSignOffDate = new Date();
      this.drugchartModel.AdditionalInfo = this.DrugForm.get('AdditionalNotes').value;

      this.procedureService.addpreplan(this.drugchartModel).then(data => {
        if (data != null) {
          this.util.showMessage('', 'Drug Chart Details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
            this.getgriddata();
            this.DrugForm.reset();
            this.DrugForm.get("UserName").setValue(localStorage.getItem('LoggedinUser'));
            this.drugTimeToolTip = null;
          });
        }
      });
    }else {
      this.DrugForm.markAllAsTouched();
    }
  }

  //#endregion Save Function

  //#region Set ToolTip values
  setDrugToolTip(value) {
    this.drugToolTip = value;
  }
  setDrugTimeToolTip() {
    this.drugTimeToolTip = this.DrugForm.get('time').value;
  }
  //#endregion Set ToolTip values

  //#region Get Datas From Service

  //Admission Details
  getAdmissionDetails() {
    this.procedureService.getPreProcedureAdmission(this.AdmissionID).then(obj => {

      this.admissionbind = obj;
      this.AdmissionNo = this.admissionbind.AdmissionNo;
      this.AdmissionDateTime = new Date(this.admissionbind.AdmissionDateTime).toLocaleDateString() + ' ' + new Date(this.admissionbind.AdmissionDateTime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'});
      this.getgriddata();

    });
  }

  //Drug Names
  getOrderingDrug() {
    this.DrugForm.get('Drug').valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.procedureService.Getdrug(key).then((data) => {
            this.drugName = data;
          });
        } else {
          this.drugName = null;
          this.drugToolTip = null;
        }
      }
      if (key == "" || key == undefined || key == null) {
        this.drugName = null;
        this.drugToolTip = null;
      }
    });
  }

  //Physician Name
  getOrderingPhysician() {
    if (this.DrugForm.get('orderingPhysician').value != null) {
      this.DrugForm.get('orderingPhysician').valueChanges.subscribe((key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.procedureService.getOrderPhysician(key).then((data) => {
              this.orderPhysician = data;
            });
          }
          else {
            this.orderPhysician = null;
          }
        }
      });
    }
  }

  //Record by Values
  getRecordby() {
    this.procedureService.GetProviderNames(this.facilityId).then((res) => {
      this.recordby = res;
    });
  }

  //route Values
  getRouteData() {
    this.procedureService.getRouteData().then(res => {
      this.routeData = res;
    });
  }

  //Record During
  getRecordDuring() {
    this.procedureService.GetPreprocedure().then(res => {
      this.recordduring = res;
    });
  }

  //Grid data
  getgriddata() {
    this.procedureService.Getpreplan1(this.AdmissionNo).then(res => {
      this.griddata = res;
      if (this.griddata.length == 0) {
        this.tableToBeShow = false;
      } else {
        this.tableToBeShow = true;
      }
      if (res.length != 0) {
        if (this.griddata[0].DrugSignOffStatus) {
          this.DrugForm.disable();
          this.IsSignOff = true;
          this.tableConfig.showDelete = false;
          this.tableConfig.showEdit = false;
        }
      }
    });
  }
  //#endregion Get Datas From Service

  //#region Table Functions

  //delete
  deleteCarePlanPatient(element: any) {
    this.util.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
      if (res == true) {
        this.procedureService.Deletepreplan(element.Item.DrugChartID).then(data => {
          this.getgriddata();
        })
      }
    });
  }

  //view Record
  openVisitViewRecord(element: any) {
    this.procedureService.getprocedurebyId(element.Item.DrugChartID).then(data => {
      var patientDetail = data;
      const dialogRef = this.dialog.open(DrugchartViewRecordComponent,
        {
          data: patientDetail,
          height: 'auto',
          width: "75%",
          autoFocus: false,
        });
    });
  }

  //Edit Record
  openPatientEditRecord(element: any) {
    this.procedureService.getprocedurebyId(element.Item.DrugChartID).then(data => {
      var patientDetail = data;
      const dialogRef = this.dialog.open(DrugCharteditRecordComponent,
        {
          data: patientDetail,
          height: 'auto',
          width: "75%",
          autoFocus: false,

        });

      dialogRef.afterClosed().subscribe(result => {
        if (result == "Updated") {
          this.getgriddata();
        }
      });
    });
  }
  //#endregion Table Functions

  //#region Back & Close 

  //close
  dialogClose(): void {
    this.DrugForm.reset();
    this.DrugForm.get("UserName").setValue(localStorage.getItem('LoggedinUser'));
  }

  //Back
  back() {
    this.router.navigate(['/home/procedure/pre-procedure-list']);
  }

  //#endregion Back & Close 

  //#region Sign off
  SignOff() {
    if (this.DrugForm.get('UserName').value && this.DrugForm.get('Password').value) {
      this.util.showMessage("SignOff", "Are you sure want to SignOff?", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then((res) => {
        if (res) {
          this.ProcedureCareSignOffModel.AdmissionId = this.AdmissionID;
          this.ProcedureCareSignOffModel.ScreenName = 'preproceduredrugchart';
          this.ProcedureCareSignOffModel.UserName = this.DrugForm.get('UserName').value;
          this.ProcedureCareSignOffModel.Password = this.DrugForm.get('Password').value;

          this.procedureService.sendSignOffModel(this.ProcedureCareSignOffModel).then((res) => {
            if (res.status == "Pre Procedure Drug Chart Signed Off successfully") {
              this.util.showMessage('Success', res.status, BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
                if (res) {
                  this.DrugForm.disable();
                  this.IsSignOff = true;
                  this.getgriddata();
                }
              });
            } else {
              this.util.showMessage('Error!!', res.status, BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then((res) => { });
            }
          });
        }
      });
    } else {
      this.util.showMessage('Error!!', "Invalid Username or password", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { });
    }
  }
  //#endregion Sign off
}

