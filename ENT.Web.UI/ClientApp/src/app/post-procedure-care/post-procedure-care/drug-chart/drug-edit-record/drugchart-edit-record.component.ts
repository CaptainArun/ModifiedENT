import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatAutocompleteTrigger} from '@angular/material';
import { DrugchartModel } from '../../../../post-procedure-care/models/DrugchartModel';
import { CustomHttpService } from '../../../../core/custom-http.service';
import { PostProcedureCareService } from '../../../../post-procedure-care/postProcedureCare.service';
import { UtilService } from '../../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../../ux/bmsmsgbox/bmsmsgbox.component'

@Component({
  selector: 'app-drugchart-edit-record',
  templateUrl: './drugchart-edit-record.component.html',
  styleUrls: ['./drugchart-edit-record.component.css']
})

export class DrugCharteditRecordComponent implements OnInit {

  //#region "property declaration"
  @ViewChild('autoDrug', { static: false, read: MatAutocompleteTrigger }) triggerDrug: MatAutocompleteTrigger;
  @ViewChild('autoOrderingPhysician', { static: false, read: MatAutocompleteTrigger }) triggerOrderingPhysician: MatAutocompleteTrigger;
  Drugform: FormGroup;
  drugchartModel: DrugchartModel = new DrugchartModel();
  recordby: any;
  recordduring: any;
  Drugg: any;
  orderPhysician: any;
  route: any;
  isShow: boolean = false;
  AdmissionNo: any="";
  AdmissionDateTime: any="";
  drugToolTip: any="";
  DrugTimeToolTip: any="";
  RecordedDuring: any="";
  RecordedBy: any="";
  //#endregion
  
  //#region "constructor"
  constructor(public dialog: MatDialog, private fb: FormBuilder, 
    private customHttpSvc: CustomHttpService,
    public dialogRef: MatDialogRef<DrugCharteditRecordComponent>, @Inject(MAT_DIALOG_DATA) public data1: any, private util: UtilService,
    public postProcedureCareService: PostProcedureCareService) {      
  }
    //#endregion
  
