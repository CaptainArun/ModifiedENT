import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { CustomHttpService } from '../../core/custom-http.service';
import { MedicationModel } from '../models/medicationModel';
import { UtilService } from '../../core/util.service';
import { EPrescriptionService } from '../ePrescription.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { EPrescriptionPrintComponent } from '../e-prescription-print/e-prescription-print.component';

@Component({
    selector: 'e-prescription-edit',
    templateUrl: './e-prescription-edit.component.html',
    styleUrls: ['./e-prescription-edit.component.css']
})

export class EPrescriptionEditComponent implements OnInit {
    ePrescriptionEditForm: FormGroup;
    medicationModel: MedicationModel = new MedicationModel();
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

    constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<EPrescriptionEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private ePrescriptionSvc: EPrescriptionService, private dialog: MatDialog, private util: UtilService, public customHttp: CustomHttpService) { }

    ngOnInit() {
        this.customHttp.getDbName(localStorage.getItem('DatabaseName'));

        this.ePrescriptionEditForm = this.fb.group({
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
        return <FormArray>this.ePrescriptionEditForm.get('rows');
    }

    ePrescriptionPreview() {
        this.ePrescriptionSvc.getMedicationRecordforPreview(this.data.record.MedicationId).then(data => {
            let previewMedication = data;
            const dialogRef = this.dialog.open(EPrescriptionPrintComponent, {
                data: previewMedication,
                height: 'auto',
                width: '1200px',
            });
            dialogRef.afterClosed().subscribe(result => {

            });
        });
    }

    getMedicationNumber() {
        this.ePrescriptionSvc.getMedicationNumber().then(res => {
            this.medicationNumber = res;
        });
    }

    getDrugList(index) {
        const control = <FormArray>this.ePrescriptionEditForm.controls['rows'];
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
        const items = <FormArray>this.ePrescriptionEditForm.controls['rows'];
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
        const arr = <FormArray>this.ePrescriptionEditForm.controls['rows'];
        this.route = arr.controls[index].get('Route').value;
        for (const option of this.routeName) {
            if (this.route == option.RouteCode) {
                arr.controls[index].get('routeTooltip').setValue(option.RouteDescription);
            }
        }
    }

    getDiagnosisList(index) {
        const control = <FormArray>this.ePrescriptionEditForm.controls['rows'];
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
        const items = <FormArray>this.ePrescriptionEditForm.controls['rows'];
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
        this.ePrescriptionEditForm.get('HoldMedication').reset();
    }

    isDiscontinue(event) {
        this.discontinue = event.checked;
        if (this.discontinue == false) {
            this.resetDiscontinue();
        }
    }

    resetDiscontinue() {
        this.ePrescriptionEditForm.get('DiscontinueDrugs').reset();
    }

    isNotes(event) {
        this.notes = event.checked;
        if (this.notes == false) {
            this.resetNotes();
        }
    }

    resetNotes() {
        this.ePrescriptionEditForm.get('NotesPharmacist').reset();
    }

    isRefill(event) {
        this.refill = event.checked;
        if (this.refill == false) {
            this.resetRefill();
        }
    }

    resetRefill() {
        this.ePrescriptionEditForm.get('RefillNumber').reset();
        this.ePrescriptionEditForm.get('Date').reset();
        this.ePrescriptionEditForm.get('RefillNotes').reset();
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
            for (let i = 0; i < this.data.record.medicationItems.length; i++) {
                this.ePrescriptionDynamic.push(this.ePrescription());
                const control = <FormArray>this.ePrescriptionEditForm.controls['rows'];
                control.controls[i].get('ItemDrugName').setValue(this.data.record.medicationItems[i].DrugName);
                this.itemNameList[i] = this.data.record.medicationItems[i].DrugName;
                control.controls[i].get('Route').setValue(this.data.record.medicationItems[i].MedicationRouteCode);
                for (const option of this.data.route) {
                    if (control.controls[i].get('Route').value == option.RouteCode) {
                        control.controls[i].get('routeTooltip').setValue(option.RouteDescription);
                    }
                }
                control.controls[i].get('Diagnosis').setValue(this.data.record.medicationItems[i].ICDCode);
                this.diagnosisNameList[i] = this.data.record.medicationItems[i].ICDCode;
                control.controls[i].get('Qty').setValue(this.data.record.medicationItems[i].TotalQuantity);
                control.controls[i].get('Days').setValue(this.data.record.medicationItems[i].NoOfDays);
                control.controls[i].get('MedicationTime').get('Morning').setValue(this.data.record.medicationItems[i].Morning);
                control.controls[i].get('MedicationTime').get('Brunch').setValue(this.data.record.medicationItems[i].Brunch);
                control.controls[i].get('MedicationTime').get('Noon').setValue(this.data.record.medicationItems[i].Noon);
                control.controls[i].get('MedicationTime').get('Evening').setValue(this.data.record.medicationItems[i].Evening);
                control.controls[i].get('MedicationTime').get('Night').setValue(this.data.record.medicationItems[i].Night);
                control.controls[i].get('MedicationIntake').get('Before').setValue(this.data.record.medicationItems[i].Before);
                control.controls[i].get('MedicationIntake').get('After').setValue(this.data.record.medicationItems[i].After);
                control.controls[i].get('SIG').setValue(this.data.record.medicationItems[i].SIG);
                if (this.data.record.medicationItems[i].Start == true) {
                    control.controls[i].get('MedicationStatus').setValue("start");
                }
                if (this.data.record.medicationItems[i].Hold == true) {
                    control.controls[i].get('MedicationStatus').setValue("hold");
                }
                if (this.data.record.medicationItems[i].Continued == true) {
                    control.controls[i].get('MedicationStatus').setValue("continue");
                }
                if (this.data.record.medicationItems[i].DisContinue == true) {
                    control.controls[i].get('MedicationStatus').setValue("discontinue");
                }
                this.ePrescriptionDynamic.removeAt(this.data.record.medicationItems.length);
            }
            this.ePrescriptionEditForm.get('Start').setValue(this.data.record.TakeRegularMedication);
            this.ePrescriptionEditForm.get('Hold').setValue(this.data.record.IsHoldRegularMedication);
            if (this.data.record.IsHoldRegularMedication != false) {
                this.hold = true;
            }
            this.ePrescriptionEditForm.get('HoldMedication').setValue(this.data.record.HoldRegularMedicationNotes);
            this.ePrescriptionEditForm.get('Discontinue').setValue(this.data.record.IsDiscontinueDrug);
            if (this.data.record.IsDiscontinueDrug != false) {
                this.discontinue = true;
            }
            this.ePrescriptionEditForm.get('DiscontinueDrugs').setValue(this.data.record.DiscontinueDrugNotes);
            this.ePrescriptionEditForm.get('Notes').setValue(this.data.record.IsPharmacist);
            if (this.data.record.IsPharmacist != false) {
                this.notes = true;
            }
            this.ePrescriptionEditForm.get('NotesPharmacist').setValue(this.data.record.PharmacistNotes);
            this.ePrescriptionEditForm.get('Refill').setValue(this.data.record.IsRefill);
            if (this.data.record.IsRefill != false) {
                this.refill = true;
            }
            this.ePrescriptionEditForm.get('RefillNumber').setValue(this.data.record.RefillCount);
            this.ePrescriptionEditForm.get('Date').setValue(this.data.record.RefillDate);
            this.ePrescriptionEditForm.get('RefillNotes').setValue(this.data.record.RefillNotes);
        }
    }

    submitData() {
        if (this.ePrescriptionEditForm.valid && this.ePrescriptionEditForm.controls['rows'].valid) {
            this.medicationModel.medicationItems = [];
            const control = <FormArray>this.ePrescriptionEditForm.controls['rows'];
            for (let row of control.controls) {
                this.medicationModel.medicationItems.push({
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
            this.medicationModel.MedicationId = this.data.record.MedicationId;
            this.medicationModel.MedicationNumber = this.data.record.MedicationNumber;
            this.medicationModel.VisitID = this.data.record.VisitID;
            this.medicationModel.AdmissionID = 0;
            this.medicationModel.MedicationPhysician = this.data.record.MedicationPhysician;
            this.medicationModel.TakeRegularMedication = this.ePrescriptionEditForm.get('Start').value;
            this.medicationModel.IsHoldRegularMedication = this.ePrescriptionEditForm.get('Hold').value;
            this.medicationModel.HoldRegularMedicationNotes = this.ePrescriptionEditForm.get('HoldMedication').value;
            this.medicationModel.IsDiscontinueDrug = this.ePrescriptionEditForm.get('Discontinue').value;
            this.medicationModel.DiscontinueDrugNotes = this.ePrescriptionEditForm.get('DiscontinueDrugs').value;
            this.medicationModel.IsPharmacist = this.ePrescriptionEditForm.get('Notes').value;
            this.medicationModel.PharmacistNotes = this.ePrescriptionEditForm.get('NotesPharmacist').value;
            this.medicationModel.IsRefill = this.ePrescriptionEditForm.get('Refill').value;
            this.medicationModel.RefillCount = this.ePrescriptionEditForm.get('RefillNumber').value;
            this.medicationModel.RefillDate = this.ePrescriptionEditForm.get('Date').value;
            this.medicationModel.RefillNotes = this.ePrescriptionEditForm.get('RefillNotes').value;
            this.medicationModel.UserName = this.ePrescriptionEditForm.get('Username').value;
            this.medicationModel.Password = this.ePrescriptionEditForm.get('Password').value;

            this.ePrescriptionSvc.SaveMedicationforEPrescription(this.medicationModel).then(res => {
                if (res.ValidationStatus.toLowerCase().trim() == "valid user") {
                    this.util.showMessage('Success', 'Rx Saved Successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { 
                        if (res === true) {
                            this.dialogRef.close('Updated');
                        }
                    });
                }
                else {
                    this.util.showMessage('Error!!', res.ValidationStatus, BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then((res) => { });
                }
            });
        }
    }

    resetForm() {
        this.ePrescriptionEditForm.reset();
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
