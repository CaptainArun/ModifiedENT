import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DrugchartModel } from '../../../models/DrugchartModel';
import { CustomHttpService } from '../../../../core/custom-http.service';
import { DrugCharteditRecordComponent } from '../drug-edit-record/drugchart-edit-record.component';
import { PostProcedureCareService } from '../../../../post-procedure-care/postProcedureCare.service';
import { MatDialog, MatAutocompleteTrigger } from '@angular/material';
import { DrugchartViewRecordComponent } from '../drug-view-record/drugchart-view-record.component';
import { UtilService } from '../../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from '../../../../ux/columnConfig';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Optional } from '@angular/core';
import { Router } from '@angular/router';
import { SignoffModel } from "../../../models/signoffModel"

@Component({
  selector: 'app-drugchart-add-list',
  templateUrl: './drugchart-add-list.component.html',
  styleUrls: ['./drugchart-add-list.component.css']
})
export class DrugchartAddListComponent implements OnInit {
  //#region "property declaration"
  @ViewChild('autoDrug', { static: false, read: MatAutocompleteTrigger }) triggerDrug: MatAutocompleteTrigger;
  @ViewChild('autoOrderingPhysician', { static: false, read: MatAutocompleteTrigger }) triggerOrderingPhysician: MatAutocompleteTrigger;
  tableConfig: TableConfig = new TableConfig();
  griddata: any = [];
  drugchartModel: DrugchartModel = new DrugchartModel();
  signoffModel: SignoffModel = new SignoffModel();
  DrugForm: FormGroup;
  orderPhysician: any;
  recordby: any;
  recordduring: any;
  AdmissionDateTime: any = '';
  Drugg: string[];
  AdmissionID: any;
  admissionbind: any;
  admissionno: any = '';
  PatientID: any;
  route: any;
  isShow: boolean = false;
  IsSignOff: boolean = false;
  drugToolTip: any = "";
  drugTimeToolTip: any = "";
  tableToBeShow: boolean = false;

  //#endregion

