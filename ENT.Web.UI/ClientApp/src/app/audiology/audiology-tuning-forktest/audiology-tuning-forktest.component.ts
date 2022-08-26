import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { CustomHttpService } from "../../core/custom-http.service";
import { AudiologyService } from "../audiology.service";
import { TuningForkTestModel } from "../model/tuningForkTestModel";

@Component({
    selector: 'audiology-tuning-forktest',
    templateUrl: './audiology-tuning-forktest.component.html',
    styleUrls: ['./audiology-tuning-forktest.component.css']
})

export class AudiologyTuningForkTestComponent implements OnInit {
    tuningForkTestForm: FormGroup;
    tuningForkTestModel: TuningForkTestModel = new TuningForkTestModel();

    constructor(private router: Router, private fb: FormBuilder, public dialog: MatDialog, private audiologySvc: AudiologyService, private customHttpSvc: CustomHttpService) { }

    back() {
        this.router.navigate(['home/audiology/consultlist']);
    }

    ngOnInit() {
        this.tuningForkTestForm = this.fb.group({
            //TuningForkTestId: [''],
            //PatientId: [''],
            //VisitID: [''],
            //CaseSheetID: [''],
            WeberLTEar: [''],
            WeberRTEar: [''],
            RinnersLTEar: [''],
            RinnersRTEar: [''],
            Starttime: [''],
            Endtime: [''],
            Totalduration: [''],
            Findings: [''],
            Nextfollowupdate: [''],
        });
        this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    }

    addUpdateTuningForkTest() {
        this.tuningForkTestModel.TuningForkTestId = 0;
        this.tuningForkTestModel.PatientId = 1;
        this.tuningForkTestModel.VisitID = 1;
        this.tuningForkTestModel.CaseSheetID = 1;
        this.tuningForkTestModel.WeberLTEar = this.tuningForkTestForm.get('WeberLTEar').value;
        this.tuningForkTestModel.WeberRTEar = this.tuningForkTestForm.get('WeberRTEar').value;
        this.tuningForkTestModel.RinnersLTEar = this.tuningForkTestForm.get('RinnersLTEar').value;
        this.tuningForkTestModel.RinnersRTEar = this.tuningForkTestForm.get('RinnersRTEar').value;
        this.tuningForkTestModel.Starttime = this.tuningForkTestForm.get('Starttime').value;
        this.tuningForkTestModel.Endtime = this.tuningForkTestForm.get('Endtime').value;
        this.tuningForkTestModel.Totalduration = this.tuningForkTestForm.get('Totalduration').value;
        this.tuningForkTestModel.Findings = this.tuningForkTestForm.get('Findings').value;
        this.tuningForkTestModel.Nextfollowupdate = this.tuningForkTestForm.get('Nextfollowupdate').value;

        this.audiologySvc.addUpdateTuningForkTest(this.tuningForkTestModel).then(res => res);
    }

    onChange(event) {
        
    }

}