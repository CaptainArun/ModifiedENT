import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ProcedureService } from "../../../pre-procedure-care/procedure.service";
import { ActivatedRoute, Router } from '@angular/router';
import { CustomHttpService } from "../../../core/custom-http.service";
import { DrugchartModel } from "../../models/DrugchartModel";
import { ProcedureCareSignOffModel } from "../../models/preProcedureCareSignOffModel";

//import { MatPaginator } from '@angular/material';

@Component({
  selector: "administration-drug-chart",
  templateUrl: "./administration-drug-chart.component.html",
  styleUrls: ["./administration-drug-chart.component.css"],
})

export class administrationDrugChart implements OnInit {

  // @ViewChild(MatPaginator, { static: true }) pager: MatPaginator;
  // selectAll: boolean = false;
  // filteredData: Array<any> = [];
  // currentData: Array<any> = [];
  // public pageSize: number = 10;
  // totalRows: number = 0;

  //#region Property Declaration

  Drugdata: any;
  adminDrugChart: FormGroup;
  DrugchartModel: DrugchartModel = new DrugchartModel();
  ProcedureCareSignOffModel: ProcedureCareSignOffModel = new ProcedureCareSignOffModel();
  AdmissionID: any;
  PatientID: any;
  AdmissionNo: string = "";
  AdmissionDateAndTime: any = "";
  recordDuring: any;
  recordby: any;
  facilityId: number = 0;
  administratedBy: any;
  drugs: any;
  DrugchartModelCollection: any = [];
  DrugAdministrationStatus: any = "";
  IsTableHasRecord: boolean = false;
  IsSignOff: boolean = false;

  //#endregion Property Declaration

  //#region Constructor
  constructor(
    private customHttpSvc: CustomHttpService,
    private util: UtilService,
    public fb: FormBuilder,
    public procedureService: ProcedureService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }
  //#endregion Constructor

