import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
//import { specialityMasterModel } from "src/app/configuration/Models/specialityMasterModel";
import { ConfigurationService } from "src/app/configuration/configuration.service";
import { UtilService } from "src/app/core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "src/app/ux/bmsmsgbox/bmsmsgbox.component";
import { AppointmentTypeMasterModel } from "src/app/configuration/Models/appointmenttypeMasterModel";
import { CustomHttpService } from '../../../../core/custom-http.service';

@Component({
  selector: "app-add-appointment-type",
  styleUrls: ["./add-appointment-type.component.css"],
  templateUrl: './add-appointment-type.component.html'
})

export class AddAppointmentType implements OnInit {
   //#region "Property Declaration"

  addAppointmentForm: FormGroup;
  appointmentTypeMasterModel: AppointmentTypeMasterModel = new AppointmentTypeMasterModel();
  AppointmentTypeId: number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
 // specialityMasterModel: specialityMasterModel = new specialityMasterModel();

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<AddAppointmentType>,
    @Inject(MAT_DIALOG_DATA) public data,
    public CustHttp: CustomHttpService,

    public configurationservice: ConfigurationService,
    private util: UtilService,
  ) {

  }
  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

   
    this.addAppointmentForm = this.fb.group({
      AppointmentTypeCode: ["", Validators.required],
      AppointmentTypeDescription: ["", Validators.required],
      AppointmentTypeOrder: ["", Validators.required],
    });
    this.setValuesForForm();
    if (this.data != null) {
      this.AppointmentTypeId = this.data.AppointmentTypeId;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }
  setValuesForForm() {
    if (this.data) {
      this.addAppointmentForm.get('AppointmentTypeCode').setValue(this.data.AppointmentTypeCode);
      this.addAppointmentForm.get('AppointmentTypeDescription').setValue(this.data.AppointmentTypeDescription);
      this.addAppointmentForm.get('AppointmentTypeOrder').setValue(this.data.OrderNo);
    }
  }
  //#region "save New Appointment Data"
  saveNewAppointment() {
    if (this.addAppointmentForm.valid) {
      this.appointmentTypeMasterModel.AppointmentTypeId = 0;
      this.appointmentTypeMasterModel.AppointmentTypeCode = this.addAppointmentForm.get("AppointmentTypeCode").value;
      this.appointmentTypeMasterModel.AppointmentTypeDescription = this.addAppointmentForm.get("AppointmentTypeDescription").value;
      this.appointmentTypeMasterModel.OrderNo = this.addAppointmentForm.get("AppointmentTypeOrder").value;
      this.configurationservice.saveappointment(this.appointmentTypeMasterModel).then((res) => {
          if (res) {
            this.util
              .showMessage(
                "",
                "Appointment details saved successfully",
                BMSMessageBoxColorMode.Information,
                BMSMessageBoxMode.MessageBox
              )
              .then((res) => { });
            this.dialogRef.close("Updated");
          }
        });
    }
  }
  //#endregion

  //#region "clear the Form values"
  cleartheForm() {
    this.addAppointmentForm.reset();
    this.setValuesForForm();
  }

  //To close the Pop up
  dialogClose(): void {
    this.dialogRef.close();
  }



}
