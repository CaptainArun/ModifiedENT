import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatAutocompleteTrigger } from '@angular/material';
import { DrugchartModel } from '../../../../pre-procedure-care/models/DrugchartModel';
import { CustomHttpService } from '../../../../core/custom-http.service';
import { ProcedureService } from '../../../procedure.service';
import { UtilService } from '../../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../../ux/bmsmsgbox/bmsmsgbox.component'

@Component({
  selector: 'app-drugchart-edit-record',
  templateUrl: './drugchart-edit-record.component.html',
  styleUrls: ['./drugchart-edit-record.component.css']
})

export class DrugCharteditRecordComponent implements OnInit {

  //#region "property declaration"

  drugeditform: FormGroup;
  drugchartModel: DrugchartModel = new DrugchartModel();
  facilityId: number = 0;
  recordby: any;
  recordduring: any;
  drugName: any;
  orderPhysician: any;
  routeData: any;
  IsSignOff: boolean = false;
  AdmissionNo: any = "";
  AdmissionDateTime: any = "";
  drugToolTip: any = "";
  RecordedDuring: any = "";
  RecordedBy: any = "";
  drugTimeToolTip: any = "";

  @ViewChild('autoCompletePhysicianInput', { static: false, read: MatAutocompleteTrigger }) trigger1: MatAutocompleteTrigger;
  //#endregion "property declaration"

  //#region "constructor"

  constructor(public dialog: MatDialog, private fb: FormBuilder,
    private customHttpSvc: CustomHttpService,
    public dialogRef: MatDialogRef<DrugCharteditRecordComponent>, @Inject(MAT_DIALOG_DATA) public data1: any, private util: UtilService,
    public procedureService: ProcedureService) { }

  //#endregion "constructor"

  //#region "ngOnInit"  

  ngOnInit() {
    this.drugeditform = this.fb.group({

      AdmissionNumber: ['', Validators.required],
      AdmissionDateTime: ['', Validators.required],
      RecordedBy: ['', Validators.required],
      RecordedDuring: ['', Validators.required],
      DrugDate: ['', Validators.required],
      DrugName: ['', Validators.required],
      DrugRoute: ['', Validators.required],
      DosageDesc: ['', Validators.required],
      DrugTime: ['', Validators.required],
      RateOfInfusion: ['', Validators.required],
      Frequency: ['', Validators.required],
      StopMedicationOn: [''],
      OrderingPhysician: ['', Validators.required],
      AdditionalInfo: [''],

    });
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getRecordby();
    this.setdrugeditform();
    this.getRecordduring();
    this.getOrderingDrug();
    this.getOrderingPhysician();
    this.getRouteData();
    this.drugeditform.get('AdmissionNumber').disable();
    this.drugeditform.get('RecordedDuring').disable();
    this.drugeditform.get('RecordedBy').disable();
    this.drugeditform.get('AdmissionDateTime').disable();
    //this.drugeditform.get('DrugTime').disable();

    if (this.data1.DrugSignOffStatus) {
      this.drugeditform.disable();
      this.IsSignOff = true;
    }
  }

