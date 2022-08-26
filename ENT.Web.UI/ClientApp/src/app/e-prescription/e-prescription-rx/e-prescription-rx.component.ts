import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators, ValidatorFn } from '@angular/forms';
import { CustomHttpService } from '../../core/custom-http.service';
import { MedicationModel } from '../models/medicationModel';
import { UtilService } from '../../core/util.service';
import { EPrescriptionService } from '../ePrescription.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
    selector: 'e-prescription-rx',
    templateUrl: './e-prescription-rx.component.html',
    styleUrls: ['./e-prescription-rx.component.css']
})

export class EPrescriptionRxComponent implements OnInit, AfterViewInit {
    ePrescriptionRxForm: FormGroup;
    medicationModel: MedicationModel = new MedicationModel();
    hold: boolean = false;
    discontinue: boolean = false;
    notes: boolean = false;
    refill: boolean = false;
    show: boolean = false;
    medicationNumber: any;
    visitDateTime: any;
    visitId: any;
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

    @ViewChild('autoCompletePatientInput', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
    @ViewChild('autoCompletePhysicianInput', { static: false, read: MatAutocompleteTrigger }) trigger1: MatAutocompleteTrigger;

    constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<EPrescriptionRxComponent>, private ePrescriptionSvc: EPrescriptionService, private util: UtilService, public customHttp: CustomHttpService) { }