  //#region ngOnInit
  ngOnInit() {
    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));

    this.activatedRoute.params.subscribe(params => {

      this.AdmissionID = params.AdmissionID;
      this.PatientID = params.patientid;

    });
    this.adminDrugChart = this.fb.group({

      RecordedDuringID: ["", Validators.required],
      RecordedBy: ["", Validators.required],
      UserName: [localStorage.getItem('LoggedinUser')],
      Password: [""],

      ScheduleItem: this.fb.array([this.scheduleDynamicControls()])

    });
    this.getAdmissionDateAndTime();
    this.getProviderName();
    this.getProcedureRecordedDuring();
  }
  //#endregion ngOnInit

  // onPageChange(page: any) {

  //   this.currentData = [];
  //   this.pageSize = page.pageSize;
  //   let pageNo: number = page.pageIndex;
  //   let startData: number = (pageNo) * page.pageSize;
  //   let endData: number = (pageNo + 1) * page.pageSize;
  //   // this.totalRows = this.filteredData.length;
  //  // this.currentData = this.filteredData.slice(startData, endData);
  //   this.selectAll = false;
  //   this.SetValues(startData, endData);
  // }


  //#region DynamicControls
  scheduleDynamicControls() {
    return this.fb.group({

      DrugDate: [""],
      DrugName: [""],
      DosageDesc: [""],
      DrugRoute: [""],
      Frequency: [""],
      RecordedBy: [""],
      AdministratedByNumber: [""],
      AdministratedBy: [""],
      AdministratedByToolTip: [""],
      AdministratedRemarks: [""],

    });
  }

  get scheduleItemsControl() {
    return <FormArray>this.adminDrugChart.get('ScheduleItem');
  }

  getDynamicControl() {
    return <FormArray>this.adminDrugChart.get('ScheduleItem');
  }

  //#endregion DynamicControls

  //#region  Get Data 

  //get Admission Date And Time & Admission Number
  getAdmissionDateAndTime() {

    this.procedureService.getAdmissionDateAndTime(this.AdmissionID).then((res) => {

      this.DrugAdministrationStatus = res.AdministrationDrugStatus;
      this.AdmissionNo = res.AdmissionNo;
      this.AdmissionDateAndTime = new Date(res.AdmissionDateTime).toLocaleDateString() + " " + new Date(res.AdmissionDateTime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'});
      this.getAdminDrugChart();

    });
  }

  //set DrugAdministrationStatus
  getDrugAdministrationStatus() {

    this.procedureService.getAdmissionDateAndTime(this.AdmissionID).then((res) => {

      this.DrugAdministrationStatus = res.AdministrationDrugStatus;

    });
  }
  // get Recorded During Record
  getProcedureRecordedDuring() {
    this.procedureService.getProcedureRecordedDuring().then((res) => {
      this.recordDuring = res;
    });

  }

  // get Administrated By Record
  getAdministratedBy(i) {
    const setvalue = <FormArray>this.adminDrugChart.controls['ScheduleItem'];

    //setvalue.controls[i].get('AdministratedBy').valueChanges.subscribe(      (key: string) => {
    let key = setvalue.controls[i].get('AdministratedBy').value;
    if (key != null && key != undefined && key != "") {
      if (key.length > 2) {
        this.procedureService.getAdministratedBy(key).then(data => {
          if (data.length > 0) {
            this.administratedBy = data;
          } else {
            this.administratedBy = null;
            setvalue.controls[i].get('AdministratedByToolTip').setValue("");
            setvalue.controls[i].get('AdministratedByNumber').setValue(0);
          }
        })
      } else {
        this.administratedBy = null;
        setvalue.controls[i].get('AdministratedByToolTip').setValue("");
        setvalue.controls[i].get('AdministratedByNumber').setValue(0);
      }
    }
    else {
      this.administratedBy = null;
      setvalue.controls[i].get('AdministratedByToolTip').setValue("");
      setvalue.controls[i].get('AdministratedByNumber').setValue(0);
    }
    //});
  }

  // set Administrated By Number value
  setAdministratedByNumber(i, value) {
    const setvalue = <FormArray>this.adminDrugChart.controls['ScheduleItem'];
    setvalue.controls[i].get('AdministratedByNumber').setValue(value.ProviderID);
    setvalue.controls[i].get('AdministratedByToolTip').setValue(value.ProviderName);
  }

  // get Provider Name
  getProviderName() {
    this.procedureService.GetProviderNames(this.facilityId).then(res => {
      this.recordby = res;
    })
  }

  // get Table Data & Set values in the Respective Fields 
  getAdminDrugChart() {
    this.procedureService.getAdminDrugChart(this.AdmissionNo).then((res) => {
      this.Drugdata = res;

      if (res.length != 0) {
        this.IsTableHasRecord = true;
        this.adminDrugChart.get("RecordedDuringID").setValue(res[0].RecordedDuringID);
        this.adminDrugChart.get("RecordedBy").setValue(res[0].RecordedBy);

        for (let i = 0; i < this.Drugdata.length; i++) {

          this.scheduleItemsControl.push(this.scheduleDynamicControls());
          const setvalue = <FormArray>this.adminDrugChart.controls['ScheduleItem'];

          setvalue.controls[i].get('DrugDate').setValue(new Date(this.Drugdata[i].DrugDate).toLocaleDateString() + '-' + this.Drugdata[i].DrugTime);
          setvalue.controls[i].get('DrugName').setValue(this.Drugdata[i].DrugName);
          setvalue.controls[i].get('DosageDesc').setValue(this.Drugdata[i].DosageDesc);
          setvalue.controls[i].get('DrugRoute').setValue(this.Drugdata[i].DrugRoute);
          setvalue.controls[i].get('Frequency').setValue(this.Drugdata[i].Frequency);
          setvalue.controls[i].get('RecordedBy').setValue(this.Drugdata[i].RecordedBy);


          setvalue.controls[i].get('AdministratedBy').setValue(this.Drugdata[i].AdministratedByName ? this.Drugdata[i].AdministratedByName : "");
          setvalue.controls[i].get('AdministratedByToolTip').setValue(this.Drugdata[i].AdministratedByName ? this.Drugdata[i].AdministratedByName : "");
          setvalue.controls[i].get('AdministratedByNumber').setValue(this.Drugdata[i].AdministratedBy ? this.Drugdata[i].AdministratedBy : 0);
          setvalue.controls[i].get('AdministratedRemarks').setValue(this.Drugdata[i].AdministratedRemarks ? this.Drugdata[i].AdministratedRemarks : "");


          this.scheduleItemsControl.removeAt(this.Drugdata.length);

        }

        //this.currentData = this.getDynamicControl().controls;

        // if (true) {
        //   this.totalRows = this.Drugdata.length;
        //   // this.currentData = this.filteredData.slice(0, this.pageSize);
        //   //  this.showPager = this.filteredData.length > 0 ? true : false;
        //   if (this.pager) { this.pager.firstPage(); }
        // }

        if (res[0].AdminDrugSignOffStatus == true) {
          this.adminDrugChart.disable();
          this.IsSignOff = true;
        }
      }
      else {
        this.scheduleItemsControl.removeAt(0);
        this.IsTableHasRecord = false;
      }

    });

  }
  //#endregion  Get Data 

  //#region  back navigation
  back() {
    this.router.navigate(['/home/procedure/pre-procedure-list']);
  }
  //#endregion  back navigation

  //#region  Save Function

  //save Collection of Data
  saveDrug() {

    const setvalue = <FormArray>this.adminDrugChart.controls['ScheduleItem'];

    if (this.adminDrugChart.controls['ScheduleItem'].valid) {

      for (let i = 0; i < setvalue.length; i++) {

        this.drugs = this.Drugdata[i];

        this.DrugchartModel = new DrugchartModel();
        this.DrugchartModel.DrugChartID = this.drugs.DrugChartID;
        this.DrugchartModel.PatientID = this.drugs.PatientID;
        this.DrugchartModel.RecordedDuringID = this.adminDrugChart.get("RecordedDuringID").value;
        this.DrugchartModel.RecordedBy = this.adminDrugChart.get("RecordedBy").value;
        this.DrugchartModel.AdmissionNo = this.drugs.AdmissionNo;
        this.DrugchartModel.DrugDate = new Date(this.drugs.DrugDate);
        this.DrugchartModel.DrugName = this.drugs.DrugName;
        this.DrugchartModel.DrugRoute = this.drugs.DrugRoute;
        this.DrugchartModel.DosageDesc = this.drugs.DosageDesc;
        this.DrugchartModel.DrugTime = this.drugs.DrugTime;
        this.DrugchartModel.RateOfInfusion = this.drugs.RateOfInfusion;
        this.DrugchartModel.Frequency = this.drugs.Frequency;
        this.DrugchartModel.OrderingPhysician = this.drugs.OrderingPhysician;
        this.DrugchartModel.StopMedicationOn = this.drugs.StopMedicationOn;
        this.DrugchartModel.AdditionalInfo = this.drugs.AdditionalInfo;
        this.DrugchartModel.ProcedureType = this.drugs.ProcedureType;
        this.DrugchartModel.DrugSignOffDate = new Date();
        this.DrugchartModel.AdministratedBy = setvalue.controls[i].get('AdministratedByNumber').value;
        this.DrugchartModel.AdministratedRemarks = setvalue.controls[i].get("AdministratedRemarks").value;

        this.DrugchartModelCollection.push(this.DrugchartModel);

      }

      if (this.DrugchartModelCollection.length != 0) {
        this.procedureService.sendDrugAdministrationChartCollection(this.DrugchartModelCollection).then(data => {

          if (data != null) {
            this.util.showMessage('', 'Drug Administration Chart Details saved successfully',
              BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                (res) => {
                  this.getAdminDrugChart();
                  this.DrugchartModelCollection = [];
                }
              );
          }
        });
      }
    }
  }

  //#endregion  Save Function

  //#region  Clear Function
  ClearTheForm() {
    this.adminDrugChart.reset();
    this.getAdminDrugChart();
    this.adminDrugChart.get('UserName').setValue(localStorage.getItem('LoggedinUser'));
  }
  //#endregion  Clear Function

  //#region  Sign Off
  ProcedureSignOff() {

    if (this.adminDrugChart.get('UserName').value && this.adminDrugChart.get('Password').value) {
      this.util.showMessage("SignOff", "Are you sure want to SignOff?", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then((res) => {
        if (res) {
          this.ProcedureCareSignOffModel.AdmissionId = this.AdmissionID;
          this.ProcedureCareSignOffModel.ScreenName = "preprocedureadmindrugchart";
          this.ProcedureCareSignOffModel.UserName = this.adminDrugChart.get('UserName').value;
          this.ProcedureCareSignOffModel.Password = this.adminDrugChart.get('Password').value;

          this.procedureService.sendSignOffModel(this.ProcedureCareSignOffModel).then((res) => {
            if (res.status == "Pre Procedure Administration Drug Chart Signed Off successfully") {
              this.util.showMessage('Success', res.status, BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
                if (res) {
                  this.adminDrugChart.disable();
                  this.IsSignOff = true;
                  this.getDrugAdministrationStatus();
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

  toValidatePhysician(i) {
    const setvalue = <FormArray>this.adminDrugChart.controls['ScheduleItem'];
    if (!(setvalue.controls[i].get('AdministratedByNumber').value > 0)) {
      setvalue.controls[i].get('AdministratedBy').setValue('');
    }

  }
  //#endregion  Sign Off
}