  ngAfterViewInit() {
    this.trigger1.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.drugeditform.get('OrderingPhysician').setValue('');
        }
      });
  }
  //#endregion "ngOnInit" 

  //#region "set data"
  setdrugeditform() {

    this.drugeditform.get('AdmissionNumber').setValue(this.data1.AdmissionNo);
    this.AdmissionNo = this.data1.AdmissionNo;
    this.drugeditform.get('AdmissionDateTime').setValue(this.data1.AdmissionDateandTime);
    this.AdmissionDateTime = this.data1.AdmissionDateandTime;
    this.drugeditform.get('RecordedDuring').setValue(this.data1.recordedDuring);
    this.RecordedDuring = this.data1.recordedDuring;
    this.drugeditform.get('RecordedBy').setValue(this.data1.RecordedBy);
    this.RecordedBy = this.data1.RecordedBy;
    this.drugeditform.get('DrugDate').setValue(this.data1.DrugDate);
    this.drugeditform.get('DrugName').setValue(this.data1.DrugName);
    this.drugToolTip = this.data1.DrugName;
    this.drugeditform.get('DrugRoute').setValue(this.data1.DrugRoute);
    this.drugeditform.get('DosageDesc').setValue(this.data1.DosageDesc);
    this.drugeditform.get('DrugTime').setValue(this.data1.DrugTime);
    this.drugTimeToolTip = this.data1.DrugTime;
    this.drugeditform.get('RateOfInfusion').setValue(this.data1.RateOfInfusion);
    this.drugeditform.get('Frequency').setValue(this.data1.Frequency);
    this.drugeditform.get('OrderingPhysician').setValue(this.data1.OrderingPhysician);
    this.drugeditform.get('StopMedicationOn').setValue(this.data1.StopMedicationOn);
    this.drugeditform.get('AdditionalInfo').setValue(this.data1.AdditionalInfo);

  }
  //#endregion "set data"

  //#region "Submit"
  save() {
    if (this.drugeditform.valid) {

      this.drugchartModel.DrugChartID = this.data1.DrugChartID;
      this.drugchartModel.RecordedDuringID = this.data1.RecordedDuringID;
      this.drugchartModel.AdmissionNo = this.drugeditform.get('AdmissionNumber').value;
      this.drugchartModel.RecordedBy = this.drugeditform.get('RecordedBy').value;
      this.drugchartModel.DrugDate = this.drugeditform.get('DrugDate').value;
      this.drugchartModel.DrugName = this.drugeditform.get('DrugName').value;
      this.drugchartModel.DrugRoute = this.drugeditform.get('DrugRoute').value;
      this.drugchartModel.DosageDesc = this.drugeditform.get('DosageDesc').value;
      this.drugchartModel.DrugTime = this.drugeditform.get('DrugTime').value;
      this.drugchartModel.RateOfInfusion = this.drugeditform.get('RateOfInfusion').value;
      this.drugchartModel.Frequency = this.drugeditform.get('Frequency').value;
      this.drugchartModel.OrderingPhysician = this.drugeditform.get('OrderingPhysician').value;
      this.drugchartModel.StopMedicationOn = this.drugeditform.get('StopMedicationOn').value;
      this.drugchartModel.AdditionalInfo = this.drugeditform.get('AdditionalInfo').value;
      this.drugchartModel.DrugSignOffDate = new Date();
      this.drugchartModel.ProcedureType = "preprocedure";

      this.procedureService.addpreplan(this.drugchartModel).then(data => {
        if (data != null && data != undefined) {
          this.util.showMessage('', 'Drug Chart saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
            if (res) {
              this.dialogRef.close("Updated");
            }
          });
        }
      });
    }
  }
  //#endregion "Submit"

  //#region Set ToolTip values
  setDrugToolTip(value) {
    this.drugToolTip = value;
  }
  //#endregion Set ToolTip values

  //#region "Get Data From Service"

  //get Record By Value
  getRecordby() {
    this.procedureService.GetProviderNames(this.facilityId).then(res => {
      this.recordby = res;
    });
  }

  //get Route Data
  getRouteData() {
    this.procedureService.getRouteData().then(res => {
      this.routeData = res;
    });
  }

  // get record During Value
  getRecordduring() {
    this.procedureService.GetPreprocedure().then(res => {
      this.recordduring = res;
    });
  }

  // get Order Physician Value 
  getOrderingPhysician() {
    if (this.drugeditform.get('OrderingPhysician').value != null) {
      this.drugeditform.get('OrderingPhysician').valueChanges.subscribe((key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.procedureService.getOrderPhysician(key).then(data => {
              this.orderPhysician = data;
            });
          } else {
            this.orderPhysician = null;
          }
        }
      });
    }
  }

  //get Drug Name
  getOrderingDrug() {
    this.drugeditform.get('DrugName').valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.procedureService.Getdrug(key).then(data => {
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
  //#endregion "Get Data From Service"

  //#region "Clear"
  dialogClose(): void {
    this.drugeditform.reset();
    this.setdrugeditform();
  }
  //#endregion

  //#region "Close"
  close() {
    this.dialogRef.close();
  }
  //#endregion
}
