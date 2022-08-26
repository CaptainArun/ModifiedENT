import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Router } from "@angular/router";
import { TriageService } from "../../triage/triage.service";
import { AudiologyService } from "../audiology.service";

@Component({
    selector: 'audiology-images-popup',
    templateUrl: './audiology-images-popup.component.html',
    styleUrls: ['./audiology-images-popup.component.css']
})

export class AudiologyImagesPopupComponent implements OnInit {
    requestList: any;

    constructor(private router: Router, public audiologySvc: AudiologyService, public triageSvc: TriageService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AudiologyImagesPopupComponent>) { }

    ngOnInit() {
        this.getAudiologyRequest();
    }

    getAudiologyRequest() {
        this.triageSvc.GetAudiologyRequestsForPatient(this.data.PatientId).then(res => {
            for (let i = 0; i < res.length; i++) {
                this.requestList = res[i];
            }
        });
    }

    viewTests2() {
        this.setSessionStorage();
        this.router.navigate(['home/audiology/specialtest', this.data.PatientId, this.data.VisitID]);
        this.dialogRef.close();
    }

    viewTests4() {
        this.setSessionStorage();
        this.router.navigate(['home/audiology/oaetest', this.data.PatientId, this.data.VisitID]);
        this.dialogRef.close();
    }

    viewTests5() {
        this.setSessionStorage();
        this.router.navigate(['home/audiology/beratest', this.data.PatientId, this.data.VisitID]);
        this.dialogRef.close();
    }

    viewTests6() {
        this.setSessionStorage();
        this.router.navigate(['home/audiology/assrtest', this.data.PatientId, this.data.VisitID]);
        this.dialogRef.close();
    }

    viewTests7() {
        this.setSessionStorage();
        this.router.navigate(['home/audiology/hearingaidtrial', this.data.PatientId, this.data.VisitID]);
        this.dialogRef.close();
    }

    viewTests8() {
        this.setSessionStorage();
        this.router.navigate(['home/audiology/tinnitusmasking', this.data.PatientId, this.data.VisitID]);
        this.dialogRef.close();
    }

    viewTests9() {
        this.setSessionStorage();
        this.router.navigate(['home/audiology/speechtherapy', this.data.PatientId, this.data.VisitID]);
        this.dialogRef.close();
    }

    viewTests10() {
        this.setSessionStorage();
        this.router.navigate(['home/audiology/electrocochleography', this.data.PatientId, this.data.VisitID]);
        this.dialogRef.close();
    }

    setSessionStorage() {
        sessionStorage.setItem("audiologySearchModel", JSON.stringify(this.data.sessionData));
    }

    close(): void {
        this.dialogRef.close();
    }

}
