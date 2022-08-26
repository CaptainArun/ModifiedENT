import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CustomHttpService } from 'src/app/core/custom-http.service';

@Component({
    selector: 'e-prescription-view',
    templateUrl: './e-prescription-view.component.html',
    styleUrls: ['./e-prescription-view.component.css']
})

export class EPrescriptionViewComponent implements OnInit {
    ePrescriptionViewForm: FormGroup;

    constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<EPrescriptionViewComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public customHttp: CustomHttpService) { }

    ngOnInit() {
        this.customHttp.getDbName(localStorage.getItem('DatabaseName'));

        this.ePrescriptionViewForm = this.fb.group({
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
        this.ePrescriptionViewForm.get('Start').disable();
        this.ePrescriptionViewForm.get('Hold').disable();
        this.ePrescriptionViewForm.get('Discontinue').disable();
        this.ePrescriptionViewForm.get('Notes').disable();
        this.ePrescriptionViewForm.get('Refill').disable();
    }

    ePrescription(): FormGroup {
        return this.fb.group({
            ItemDrugName: ['', Validators.required],
            Route: [null, Validators.required],
            Diagnosis: ['', Validators.required],
            Qty: ['', Validators.required],
            Days: ['', Validators.required],
            Morning: [false, ''],
            Brunch: [false, ''],
            Noon: [false, ''],
            Evening: [false, ''],
            Night: [false, ''],
            Before: [false, ''],
            After: [false, ''],
            MedicationStatus: ['', Validators.required],
            SIG: ['']
        });
    }

    get ePrescriptionDynamic() {
        return <FormArray>this.ePrescriptionViewForm.get('rows');
    }

    setePrescriptionData() {
        if (this.data != undefined && this.data != null) {

            for (let i = 0; i < this.data.medicationItems.length; i++) {
                this.ePrescriptionDynamic.push(this.ePrescription());
                const control = <FormArray>this.ePrescriptionViewForm.controls['rows'];
                control.controls[i].get('Morning').disable();
                control.controls[i].get('Brunch').disable();
                control.controls[i].get('Noon').disable();
                control.controls[i].get('Evening').disable();
                control.controls[i].get('Night').disable();
                control.controls[i].get('Before').disable();
                control.controls[i].get('After').disable();
                control.controls[i].get('MedicationStatus').disable();
                control.controls[i].get('ItemDrugName').setValue(this.data.medicationItems[i].DrugName);
                control.controls[i].get('Route').setValue(this.data.medicationItems[i].MedicationRouteDesc);
                control.controls[i].get('Diagnosis').setValue(this.data.medicationItems[i].ICDCode);
                control.controls[i].get('Qty').setValue(this.data.medicationItems[i].TotalQuantity);
                control.controls[i].get('Days').setValue(this.data.medicationItems[i].NoOfDays);
                control.controls[i].get('Morning').setValue(this.data.medicationItems[i].Morning);
                control.controls[i].get('Brunch').setValue(this.data.medicationItems[i].Brunch);
                control.controls[i].get('Noon').setValue(this.data.medicationItems[i].Noon);
                control.controls[i].get('Evening').setValue(this.data.medicationItems[i].Evening);
                control.controls[i].get('Night').setValue(this.data.medicationItems[i].Night);
                control.controls[i].get('Before').setValue(this.data.medicationItems[i].Before);
                control.controls[i].get('After').setValue(this.data.medicationItems[i].After);
                control.controls[i].get('SIG').setValue(this.data.medicationItems[i].SIG);
                if (this.data.medicationItems[i].Start == true) {
                    control.controls[i].get('MedicationStatus').setValue("start");
                }
                if (this.data.medicationItems[i].Hold == true) {
                    control.controls[i].get('MedicationStatus').setValue("hold");
                }
                if (this.data.medicationItems[i].Continued == true) {
                    control.controls[i].get('MedicationStatus').setValue("continue");
                }
                if (this.data.medicationItems[i].DisContinue == true) {
                    control.controls[i].get('MedicationStatus').setValue("discontinue");
                }
                this.ePrescriptionDynamic.removeAt(this.data.medicationItems.length);
            }
            this.ePrescriptionViewForm.get('Start').setValue(this.data.TakeRegularMedication);
            this.ePrescriptionViewForm.get('Hold').setValue(this.data.IsHoldRegularMedication);
            this.ePrescriptionViewForm.get('HoldMedication').setValue(this.data.HoldRegularMedicationNotes);
            this.ePrescriptionViewForm.get('Discontinue').setValue(this.data.IsDiscontinueDrug);
            this.ePrescriptionViewForm.get('DiscontinueDrugs').setValue(this.data.DiscontinueDrugNotes);
            this.ePrescriptionViewForm.get('Notes').setValue(this.data.IsPharmacist);
            this.ePrescriptionViewForm.get('NotesPharmacist').setValue(this.data.PharmacistNotes);
            this.ePrescriptionViewForm.get('Refill').setValue(this.data.IsRefill);
            this.ePrescriptionViewForm.get('RefillNumber').setValue(this.data.RefillCount);
            this.ePrescriptionViewForm.get('Date').setValue(this.data.RefillDate);
            this.ePrescriptionViewForm.get('RefillNotes').setValue(this.data.RefillNotes);
        }
    }

    dialogClose() {
        this.dialogRef.close();
    }

}
