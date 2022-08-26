import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatAutocompleteTrigger, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NewPatientService } from "../../../patient/newPatient.service";
import { ProcedureService } from "../../../pre-procedure-care/procedure.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode, } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { AdmissionService } from "../../../admission/admission.service";
import { preProcedureViewAnesthesiaModel } from "../../models/preProcedureViewAnesthesiaModel";
import { CustomHttpService } from "../../../core/custom-http.service";

@Component({
  selector: "app-preAnethesiaViewComponent",
  templateUrl: "./pre-anethesia-view.component.html",
  styleUrls: ["./pre-anethesia-view.component.css"],
})
export class PreAnethesiaViewComponent implements OnInit {

  //#region Property Declaration

  viewAnesthesiaForm: FormGroup;
  procedureNumber: number = 0;
  BindValue: any;
  getDate: Date;
  getTimeHH: number;
  getTimeMin: number;
  getDateAndTime: Date;
  preProcedureViewAnesthesiaModel: preProcedureViewAnesthesiaModel = new preProcedureViewAnesthesiaModel();
  setScheduleApprovedBynumber: number;
  PhysicianName: any;
  ContinueMedication: string = "No";
  IsShowBtn: boolean;
  ProcedureDateBind: any = "";
  ProcRequestedPhysician: any = "";
  approximateDuration: any = "";
  AnesthesiaFitnessClearance: any = "";
  AnesthesiaFitnessRequiredDesc: any = "No";
  SpecialPreparation: any = "";
  OtherConsults: any = "";
  IsCompleted: boolean;
  IsCancelProcedureDisabled: boolean = true;
  @ViewChild('autoCompletePhysicianInput', { static: false, read: MatAutocompleteTrigger }) trigger1: MatAutocompleteTrigger;
  //#endregion Property Declaration

  //#region Constructor

  constructor(
    public dialogRef: MatDialogRef<PreAnethesiaViewComponent>,
    public newPatientService: NewPatientService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public Procedureservice: ProcedureService,
    private util: UtilService,
    public admissionService: AdmissionService,
    private customHttpSvc: CustomHttpService,
  ) {
  }

  //#endregion Constructor

  //#region ngOnInit