    ngOnInit() {
        this.customHttp.getDbName(localStorage.getItem('DatabaseName'));
        this.ePrescriptionRxForm = this.fb.group({
            SearchPatientList: ['', Validators.required],
            VisitDateTime: [null, Validators.required],
            PhysicianName: ['', Validators.required],
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
        this.getMedicationNumber();
        this.getPatientList();
        this.getPhysicianName();
        this.bindRoute();
    }

    ngAfterViewInit() {
        this.trigger.panelClosingActions
            .subscribe(e => {
                if (!(e && e.source)) {
                    this.ePrescriptionRxForm.get('SearchPatientList').setValue('');
                }
            });

        this.trigger1.panelClosingActions
            .subscribe(e => {
                if (!(e && e.source)) {
                    this.ePrescriptionRxForm.get('PhysicianName').setValue('');
                }
            });
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
        return <FormArray>this.ePrescriptionRxForm.get('rows');
    }

    getMedicationNumber() {
        this.ePrescriptionSvc.getMedicationNumber().then(res => {
            this.medicationNumber = res;
        });
    }

    getPatientList() {
        this.ePrescriptionRxForm.get('SearchPatientList').valueChanges.subscribe(
            (key: string) => {
                if (key != null) {
                    if (key.length > 2) {
                        this.ePrescriptionSvc.getPatientforEPrescription(key).then(data => {
                            this.patientSearch = data;
                        });
                    }
                    else {
                        this.patientSearch = null;
                        this.show = false;
                    }
                }
                else {
                    this.patientSearch = null;
                }
            });
    }

    getPatientId(id: number) {
        this.ePrescriptionSvc.getPatientDetailsById(id).then(data => {
            this.patientListId = id;
            if (data != undefined) {
                this.patientId = data;
                this.show = true;
            }
        });
        this.getVisitforPatient(id);
    }

    getVisitforPatient(id: number) {
        this.ePrescriptionSvc.getVisitforMedication(id).then(res => {
            this.visitDateTime = res;
        });
    }

    VisitId(index: any) {
        this.ePrescriptionSvc.getVisitforMedication(this.patientListId).then(data => {
            for (var i = 0; i < data.length; i++) {
                if (i == index) {
                    this.visitId = data[i].VisitId;
                }
            }
        });
    }

    getPhysicianName() {
        this.ePrescriptionRxForm.get('PhysicianName').valueChanges.subscribe(
            (key: string) => {
                if (key != null) {
                    if (key.length > 2) {
                        this.ePrescriptionSvc.getPhysicianforEPrescription(key).then(data => {
                            this.physicianName = data;
                        });
                    }
                    else {
                        this.physicianName = null;
                    }
                }
                else {
                    this.physicianName = null;
                }
            });
    }

    PhysicianId(PhysicianId) {
        this.physicianListId = PhysicianId;
    }

    getDrugList(index) {
        const control = <FormArray>this.ePrescriptionRxForm.controls['rows'];
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
        const items = <FormArray>this.ePrescriptionRxForm.controls['rows'];
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
        const arr = <FormArray>this.ePrescriptionRxForm.controls['rows'];
        this.route = arr.controls[index].get('Route').value;
        for (const option of this.routeName) {
            if (this.route == option.RouteCode) {
                arr.controls[index].get('routeTooltip').setValue(option.RouteDescription);
            }
        }
    }

    getDiagnosisList(index) {
        const control = <FormArray>this.ePrescriptionRxForm.controls['rows'];
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
        const items = <FormArray>this.ePrescriptionRxForm.controls['rows'];
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
        this.ePrescriptionRxForm.get('HoldMedication').reset();
    }

    isDiscontinue(event) {
        this.discontinue = event.checked;
        if (this.discontinue == false) {
            this.resetDiscontinue();
        }
    }

    resetDiscontinue() {
        this.ePrescriptionRxForm.get('DiscontinueDrugs').reset();
    }

    isNotes(event) {
        this.notes = event.checked;
        if (this.notes == false) {
            this.resetNotes();
        }
    }

    resetNotes() {
        this.ePrescriptionRxForm.get('NotesPharmacist').reset();
    }

    isRefill(event) {
        this.refill = event.checked;
        if (this.refill == false) {
            this.resetRefill();
        }
    }

    resetRefill() {
        this.ePrescriptionRxForm.get('RefillNumber').reset();
        this.ePrescriptionRxForm.get('Date').reset();
        this.ePrescriptionRxForm.get('RefillNotes').reset();
    }

    onAddRow() {
        // if (this.ePrescriptionRxForm.controls['rows'].valid) {
            this.ePrescriptionDynamic.push(this.ePrescription());
            this.drugName = null;
            this.diagnosisName = null;
        // }
    }

    onRemoveRow(rowIndex: number) {
        this.ePrescriptionDynamic.removeAt(rowIndex);
    }

    submitData() {
        if (this.ePrescriptionRxForm.valid && this.ePrescriptionRxForm.controls['rows'].valid) {
            this.medicationModel.medicationItems = [];
            const control = <FormArray>this.ePrescriptionRxForm.controls['rows'];
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
            this.medicationModel.MedicationId = 0;
            this.medicationModel.MedicationNumber = this.medicationNumber[0];
            this.medicationModel.VisitID = this.visitId;
            this.medicationModel.AdmissionID = 0;
            this.medicationModel.MedicationPhysician = this.physicianListId;
            this.medicationModel.TakeRegularMedication = this.ePrescriptionRxForm.get('Start').value;
            this.medicationModel.IsHoldRegularMedication = this.ePrescriptionRxForm.get('Hold').value;
            this.medicationModel.HoldRegularMedicationNotes = this.ePrescriptionRxForm.get('HoldMedication').value;
            this.medicationModel.IsDiscontinueDrug = this.ePrescriptionRxForm.get('Discontinue').value;
            this.medicationModel.DiscontinueDrugNotes = this.ePrescriptionRxForm.get('DiscontinueDrugs').value;
            this.medicationModel.IsPharmacist = this.ePrescriptionRxForm.get('Notes').value;
            this.medicationModel.PharmacistNotes = this.ePrescriptionRxForm.get('NotesPharmacist').value;
            this.medicationModel.IsRefill = this.ePrescriptionRxForm.get('Refill').value;
            this.medicationModel.RefillCount = this.ePrescriptionRxForm.get('RefillNumber').value;
            this.medicationModel.RefillDate = this.ePrescriptionRxForm.get('Date').value;
            this.medicationModel.RefillNotes = this.ePrescriptionRxForm.get('RefillNotes').value;
            this.medicationModel.UserName = this.ePrescriptionRxForm.get('Username').value;
            this.medicationModel.Password = this.ePrescriptionRxForm.get('Password').value;

            this.ePrescriptionSvc.SaveMedicationforEPrescription(this.medicationModel).then(res => {
                if (res.ValidationStatus.toLowerCase().trim() == "valid user") {
                    this.util.showMessage('', 'New Rx Record Saved Successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
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
        this.ePrescriptionRxForm.reset();
        this.ePrescriptionDynamic.clear();
        this.onAddRow();
        this.hold = false;
        this.discontinue = false;
        this.notes = false;
        this.refill = false;
        this.show = false;
    }

    dialogClose() {
        this.dialogRef.close();
    }

}
