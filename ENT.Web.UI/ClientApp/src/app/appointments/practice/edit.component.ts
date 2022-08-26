import { AfterContentInit, Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { facilityModel } from "src/app/configuration/Models/facilityModel";
import { UtilService } from "src/app/core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "src/app/ux/bmsmsgbox/bmsmsgbox.component";
import { PracticePartService } from "./practice.service";

@Component({
    selector: "edit-facility",
    templateUrl: "./edit.component.html"
})
export class editFacilityComponent implements OnInit {

    showvalue: string = "Add";

    facilityForm: FormGroup;

    facility: any[];

    FacilityID: number;

    facilityModel: facilityModel = new facilityModel();


    specialitiesValues: any[] = [];

    constructor(public fb: FormBuilder, public dialog: MatDialogRef<editFacilityComponent>, private util: UtilService, public practiceSer: PracticePartService, @Inject(MAT_DIALOG_DATA) public data) { }

    ngOnInit(): void {

        this.facilityForm = this.fb.group({
            FacilityNumber: ["", Validators.required],
            FacilityName: ["", Validators.required],
            AddressOne: ["", Validators.required],
            AddressTwo: [""],
            City: ["", Validators.required],
            State: ["", Validators.required],
            Country: ["", Validators.required],
            PinCode: ["", Validators.required],
            TelePhone: ['', [Validators.required]],
            AlternateTelephone: [""],
            Email: ['', [Validators.required, Validators.pattern("^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$")]],
            Speciality: ["", Validators.required],
        });

        this.fetchAllFacility();
        this.getValuesForFacility();

        if (this.data != null) {
            this.showvalue = "Edit";
            this.FacilityID = this.data.FacilityId;

        }
    }

    getValuesForFacility() {
        if (this.data) {
            this.facilityForm = this.fb.group({
                FacilityNumber: [this.data.FacilityNumber, Validators.required],
                FacilityName: [this.data.FacilityName, Validators.required],
                AddressOne: [this.data.AddressLine1, Validators.required],
                AddressTwo: [this.data.AddressLine2],
                City: [this.data.City, Validators.required],
                State: [this.data.State, Validators.required],
                Country: [this.data.Country, Validators.required],
                PinCode: [this.data.PINCode, Validators.required],
                TelePhone: [this.data.Telephone, [Validators.required]],
                AlternateTelephone: [this.data.AlternativeTelphone],
                Email: [this.data.Email, [Validators.required, Validators.pattern("^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$")]],
                Speciality: [this.Specialities, Validators.required],
            });

        }
    }

    submitFacility() {
        if (this.facilityForm.valid) {
            this.facilityModel = new facilityModel();
            this.facilityModel.FacilityId = this.FacilityID;
            this.facilityModel.FacilityNumber = this.facilityForm.get("FacilityNumber").value;
            this.facilityModel.FacilityName = this.facilityForm.get("FacilityName").value;
            this.facilityModel.AddressLine1 = this.facilityForm.get("AddressOne").value;
            this.facilityModel.AddressLine2 = this.facilityForm.get("AddressTwo").value;
            this.facilityModel.City = this.facilityForm.get("City").value;
            this.facilityModel.State = this.facilityForm.get("State").value;
            this.facilityModel.Country = this.facilityForm.get("Country").value;
            this.facilityModel.PINCode = this.facilityForm.get("PinCode").value;
            this.facilityModel.Telephone = this.facilityForm.get("TelePhone").value;
            this.facilityModel.AlternativeTelphone = this.facilityForm.get("AlternateTelephone").value;
            this.facilityModel.Email = this.facilityForm.get("Email").value;
            this.facilityModel.SpecialityId = this.facilityForm.get("Speciality").value.toString();
            // this.facilityForm.get('Speciality').value.toString();?
            // this.practiceSer.addUpdateFacility(this.facilityForm.value).then(data => {
            //     console.log("DATA ADDED SUCCESSFULLY")
            // })
            this.practiceSer.addUpdateFacility(this.facilityModel).then(data => {
                if (data) {
                    this.util.showMessage("", "Facility details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
                        .then((res) => {
                            this.dialog.close("Updated");
                        }
                        );
                }
            })
        }
        // this.facilityForm.reset();
    }

    fetchAllFacility() {
        this.practiceSer.getAllSpecialities().then(data => {
            this.facility = data;
        })
    }
    cleartheForm() {
        this.facilityForm.reset();
        this.getValuesForFacility()
    }

    dialogClose() {
        this.dialog.close();
    }

    get Specialities() {
        var specialitiesValues = [];
        if (this.data.SpecialityId.includes(',')) {
            for (let a of this.data.SpecialityId.split(',')) {
                specialitiesValues.push(parseInt(a))
            }
        } else {
            specialitiesValues.push(parseInt(this.data.SpecialityId));
        }
        return specialitiesValues
    }
}
