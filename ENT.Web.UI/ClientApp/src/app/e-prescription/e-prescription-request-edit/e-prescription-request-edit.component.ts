import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { CustomHttpService } from '../../core/custom-http.service';
import { MedicationModel } from '../models/medicationModel';
import { UtilService } from '../../core/util.service';
import { EPrescriptionService } from '../ePrescription.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
    selector: 'e-prescription-request-edit',
    templateUrl: './e-prescription-request-edit.component.html',
    styleUrls: ['./e-prescription-request-edit.component.css']
})

export class EPrescriptionRequestEditComponent implements OnInit {
    ePrescriptionRequestEditForm: FormGroup;
    medicationRequestModel: MedicationModel = new MedicationModel();
    hold: boolean = false;
    discontinue: boolean = false;
    notes: boolean = false;
    refill: boolean = false;
    medicationNumber: any;
    visitDateTime: any;
    drugName: any;
    routeName: any;
    diagnosisName: any;
    itemDrugId: number;
    itemDiagnosisId: number;
    patientSearch: any;
    patientListId: any;
    patientId: any;
    physicianName: any;
    physicianListId: number;
    route: any;
    itemNameList = [];
    diagnosisNameList = [];

    constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<EPrescriptionRequestEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private ePrescriptionSvc: EPrescriptionService, private util: UtilService, public customHttp: CustomHttpService) { }

    ngOnInit() {
        this.ePrescriptionRequestEditForm = this.fb.group({
            Start: [false, ''],
            Hold: [false, ''],
            HoldMedication: [''],
            Discontinue: [false, ''],
            DiscontinueDrugs: [''],
            Notes: [false, ''],
            NotesPharmacist: [''],
            Refill: [false, ''],
            RefillNumber: [''],
            Date: [''],
            RefillNotes: [''],
            Username: [''],
            Password: [''],
            rows: this.fb.array([this.ePrescription()])
        });
        this.customHttp.getDbName(localStorage.getItem('DatabaseName'));
        this.setePrescriptionData();
        this.getMedicationNumber();
        this.bindRoute();
    }

    ePrescription(): FormGroup {
        return this.fb.group({
            ItemDrugName: ['', Validators.required],
            Route: [null, Validators.required],
            routeTooltip: [''],
            Diagnosis: ['', Validators.required],
            Qty: ['', Validators.required],
            Days: ['', Validators.required],
            MedicationTime: new FormGroup(
                {
                    Morning: new FormControl(false),
                    Brunch: new FormControl(false),
                    Noon: new FormControl(false),
                    Evening: new FormControl(false),
                    Night: new FormControl(false),
                },
                this.CheckboxValidator()
            ),
            MedicationIntake: new FormGroup(
                {
                    Before: new FormControl(false),
                    After: new FormControl(false),
                },
                this.CheckboxValidator()
            ),
            MedicationStatus: ['', Validators.required],
            SIG: ['']
        });
    }

    CheckboxValidator(minRequired = 1): ValidatorFn {
        return function validate(formGroup: FormGroup) {
            let checked = 0;

            Object.keys(formGroup.controls).forEach(key => {
                let control = formGroup.controls[key];
                if (control.value === true) {
                    checked++;
                }
            });

            if (checked < minRequired) {
                return {
                    requireOneCheckboxToBeChecked: true,
                };
            }
            return null;
        };
    }

    get ePrescriptionDynamic() {
        return <FormArray>this.ePrescriptionRequestEditForm.get('rows');
    }

    getMedicationNumber() {
        this.ePrescriptionSvc.getMedicationNumber().then(res => {
            this.medicationNumber = res;
        });
    }

    getDrugList(index) {
        const control = <FormArray>this.ePrescriptionRequestEditForm.controls['rows'];
        let key = control.controls[index].get('ItemDrugName').value;
        if (key != null && key.length > 2) {
            this.ePrescriptionSvc.getDrugCodeforEPrescription(key).then(data => {
                this.drugName = data;
            });
        }
        else {
            this.drugName = null;
        }
    }

    DrugId(DrugCodeID, NDCCode, Description, index) {
        this.itemDrugId = DrugCodeID;
        this.itemNameList[index] = NDCCode + '/' + Description;
    }

    autoResetDrug(value, index) {
        const items = <FormArray>this.ePrescriptionRequestEditForm.controls['rows'];
        if (!this.itemNameList.includes(value)) {
            items.controls[index].get('ItemDrugName').setValue('');
        }
    }

    bindRoute() {
        this.ePrescriptionSvc.getMedicationRouteforEPrescription().then(data => {
            this.routeName = data;
        });
    }

    setRouteTooltip(index) {
        const arr = <FormArray>this.ePrescriptionRequestEditForm.controls['rows'];
        this.route = arr.controls[index].get('Route').value;
        for (const option of this.routeName) {
            if (this.route == option.RouteCode) {
                arr.controls[index].get('routeTooltip').setValue(option.RouteDescription);
            }
        }
    }

    getDiagnosisList(index) {
        const control = <FormArray>this.ePrescriptionRequestEditForm.controls['rows'];
        let key = control.controls[index].get('Diagnosis').value;
        if (key != null && key.length > 2) {
            this.ePrescriptionSvc.getDiagnosisCodeforEPrescription(key).then(data => {
                this.diagnosisName = data;
            });
        }
        else {
            this.diagnosisName = null;
        }
    }

    DiagnosisId(DiagnosisCodeID, ICDCode, Description, index) {
        this.itemDiagnosisId = DiagnosisCodeID;
        this.diagnosisNameList[index] = ICDCode + '-' + Description;
    }

    autoResetDiagnosis(value, index) {
        const items = <FormArray>this.ePrescriptionRequestEditForm.controls['rows'];
        if (!this.diagnosisNameList.includes(value)) {
            items.controls[index].get('Diagnosis').setValue('');
        }
    }

    isHold(event) {
        this.hold = event.checked;
        if (this.hold == false) {
            this.resetHold();
        }
    }

    resetHold() {
        this.ePrescriptionRequestEditForm.get('HoldMedication').reset();
    }

    isDiscontinue(event) {
        this.discontinue = event.checked;
        if (this.discontinue == false) {
            this.resetDiscontinue();
        }
    }

    resetDiscontinue() {
        this.ePrescriptionRequestEditForm.get('DiscontinueDrugs').reset();
    }

    isNotes(event) {
        this.notes = event.checked;
        if (this.notes == false) {
            this.resetNotes();
        }
    }

    resetNotes() {
        this.ePrescriptionRequestEditForm.get('NotesPharmacist').reset();
    }

    isRefill(event) {
        this.refill = event.checked;
        if (this.refill == false) {
            this.resetRefill();
        }
    }

    resetRefill() {
        this.ePrescriptionRequestEditForm.get('RefillNumber').reset();
        this.ePrescriptionRequestEditForm.get('Date').reset();
        this.ePrescriptionRequestEditForm.get('RefillNotes').reset();
    }

    onAddRow() {
        this.ePrescriptionDynamic.push(this.ePrescription());
        this.drugName = null;
        this.diagnosisName = null;
    }

    onRemoveRow(rowIndex: number) {
        this.ePrescriptionDynamic.removeAt(rowIndex);
    }

    setePrescriptionData() {
        if (this.data.record != undefined && this.data.record != null) {

            for (let i = 0; i < this.data.record.medicationRequestItems.length; i++) {
                this.ePrescriptionDynamic.push(this.ePrescription());
                const control = <FormArray>this.ePrescriptionRequestEditForm.controls['rows'];
                control.controls[i].get('ItemDrugName').setValue(this.data.record.medicationRequestItems[i].DrugName);
                this.itemNameList[i] = this.data.record.medicationRequestItems[i].DrugName;
                control.controls[i].get('Route').setValue(this.data.record.medicationRequestItems[i].MedicationRouteCode);
                for (const option of this.data.route) {
                    if (control.controls[i].get('Route').value == option.RouteCode) {
                        control.controls[i].get('routeTooltip').setValue(option.RouteDescription);
                    }
                }
                control.controls[i].get('Diagnosis').setValue(this.data.record.medicationRequestItems[i].ICDCode);
                this.diagnosisNameList[i] = this.data.record.medicationRequestItems[i].ICDCode;
                control.controls[i].get('Qty').setValue(this.data.record.medicationRequestItems[i].TotalQuantity);
                control.controls[i].get('Days').setValue(this.data.record.medicationRequestItems[i].NoOfDays);
                control.controls[i].get('MedicationTime').get('Morning').setValue(this.data.record.medicationRequestItems[i].Morning);
                control.controls[i].get('MedicationTime').get('Brunch').setValue(this.data.record.medicationRequestItems[i].Brunch);
                control.controls[i].get('MedicationTime').get('Noon').setValue(this.data.record.medicationRequestItems[i].Noon);
                control.controls[i].get('MedicationTime').get('Evening').setValue(this.data.record.medicationRequestItems[i].Evening);
                control.controls[i].get('MedicationTime').get('Night').setValue(this.data.record.medicationRequestItems[i].Night);
                control.controls[i].get('MedicationIntake').get('Before').setValue(this.data.record.medicationRequestItems[i].Before);
                control.controls[i].get('MedicationIntake').get('After').setValue(this.data.record.medicationRequestItems[i].After);
                control.controls[i].get('SIG').setValue(this.data.record.medicationRequestItems[i].SIG);
                if (this.data.record.medicationRequestItems[i].Start == true) {
                    control.controls[i].get('MedicationStatus').setValue("start");
                }
                if (this.data.record.medicationRequestItems[i].Hold == true) {
                    control.controls[i].get('MedicationStatus').setValue("hold");
                }
                if (this.data.record.medicationRequestItems[i].Continued == true) {
                    control.controls[i].get('MedicationStatus').setValue("continue");
                }
                if (this.data.record.medicationRequestItems[i].DisContinue == true) {
                    control.controls[i].get('MedicationStatus').setValue("discontinue");
                }
                this.ePrescriptionDynamic.removeAt(this.data.record.medicationRequestItems.length);
            }
            this.ePrescriptionRequestEditForm.get('Start').setValue(this.data.record.TakeRegularMedication);
            this.ePrescriptionRequestEditForm.get('Hold').setValue(this.data.record.IsHoldRegularMedication);
            if (this.data.record.IsHoldRegularMedication != false) {
                this.hold = true;
            }
            this.ePrescriptionRequestEditForm.get('HoldMedication').setValue(this.data.record.HoldRegularMedicationNotes);
            this.ePrescriptionRequestEditForm.get('Discontinue').setValue(this.data.record.IsDiscontinueDrug);
            if (this.data.record.IsDiscontinueDrug != false) {
                this.discontinue = true;
            }
            this.ePrescriptionRequestEditForm.get('DiscontinueDrugs').setValue(this.data.record.DiscontinueDrugNotes);
            this.ePrescriptionRequestEditForm.get('Notes').setValue(this.data.record.IsPharmacist);
            if (this.data.record.IsPharmacist != false) {
                this.notes = true;
            }
            this.ePrescriptionRequestEditForm.get('NotesPharmacist').setValue(this.data.record.PharmacistNotes);
            this.ePrescriptionRequestEditForm.get('Refill').setValue(this.data.record.IsRefill);
            if (this.data.record.IsRefill != false) {
                this.refill = true;
            }
            this.ePrescriptionRequestEditForm.get('RefillNumber').setValue(this.data.record.RefillCount);
            this.ePrescriptionRequestEditForm.get('Date').setValue(this.data.record.RefillDate);
            this.ePrescriptionRequestEditForm.get('RefillNotes').setValue(this.data.record.RefillNotes);
        }
    }

    confirmRequest() {
        if (this.ePrescriptionRequestEditForm.valid && this.ePrescriptionRequestEditForm.controls['rows'].valid) {
            this.medicationRequestModel.medicationItems = [];
            const control = <FormArray>this.ePrescriptionRequestEditForm.controls['rows'];
            for (let row of control.controls) {
                this.medicationRequestModel.medicationItems.push({
                    MedicationItemsId: 0,
                    MedicationID: 0,
                    DrugName: row.get('ItemDrugName').value,
                    MedicationRouteCode: row.get('Route').value,
                    ICDCode: row.get('Diagnosis').value,
                    TotalQuantity: row.get('Qty').value,
                    NoOfDays: row.get('Days').value,
                    Morning: row.get('MedicationTime').get('Morning').value,
                    Brunch: row.get('MedicationTime').get('Brunch').value,
                    Noon: row.get('MedicationTime').get('Noon').value,
                    Evening: row.get('MedicationTime').get('Evening').value,
                    Night: row.get('MedicationTime').get('Night').value,
                    Before: row.get('MedicationIntake').get('Before').value,
                    After: row.get('MedicationIntake').get('After').value,
                    Start: row.get('MedicationStatus').value == "start" ? true : false,
                    Hold: row.get('MedicationStatus').value == "hold" ? true : false,
                    Continued: row.get('MedicationStatus').value == "continue" ? true : false,
                    DisContinue: row.get('MedicationStatus').value == "discontinue" ? true : false,
                    SIG: row.get('SIG').value
                });
            }
            this.medicationRequestModel.MedicationId = 0;
            this.medicationRequestModel.MedicationNumber = this.medicationNumber[0];
            this.medicationRequestModel.VisitID = this.data.record.VisitID;
            this.medicationRequestModel.AdmissionID = this.data.record.AdmissionID;
            this.medicationRequestModel.MedicationPhysician = this.data.record.providerId;
            this.medicationRequestModel.TakeRegularMedication = this.ePrescriptionRequestEditForm.get('Start').value;
            this.medicationRequestModel.IsHoldRegularMedication = this.ePrescriptionRequestEditForm.get('Hold').value;
            this.medicationRequestModel.HoldRegularMedicationNotes = this.ePrescriptionRequestEditForm.get('HoldMedication').value;
            this.medicationRequestModel.IsDiscontinueDrug = this.ePrescriptionRequestEditForm.get('Discontinue').value;
            this.medicationRequestModel.DiscontinueDrugNotes = this.ePrescriptionRequestEditForm.get('DiscontinueDrugs').value;
            this.medicationRequestModel.IsPharmacist = this.ePrescriptionRequestEditForm.get('Notes').value;
            this.medicationRequestModel.PharmacistNotes = this.ePrescriptionRequestEditForm.get('NotesPharmacist').value;
            this.medicationRequestModel.IsRefill = this.ePrescriptionRequestEditForm.get('Refill').value;
            this.medicationRequestModel.RefillCount = this.ePrescriptionRequestEditForm.get('RefillNumber').value;
            this.medicationRequestModel.RefillDate = this.ePrescriptionRequestEditForm.get('Date').value;
            this.medicationRequestModel.RefillNotes = this.ePrescriptionRequestEditForm.get('RefillNotes').value;
            this.medicationRequestModel.UserName = this.ePrescriptionRequestEditForm.get('Username').value;
            this.medicationRequestModel.Password = this.ePrescriptionRequestEditForm.get('Password').value;

            this.ePrescriptionSvc.SaveMedicationforEPrescription(this.medicationRequestModel).then(res => {
                if (res.ValidationStatus.toLowerCase().trim() == "valid user") {
                    this.ePrescriptionSvc.confirmEPrescriptionRequest(this.data.record.MedicationRequestId).then((res) => {
                        this.util.showMessage('Success', 'Rx Request Confirmed Successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { 
                            if (res === true) {
                                this.dialogRef.close('Updated');
                            }
                        });
                    }); 
                }
                else {
                    this.util.showMessage('Error!!', res.ValidationStatus, BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then((res) => { });
                }
            });
        }
    }

    cancelRequest() {
        this.util.showMessage("Delete", "Are you sure want to cancel? This action cannot be undone", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
            if (res) {
                this.ePrescriptionSvc.userVerificationEPrescriptionRequest(this.ePrescriptionRequestEditForm.get('Username').value, this.ePrescriptionRequestEditForm.get('Password').value).then((res) => {
                    if (res[0].includes('Valid User')) { 
                        this.ePrescriptionSvc.cancelEPrescriptionRequest(this.data.record.MedicationRequestId).then((res) => {
                            if (res.MedicationRequestStatus.includes('Cancelled')) {
                                this.util.showMessage('Success', 'Rx Request has been cancelled', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { 
                                    if (res === true) {
                                        this.dialogRef.close('Cancel');
                                    }
                                });
                            }
                        });
                    }
                    else {
                        this.util.showMessage('Error!!', res, BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then((res) => { });
                    }
                });
            }
        });
    }

    resetForm() {
        this.ePrescriptionRequestEditForm.reset();
        this.ePrescriptionDynamic.clear();
        this.onAddRow();
        this.hold = false;
        this.discontinue = false;
        this.notes = false;
        this.refill = false;
        this.setePrescriptionData();
    }

    dialogClose() {
        this.dialogRef.close();
    }

}