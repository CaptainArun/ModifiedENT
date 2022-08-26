import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ActivatedRoute, Router } from '@angular/router';
import { CustomHttpService } from "../../../core/custom-http.service";
import { DrugchartModel } from "../../models/DrugchartModel";
import { PostProcedureCareService } from "../../../post-procedure-care/postProcedureCare.service"
import { SignoffModel } from "../../models/signoffModel";

@Component({
  selector: "app-postProcedureAdministrationDrugChart",
  templateUrl: "./administration-drug-chart.component.html",
  styleUrls: ["./administration-drug-chart.component.css"],
})

export class postProcedureAdministrationDrugChart implements OnInit {

  //#region Property Declaration

  Drugdata: any;
  adminDrugChart: FormGroup;
  DrugchartModel: DrugchartModel = new DrugchartModel();
  signoffModel: SignoffModel = new SignoffModel();
  AdmissionID: any;
  PatientID: any;
  AdmissionNo: string = "";
  AdmissionDateAndTime: any = "";
  recordDuring: any;
  recordby: any;
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
    public postProcedureCareService: PostProcedureCareService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }
  //#endregion Constructor

  //#region ngOnInit
  ngOnInit() {

    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));

    this.activatedRoute.params.subscribe(params => {

      this.AdmissionID = params.AdmissionID;
      this.PatientID = params.PatientId;
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

    this.postProcedureCareService.getAdmissionDateAndTime(this.AdmissionID).then((res) => {
      this.DrugAdministrationStatus = res.AdministrationDrugStatus;
      this.AdmissionNo = res.AdmissionNo;
      this.AdmissionDateAndTime = new Date(res.AdmissionDateTime).toLocaleDateString() + " " + new Date(res.AdmissionDateTime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'});
      this.getAdminDrugChart();

    });
  }
  // get Recorded During Record
  getProcedureRecordedDuring() {
    this.postProcedureCareService.GetRecordDuring().then((res) => {
      this.recordDuring = res;
    });

  }

  // get Administrated By Record
  getAdministratedBy(i) {
    const setvalue = <FormArray>this.adminDrugChart.controls['ScheduleItem'];

   // setvalue.controls[i].get('AdministratedBy').valueChanges.subscribe((key: string) => {
    let key = setvalue.controls[i].get('AdministratedBy').value;
    if (key != null && key != "" && key != undefined) {
          if (key.length > 2) {
            this.postProcedureCareService.GetOrderingphysician(key).then(data => {
              if (data.length>0) {
                this.administratedBy = data;
              } else {
                this.administratedBy = [];
                setvalue.controls[i].get('AdministratedByToolTip').setValue("");
                setvalue.controls[i].get('AdministratedByNumber').setValue(0);
                 }
            })
          } else {
            this.administratedBy = [];
            setvalue.controls[i].get('AdministratedByToolTip').setValue("");
            setvalue.controls[i].get('AdministratedByNumber').setValue(0);
          }
        }
        else {
          this.administratedBy = [];
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

  toValidatePhysician(i) {
    const setvalue = <FormArray>this.adminDrugChart.controls['ScheduleItem'];
    if (!(setvalue.controls[i].get('AdministratedByNumber').value > 0)) {
      setvalue.controls[i].get('AdministratedBy').setValue('');
    }
  }
  // get Provider Name
  getProviderName() {
    this.postProcedureCareService.getRecordedBy().then(res => {
      this.recordby = res;

    })
  }

  // get Table Data & Set values in the Respective Fields 
  getAdminDrugChart() {
    this.postProcedureCareService.GetPostprocedureDrugchart(this.AdmissionNo).then((res) => {

      this.Drugdata = res;
      if (res.length != 0) {

        this.IsTableHasRecord = true;
        this.adminDrugChart.get("RecordedDuringID").setValue(res[0].RecordedDuringID);
        this.adminDrugChart.get("RecordedBy").setValue(res[0].RecordedBy);
        {

          for (let i = 0; i < this.Drugdata.length; i++) {

            this.scheduleItemsControl.push(this.scheduleDynamicControls());
            const setvalue = <FormArray>this.adminDrugChart.controls['ScheduleItem'];

            setvalue.controls[i].get('DrugDate').setValue(new Date(this.Drugdata[i].DrugDate).toLocaleDateString() + '-' + this.Drugdata[i].DrugTime);
            setvalue.controls[i].get('DrugName').setValue(this.Drugdata[i].DrugName);
            setvalue.controls[i].get('DosageDesc').setValue(this.Drugdata[i].DosageDesc);
            setvalue.controls[i].get('DrugRoute').setValue(this.Drugdata[i].DrugRoute);
            setvalue.controls[i].get('Frequency').setValue(this.Drugdata[i].Frequency);
            setvalue.controls[i].get('RecordedBy').setValue(this.Drugdata[i].RecordedBy);

          //  if (this.Drugdata[i].AdministratedByName && this.Drugdata[i].AdministratedRemarks) {
            setvalue.controls[i].get('AdministratedBy').setValue(this.Drugdata[i].AdministratedByName ? this.Drugdata[i].AdministratedByName:"");
            setvalue.controls[i].get('AdministratedByToolTip').setValue(this.Drugdata[i].AdministratedByName ? this.Drugdata[i].AdministratedByName:"");
            setvalue.controls[i].get('AdministratedByNumber').setValue(this.Drugdata[i].AdministratedBy ? this.Drugdata[i].AdministratedBy:0);
            setvalue.controls[i].get('AdministratedRemarks').setValue(this.Drugdata[i].AdministratedRemarks ? this.Drugdata[i].AdministratedRemarks:"");
           // }

            this.scheduleItemsControl.removeAt(this.Drugdata.length);
          }
        }

        if (res[0].AdminDrugSignOffStatus == true) {
          this.adminDrugChart.disable();
          this.IsSignOff = true;
        }

      } else {
        this.scheduleItemsControl.removeAt(0);
        this.IsTableHasRecord = false;
      }

    });
  }
  //#endregion  Get Data 

  //#region  back navigation
  back() {

    this.router.navigate(['/home/post-procedure-care']);

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
        this.postProcedureCareService.sendDrugAdministrationChartCollection(this.DrugchartModelCollection).then(data => {

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
    if (this.adminDrugChart.get('UserName').value != "" && this.adminDrugChart.get('Password').value != "") {

      this.util.showMessage("SignOff", "Are you sure want to SignOff?", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then((res) => {
        if (res) {

          this.signoffModel.AdmissionId = this.AdmissionID;
          this.signoffModel.ScreenName = "postprocedureadmindrugchart";
          this.signoffModel.UserName = this.adminDrugChart.get('UserName').value;
          this.signoffModel.Password = this.adminDrugChart.get('Password').value;
          this.postProcedureCareService.signoff(this.signoffModel).then((res) => {

            if (res.status == "Post Procedure Administration Drug Chart Signed Off successfully") {

              this.util.showMessage('', res.status, BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                (res) => {
                  if (res) {
                    this.adminDrugChart.disable();
                    this.IsSignOff = true;
                    this.postProcedureCareService.getAdmissionDateAndTime(this.AdmissionID).then((res) => {
                      this.DrugAdministrationStatus = res.AdministrationDrugStatus;
                    })

                  }
                });
            }
          });
        }
      });
    }else {
      this.util.showMessage('', 'Plese Fill  the username Or Password to Signoff ', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
      );
    }
  }
  //#endregion  Sign Off
}