  //#region "ngOnInit"
  ngOnInit() {

    this.Drugform = this.fb.group({
      
      AdmissionNumber :['',Validators.required],
      AdmissionDatTime: ['',Validators.required],
      RecordedBy: ['',Validators.required],
      RecordedDuring: ['',Validators.required],
      DrugDate: ['',Validators.required],
      DrugName: ['',Validators.required],
      DosageDesc: ['',Validators.required],
      Route:['',Validators.required],
      DrugTime: ['',Validators.required],
      RateOfInfusion: ['',Validators.required],
      Frequency: ['',Validators.required],
      StopMedicationOn: [''],
      OrderingPhysician: ['',Validators.required],
      AdditionalInfo: [''],
    });

   this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));

    this.getRecordBy();
    this.setDrugform();
    this.getRecordDuring();
    this.getOrderingDrug();
    this.getOrderingPhysician();
    this.getRoute();
    this.Drugform.get('AdmissionNumber').disable()
    this.Drugform.get('RecordedDuring').disable()
    this.Drugform.get('RecordedBy').disable()
    this.Drugform.get('AdmissionDatTime').disable()
    this.Drugform.get('DrugTime').disable()
  }
  ngAfterViewInit() {
    this.triggerDrug.panelClosingActions.subscribe(Drug => {
      if (!(Drug && Drug.source)) {
        this.Drugform.get('DrugName').setValue('');
      }
    });
    this.triggerOrderingPhysician.panelClosingActions.subscribe(OrderingPhysician => {
      if (!(OrderingPhysician && OrderingPhysician.source)) {
        this.Drugform.get('OrderingPhysician').setValue('');
      }
    });
  }
      //#endregion
  
  //#region "Set data"
  setDrugform() {  

    this.Drugform.get('AdmissionNumber').setValue(this.data1.AdmissionNo);
    this.AdmissionNo=this.data1.AdmissionNo;
    this.Drugform.get('AdmissionDatTime').setValue(this.data1.AdmissionDateandTime);
    this.AdmissionDateTime=this.data1.AdmissionDateandTime;
    this.Drugform.get('RecordedDuring').setValue(this.data1.recordedDuring);
    this.RecordedDuring=this.data1.recordedDuring;
    this.Drugform.get('RecordedBy').setValue(this.data1.RecordedBy);
    this.RecordedBy=this.data1.RecordedBy;
    this.Drugform.get('DrugDate').setValue(this.data1.DrugDate);
    this.Drugform.get('DrugName').setValue(this.data1.DrugName);
    this.drugToolTip=this.data1.DrugName;
    this.Drugform.get('Route').setValue(this.data1.DrugRoute);
    this.Drugform.get('DosageDesc').setValue(this.data1.DosageDesc);
    this.Drugform.get('DrugTime').setValue(this.data1.DrugTime);
    this.DrugTimeToolTip=this.data1.DrugTime;
    this.Drugform.get('RateOfInfusion').setValue(this.data1.RateOfInfusion);
    this.Drugform.get('Frequency').setValue(this.data1.Frequency);
    this.Drugform.get('OrderingPhysician').setValue(this.data1.OrderingPhysician);
    this.Drugform.get('StopMedicationOn').setValue(this.data1.StopMedicationOn);
    this.Drugform.get('AdditionalInfo').setValue(this.data1.AdditionalInfo);

    if (this.data1.DrugSignOffStatus) {
      this.Drugform.disable();
      this.isShow = true;
    }

  }
   //#endregion
  
   //#region "save"
  save() {
    if(this.Drugform.valid){

    this.drugchartModel.DrugChartID = this.data1.DrugChartID;
    this.drugchartModel.RecordedDuringID = this.data1.RecordedDuringID;
    this.drugchartModel.AdmissionNo = this.Drugform.get('AdmissionNumber').value;
    this.drugchartModel.RecordedBy = this.Drugform.get('RecordedBy').value;
    this.drugchartModel.DrugDate = this.Drugform.get('DrugDate').value;
    this.drugchartModel.DrugName = this.Drugform.get('DrugName').value;
    this.drugchartModel.DrugRoute = this.Drugform.get('Route').value;
    this.drugchartModel.DosageDesc = this.Drugform.get('DosageDesc').value;
    this.drugchartModel.DrugTime = this.Drugform.get('DrugTime').value;
    this.drugchartModel.RateOfInfusion = this.Drugform.get('RateOfInfusion').value;
    this.drugchartModel.Frequency = this.Drugform.get('Frequency').value;
    this.drugchartModel.OrderingPhysician = this.Drugform.get('OrderingPhysician').value;
    this.drugchartModel.StopMedicationOn = this.Drugform.get('StopMedicationOn').value;
    this.drugchartModel.AdditionalInfo = this.Drugform.get('AdditionalInfo').value;
    this.drugchartModel.DrugSignOffDate = new Date();
    this.drugchartModel.ProcedureType = "postprocedure";

    this.postProcedureCareService.addDrugchart(this.drugchartModel).then(data => {      
      if(data){
        this.util.showMessage('', 'Post Procedure Drug Chart saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
          (res) => {
            this.dialogRef.close("Updated");
        });
      }      
    })
    }
  }
   //#endregion

  //#region Set ToolTip values
  setDrugToolTip(value){
    this.drugToolTip=value;
  }
//#endregion Set ToolTip values

  // #region "Physician"
  getOrderingPhysician() {
    if (this.Drugform.get('OrderingPhysician').value != null) {
      this.Drugform.get('OrderingPhysician').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.postProcedureCareService.GetOrderingphysician(key).then(data => {

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
   
  //#region "record by"
  getRecordBy() {
    this.postProcedureCareService.getRecordedBy().then(res => {
      this.recordby = res;
    })
  }
     //#endregion

  //#region "RecordDuring"
  getRecordDuring() {
    this.postProcedureCareService.GetRecordDuring().then(res => {
      this.recordduring = res;
    })
  }
       //#endregion

  //#region "Route"
  getRoute() {
    this.postProcedureCareService.GetRoute().then(res => {
      this.route = res;
    })
  }
 //#endregion
  
  //#region "Drug"
  getOrderingDrug() {    
    this.Drugform.get('DrugName').valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.postProcedureCareService.Getdrug(key).then(data => {
            this.Drugg = data;
          })
        }else {
          this.Drugg = null;
          this.drugToolTip=null;
        }
      }
      if(key == ""|| key == undefined||key == null) {
        this.Drugg = null;
        this.drugToolTip=null;
      }
    })
  }
 //#endregion
  
  //#region "Clear"
  clear(): void {
    this.Drugform.reset();
    this.setDrugform();
  }
 //#endregion
  
  //#region "close"
  dialogClose(): void {
    this.dialogRef.close();
  }
  //#endregion
}