  //#region "constructor"
  constructor(public fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, public dialog: MatDialog, @Optional() public dialogRef: MatDialogRef<DrugchartAddListComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public postProcedureCareservice: PostProcedureCareService, public custHttp: CustomHttpService, private util: UtilService,) {

    this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;
    this.tableConfig.columnConfig = [
      { PropertyName: 'DrugDate', DisplayName: ' Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
      { PropertyName: 'DrugName', DisplayName: 'Drug ', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'DrugRoute', DisplayName: 'Route', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'DosageDesc', DisplayName: 'Dosage Description', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'DrugTime', DisplayName: 'Time', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'RateOfInfusion', DisplayName: 'Rate Of Infusion', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'OrderingPhysician', DisplayName: 'Ordering Physician', DisplayMode: 'Text', LinkUrl: '' },
    ];
  }
  //#endregion

  //#region "ng oninit"
  ngOnInit() {
    this.custHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.activatedRoute.params.subscribe(params => {
      this.AdmissionID = params.AdmissionID;
      this.PatientID = params.PatientId;
    });

    this.DrugForm = this.fb.group({
      Drug: ['', Validators.required],
      Route: ['', Validators.required],
      RecordedBy: ['', Validators.required],
      Date: ['', Validators.required],
      RateOfInflation: ['', Validators.required],
      Time: ['', Validators.required],
      RecordedDuring: ['', Validators.required],
      DosageDescription: ['', Validators.required],
      Frequency: ['', Validators.required],
      orderingPhysician: ['', Validators.required],
      StopMedicine: [''],
      AdditionalNotes: [''],
      UserName: [localStorage.getItem('LoggedinUser')],
      Password: [''],
    });

    this.getAdmissionno();
    this.getgriddata();
    this.getRecordDuring();
    this.getRecordBy();
    this.getOrderingDrug();
    this.getRoute();
    this.getOrderingPhysician();
  }
  //#endregion
  ngAfterViewInit() {
    this.triggerDrug.panelClosingActions.subscribe(Drug => {
      if (!(Drug && Drug.source)) {
        this.DrugForm.get('Drug').setValue('');
      }
    });
    this.triggerOrderingPhysician.panelClosingActions.subscribe(OrderingPhysician => {
      if (!(OrderingPhysician && OrderingPhysician.source)) {
        this.DrugForm.get('orderingPhysician').setValue('');
      }
    });
  }
  //#region "Amission no"
  getAdmissionno() {
    this.postProcedureCareservice.getPostprocedureAdmission(this.AdmissionID).then(obj => {
      this.admissionbind = obj;
      this.admissionno = this.admissionbind.AdmissionNo;
      this.getgriddata();

      this.AdmissionDateTime = new Date(this.admissionbind.AdmissionDateTime).toLocaleDateString() + ' ' + new Date(this.admissionbind.AdmissionDateTime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' });
    })
  }
  //#endregion

  //#region "Time"
  Time = [
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
  //#endregion

  //#region "Submit"
  save() {
    if (this.DrugForm.valid) {

      this.drugchartModel.AdmissionNo = this.admissionno;
      this.drugchartModel.PatientID = this.admissionbind.PatientID;
      this.drugchartModel.RecordedBy = this.DrugForm.get('RecordedBy').value;
      this.drugchartModel.RecordedDuringID = this.DrugForm.get('RecordedDuring').value;
      this.drugchartModel.DrugDate = this.DrugForm.get('Date').value;
      this.drugchartModel.admissiondateandtime = this.AdmissionDateTime;
      this.drugchartModel.DrugName = this.DrugForm.get('Drug').value;
      this.drugchartModel.DrugRoute = this.DrugForm.get('Route').value;
      this.drugchartModel.DosageDesc = this.DrugForm.get('DosageDescription').value;
      this.drugchartModel.DrugTimes = this.DrugForm.get('Time').value;
      this.drugchartModel.RateOfInfusion = this.DrugForm.get('RateOfInflation').value;
      this.drugchartModel.Frequency = this.DrugForm.get('Frequency').value;
      this.drugchartModel.ProcedureType = "postprocedure";
      this.drugchartModel.OrderingPhysician = this.DrugForm.get('orderingPhysician').value;
      this.drugchartModel.StopMedicationOn = this.DrugForm.get('StopMedicine').value;
      this.drugchartModel.DrugSignOffDate = new Date();
      this.drugchartModel.AdditionalInfo = this.DrugForm.get('AdditionalNotes').value;

      this.postProcedureCareservice.addDrugchart(this.drugchartModel).then(data => {
        if (data != null) {
          this.util.showMessage('', 'Post Procedure Drug Chart saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
            (res) => {
              this.getgriddata();
              this.DrugForm.reset();
              this.admissionno = this.admissionbind.AdmissionNo;
              this.DrugForm.get("UserName").setValue(localStorage.getItem('LoggedinUser'));
              this.drugTimeToolTip = null;
            }
          );
        }
      });
    } else {
      this.DrugForm.markAllAsTouched();
    }
  }

  //#endregion

  //#region Set ToolTip values
  setDrugToolTip(value) {
    this.drugToolTip = value;
  }
  setDrugTimeToolTip() {
    this.drugTimeToolTip = this.DrugForm.get('Time').value;;
  }
  //#endregion Set ToolTip values

  //#region "Drug"
  getOrderingDrug() {
    if (this.DrugForm.get('Drug').value != null) {
      this.DrugForm.get('Drug').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.postProcedureCareservice.Getdrug(key).then(data => {
                this.Drugg = data;
              })
            }
            else {
              this.Drugg = null;
              this.drugToolTip = null;
            }
          }
          if (key == "" || key == undefined || key == null) {
            this.Drugg = null;
            this.drugToolTip = null;
          }
        })
    }
  }
  //#endregion

  // #region "Physician"
  getOrderingPhysician() {
    if (this.DrugForm.get('orderingPhysician').value != null) {
      this.DrugForm.get('orderingPhysician').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.postProcedureCareservice.GetOrderingphysician(key).then(data => {

                this.orderPhysician = data;
              })
            }
            else {
              this.orderPhysician = null;
            }
          }
        })
    }
  }
  //#endregion

  //#region "Record by"
  getRecordBy() {
    this.postProcedureCareservice.getRecordedBy().then(res => {
      this.recordby = res;

    })
  }
  //#endregion

  //#region "Route"
  getRoute() {
    this.postProcedureCareservice.GetRoute().then(res => {
      this.route = res;

    })
  }
  //#endregion

  //#region "Record During"
  getRecordDuring() {
    this.postProcedureCareservice.GetRecordDuring().then(res => {
      this.recordduring = res;

    })
  }
  //#endregion

  //#region "Grid"
  getgriddata() {   
    this.postProcedureCareservice.GetPostprocedureDrugchart(this.admissionno).then(res => {
      this.griddata = res;
      if (this.griddata.length == 0) {
        this.tableToBeShow = false;
      } else {
        this.tableToBeShow = true;
      }
      if (res.length != 0) {
        if (res[0].DrugSignOffStatus) {
          this.DrugForm.disable();
          this.tableConfig.showDelete = false;
          this.tableConfig.showEdit = false;
          this.isShow = true;
          this.IsSignOff = true;
        }
      }
    })

  }
  //#endregion

  //#region "delete"
  deleterecord(element: any) {
    this.util.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
      (res: any) => {
        if (res == true) {
          this.postProcedureCareservice.Deletedrugchart(element.Item.DrugChartID).then(data => {
            this.getgriddata();

          })
        }
      });
  }
  //#endregion

  //#region "back"
  back() {
    this.router.navigate(['/home/post-procedure-care']);

  }
  //#endregion

  //#region "View record"
  openViewRecord(element: any) {
    this.postProcedureCareservice.getview(element.Item.DrugChartID).then(data => {
      var patientDetail = data;
      const dialogRef = this.dialog.open(DrugchartViewRecordComponent, {
        data: patientDetail,
        height: 'auto',
        width: '75%',
        autoFocus: false,
      });
    });
  }
  //#endregion

  //#region "signOff"
  signOffModel() {
    if (this.DrugForm.get('UserName').value && this.DrugForm.get('Password').value) {

      this.signoffModel.AdmissionId = this.AdmissionID;
      this.signoffModel.ScreenName = "postproceduredrugchart";
      this.signoffModel.UserName = this.DrugForm.get('UserName').value;
      this.signoffModel.Password = this.DrugForm.get('Password').value;
      this.signoffModel.Status = "";

      this.util.showMessage("Delete", "Are you sure want to signoff? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
        (res: any) => {
          if (res == true) {

            this.postProcedureCareservice.signoff(this.signoffModel).then(res => {
              if (res.status == "Post Procedure Drug Chart Signed Off successfully") {

                this.util.showMessage('', res.status, BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                  (res) => {
                    if (res == true) {
                      this.DrugForm.disable();
                      this.isShow = true;
                      this.IsSignOff = true;
                      this.getgriddata();
                      this.DrugForm.get('UserName').setValue(localStorage.getItem('LoggedinUser'));
                    }
                  }
                );
              }
            })
          }
        })
    }else {
      this.util.showMessage('', 'Plese Fill  the username Or Password to Signoff ', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
      );
    
  }
  }
  //#endregion

  //#region "Edit record"
  openEditRecord(element: any) {
    this.postProcedureCareservice.Editdrugchart(element.Item.DrugChartID).then(data => {
      var patientDetail = data;
      const dialogRef = this.dialog.open(DrugCharteditRecordComponent, {
        data: patientDetail,
        height: 'auto',
        width: '75%',
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == "Updated") {
          this.getgriddata();
        }
      })
    });
  }
  //#endregion

  //#region clear
  clear(): void {
    this.DrugForm.reset();
    this.DrugForm.get('UserName').setValue(localStorage.getItem('LoggedinUser'));
    this.drugTimeToolTip = "";
  }
  //#endregion

}