  ngOnInit() {
    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));

    this.viewAnesthesiaForm = this.fb.group({

      CancelReason: [""],
      ProcedureStatus: ["Scheduled", Validators.required],
      ScheduleApprovedBy: ["", Validators.required],
      ProcedureStarttime: ["", Validators.required],
      ProcedureDate: ["", Validators.required],
      UserName: [localStorage.getItem('LoggedinUser'), Validators.required],
      Password: ["", Validators.required],

    });
    this.getPreProcedurePatient();
    this.bindAdmittingPhysician();

    if (this.data.ContinueMedication == true) {
      this.ContinueMedication = "Yes";
    }

  }
  ngAfterViewInit() {
    this.trigger1.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.viewAnesthesiaForm.get('ScheduleApprovedBy').setValue('');
        }
      });
  }
  //#endregion ngOnInit

  //#region Get Admitting Physician Name

  //Get Admitting Physician Name

  bindAdmittingPhysician() {
    if (this.viewAnesthesiaForm.get("ScheduleApprovedBy").value != null) {
      this.viewAnesthesiaForm.get("ScheduleApprovedBy").valueChanges.subscribe((key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.Procedureservice.getOrderPhysician(key).then(data => {
              this.PhysicianName = data
            });
          } else {
            this.PhysicianName = null;
          }
        }
      });
    }
  }

  //#endregion Get Admitting Physician Name

  //#region Get Patient Procedure Details And Set The Values

  // Get Patient Procedure Details And Set The Values
  getPreProcedurePatient() {
    this.Procedureservice.getPreProcedurePatient(this.data.AdmissionID).then((res) => {
      this.BindValue = res;
      if (res.ProcedureStatus == "Completed") {
        this.IsCompleted = true;
      }
      if (res.ProcedureStatus == "Admitted") {
        this.IsShowBtn = true;
      } else {
        this.viewAnesthesiaForm.disable();
      }

      if (this.BindValue) {
        this.procedureNumber = this.BindValue.PreProcedureID;
        this.getDateAndTime = this.BindValue.ProcedureDate;
        this.viewAnesthesiaForm.get("ProcedureDate").setValue(new Date(this.BindValue.ProcedureDate));
        this.viewAnesthesiaForm.get("ProcedureStarttime").setValue(new Date(this.BindValue.ProcedureDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }));
        this.viewAnesthesiaForm.get("ScheduleApprovedBy").setValue(this.BindValue.ProviderName);
        this.setScheduleApprovedBynumber = this.BindValue.ScheduleApprovedBy;

        if (res.ProcedureStatus != "Admitted") {
          this.viewAnesthesiaForm.get("ProcedureStatus").setValue(this.BindValue.ProcedureStatus);
        }

        this.ProcedureDateBind = new Date(this.BindValue.ProcedureDate).toLocaleDateString() + " " + new Date(this.BindValue.ProcedureDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' });
        this.ProcRequestedPhysician = this.BindValue.admissionModel.ProcRequestedPhysician;
        this.approximateDuration = this.BindValue.admissionModel.approximateDuration;
        this.AnesthesiaFitnessClearance = this.BindValue.admissionModel.AnesthesiaFitnessClearance;
        this.SpecialPreparation = this.BindValue.admissionModel.SpecialPreparation;
        this.OtherConsults = this.BindValue.admissionModel.OtherConsults;

        if (this.BindValue.admissionModel.AnesthesiaFitnessRequired) {
          this.AnesthesiaFitnessRequiredDesc = "Yes"
        }

        if (this.BindValue.CancelReason) {
          this.viewAnesthesiaForm.get("CancelReason").setValue(this.BindValue.CancelReason);
          this.IsCancelProcedureDisabled = false;
        }
      }
    });
  }

  //#endregion Get Patient Procedure Details And Set The Values

  //#region Save Function

  // Confirm The Form And  Save

  confirmProcedure() {
    this.sendDateWithTime();

    if (this.viewAnesthesiaForm.valid && this.viewAnesthesiaForm.get('ProcedureStatus').value != "Admitted") {
      this.preProcedureViewAnesthesiaModel = new preProcedureViewAnesthesiaModel();
      this.preProcedureViewAnesthesiaModel.PreProcedureID = this.procedureNumber;
      this.preProcedureViewAnesthesiaModel.AdmissionID = this.data.AdmissionID;
      this.preProcedureViewAnesthesiaModel.ProcedureDate = this.getDateAndTime;
      this.preProcedureViewAnesthesiaModel.ScheduleApprovedBy = this.setScheduleApprovedBynumber;
      this.preProcedureViewAnesthesiaModel.ProcedureStatus = this.viewAnesthesiaForm.get("ProcedureStatus").value;
      this.preProcedureViewAnesthesiaModel.CancelReason = this.viewAnesthesiaForm.get("CancelReason").value;

      this.Procedureservice.UserVerification(this.viewAnesthesiaForm.get("UserName").value, this.viewAnesthesiaForm.get("Password").value).then((res) => {
        if (res[0] == ("Valid User")) {
          this.Procedureservice.AddUpdatePreProcedure(this.preProcedureViewAnesthesiaModel).then((res) => {
            if (res != null && res.PreProcedureID > 0) {
              this.util.showMessage("Success", "Procedure Confirmed Successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
                //  this.viewAnesthesiaForm.reset();
                this.dialogRef.close("update");
              });
            } else {
              this.util.showMessage("Error", "Procedure Not Confirmed ", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox);
            }
          });
        } else {
          this.util.showMessage("Error", res[0], BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox);
        }
      })


    }
  }

  //#endregion Save Function

  //#region Other Function

  // Set Admitting Physician Number
  setScheduleApprovedBy(number: number) {
    this.setScheduleApprovedBynumber = number;
  }

  //Close The Form
  dialogClose(): void {
    this.dialogRef.close();
  }

  //Clear The Form
  clear() {
    this.viewAnesthesiaForm.reset();
    this.getPreProcedurePatient();
    this.viewAnesthesiaForm.get("UserName").setValue(localStorage.getItem('LoggedinUser'));

    if (this.BindValue.ProcedureStatus == "Admitted") {
      this.viewAnesthesiaForm.get("ProcedureStatus").setValue("Scheduled");
    }

  }

  //enable Cancel Procedure Button
  enableCancelProcedure() {
    this.viewAnesthesiaForm.get("CancelReason").valueChanges.subscribe((key: string) => {
      if (key) {
        this.IsCancelProcedureDisabled = false;
      } else {
        this.IsCancelProcedureDisabled = true;
      }

    });

  }

  //cancel Procedure
  cancelProcedureSave() {
    if (this.viewAnesthesiaForm.get("UserName").value && this.viewAnesthesiaForm.get("Password").value) {

      this.Procedureservice.UserVerification(this.viewAnesthesiaForm.get("UserName").value, this.viewAnesthesiaForm.get("Password").value).then((res) => {
        if (res[0] == ("Valid User")) {

          if (this.viewAnesthesiaForm.get("CancelReason").value != "" && this.viewAnesthesiaForm.get("CancelReason").value != null) {
            this.util.showMessage("Cancel", "Are you sure want to Cancel this Procedure?", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then((res) => {
              if (res) {
                this.Procedureservice.sendCancelPreProcedure(this.data.AdmissionID, this.viewAnesthesiaForm.get("CancelReason").value).then((data) => {
                  if (data) {
                    this.util.showMessage("Cancel", "Procedure Cancelled", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
                    this.dialogRef.close("update");
                  }
                });
              }
            });
          }

        } else {
          this.util.showMessage("Error", res[0], BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox);
        }
      });
    } else {
      this.util.showMessage("Error", "Invalid UserName or Password", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox);
      this.viewAnesthesiaForm.get("UserName").markAsTouched();
      this.viewAnesthesiaForm.get("Password").markAsTouched();
    }

  }

  //Set and Bind Date and time
  sendDateWithTime() {
    this.getDate = new Date(this.viewAnesthesiaForm.get("ProcedureDate").value);

    if (this.viewAnesthesiaForm.get("ProcedureDate").value != "") {
      if (this.viewAnesthesiaForm.get("ProcedureStarttime").value.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.viewAnesthesiaForm.get("ProcedureStarttime").value.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        } else {
          this.getTimeHH = parseInt(this.viewAnesthesiaForm.get("ProcedureStarttime").value.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }

      } else if (this.viewAnesthesiaForm.get("ProcedureStarttime").value.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.viewAnesthesiaForm.get("ProcedureStarttime").value.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.viewAnesthesiaForm.get("ProcedureStarttime").value.toString().split(" ")[0].toString().split(":")[0]);
        }
      }
      this.getTimeMin = parseInt(this.viewAnesthesiaForm.get("ProcedureStarttime").value.toString().split(" ")[0].toString().split(":")[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    this.getDateAndTime = this.getDate;
  }

  //#endregion Other Function

}
