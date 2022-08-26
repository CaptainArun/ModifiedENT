import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog, MatCheckboxChange } from "@angular/material";
import { Router } from "@angular/router";
import { CustomHttpService } from "../../core/custom-http.service";
import { AudiologyService } from "../audiology.service";
import { TympanometryModel } from "../model/tympanometryModel";

@Component({
    selector: 'audiology-tympanometry',
    templateUrl: './audiology-tympanometry.component.html',
    styleUrls: ['./audiology-tympanometry.component.css']
})

export class AudiologyTympanometryComponent implements OnInit {
    tympanometryForm: FormGroup;
    tympanometryModel: TympanometryModel = new TympanometryModel();
    isFollowUp = false;

    constructor(private router: Router, private fb: FormBuilder, public dialog: MatDialog, private audiologySvc: AudiologyService, private customHttpSvc: CustomHttpService) { }

    back() {
        this.router.navigate(['home/audiology/consultlist']);
    }

    ngOnInit() {
        this.tympanometryForm = this.fb.group({
            //TympanometryId:[''],
            //PatientId:[''],
            //VisitID:[''],
            //CaseSheetID:[''],
            LeftEar: [true],
            RightEar: [''],
            ECV: [''],
            MEP: [''],
            SC: [''],
            Grad: [''],
            TW: [''],
            Speed: [''],
            Direction: [''],
            NotesandInstructions: [''],
            Starttime: [''],
            Endtime: [''],
            Totalduration: [''],
            Nextfollowupdate: ['']
        });
        this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
        this.getTympanometryData();
    }

    getTympanometryData() {
        this.audiologySvc.getTympanometryForPatientVisit(1, 2, 3).then(data => data);
    }

    addUpdateTympanometry() {
        this.tympanometryModel.TympanogramId = 0;
        this.tympanometryModel.PatientId = 1;
        this.tympanometryModel.VisitID = 1;
        this.tympanometryModel.CaseSheetID = 1;

        if (this.tympanometryForm.get('LeftEar').value == true) {
            this.tympanometryModel.ECVLeft = this.tympanometryForm.get('ECV').value;
            this.tympanometryModel.MEPLeft = this.tympanometryForm.get('MEP').value;
            this.tympanometryModel.SCLeft = this.tympanometryForm.get('SC').value;
            this.tympanometryModel.GradLeft = this.tympanometryForm.get('Grad').value;
            this.tympanometryModel.TWLeft = this.tympanometryForm.get('TW').value;
            this.tympanometryModel.SpeedLeft = this.tympanometryForm.get('Speed').value;
            this.tympanometryModel.DirectionLeft = this.tympanometryForm.get('Direction').value;
        }

        if (this.tympanometryForm.get('RightEar').value == true) {
            this.tympanometryModel.ECVRight = this.tympanometryForm.get('ECV').value;
            this.tympanometryModel.MEPRight = this.tympanometryForm.get('MEP').value;
            this.tympanometryModel.SCRight = this.tympanometryForm.get('SC').value;
            this.tympanometryModel.GradRight = this.tympanometryForm.get('Grad').value;
            this.tympanometryModel.TWRight = this.tympanometryForm.get('TW').value;
            this.tympanometryModel.SpeedRight = this.tympanometryForm.get('Speed').value;
            this.tympanometryModel.DirectionRight = this.tympanometryForm.get('Direction').value;
        }

        this.tympanometryModel.NotesandInstructions = this.tympanometryForm.get('NotesandInstructions').value;
        this.tympanometryModel.Starttime = this.tympanometryForm.get('Starttime').value;
        this.tympanometryModel.Endtime = this.tympanometryForm.get('Endtime').value;
        this.tympanometryModel.Totalduration = this.tympanometryForm.get('Totalduration').value;
        this.tympanometryModel.Nextfollowupdate = this.tympanometryForm.get('Nextfollowupdate').value;

        //this.audiologySvc.addUpdateTympanometryData(this.tympanometryModel).then(data => data);
    }

    onChange(event: MatCheckboxChange) {
        this.isFollowUp = event.checked;
    }

}