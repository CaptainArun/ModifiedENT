import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomHttpService } from "../../core/custom-http.service";
import { UtilService } from "../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../ux/bmsmsgbox/bmsmsgbox.component";
import { AudiologyService } from "../audiology.service";
import { signOffModel } from "../model/signOffModel";
import { SpeechTherapyModel } from "../model/speechTherapyModel";

@Component({
    selector: 'audiology-speech-therapy',
    templateUrl: './audiology-speech-therapy.component.html',
    styleUrls: ['./audiology-speech-therapy.component.css']
})

export class AudiologySpeechTherapyComponent implements OnInit {
    speechTherapyForm: FormGroup;
    speechTherapyModel: SpeechTherapyModel = new SpeechTherapyModel();
    signOffModel: signOffModel = new signOffModel();
    temporaryDate: Date = new Date();
    isFollowUp = false;
    isShow = false;
    visitId: number;
    speechTherapyData: any;
    visitDateandTime: any;
    recordedDuring: any;
    Starttime: any;
    Endtime: any;
    getTimeHH: number;
    getTimeMin: number;

    constructor(private router: Router, private activeRoute: ActivatedRoute, private fb: FormBuilder, public dialog: MatDialog, private audiologySvc: AudiologyService, private customHttpSvc: CustomHttpService, private util: UtilService) { }

    ngOnInit() {
        this.speechTherapyForm = this.fb.group({
            VisitDateandTime: ['', Validators.required],
            recordeDuring: ['', Validators.required],
            Findings: ['', Validators.required],
            ClinicalNotes: ['', Validators.required],
            Starttime: [''],
            Endtime: [''],
            Totalduration: [''],
            checked: [''],
            Nextfollowupdate: [''],
            UserName: [localStorage.getItem('LoggedinUser')],
            Password: ['']
        });
        this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
        this.activeRoute.params.subscribe(params => {
            this.visitId = params.id;
            this.getSpeechTherapy();
        });
    }

    TimeValidation() {
        this.Starttime = this.speechTherapyForm.get('Starttime').value;
        this.Endtime = this.speechTherapyForm.get('Endtime').value;

        // Start Time 
        if (this.Starttime) {
            if (this.Starttime.toString().toLowerCase().split(" ")[1] == "pm") {
                if (parseInt(this.Starttime.toString().split(" ")[0].toString().split(":")[0]) == 12) {
                    this.getTimeHH = 12;
                }
                else {
                    this.getTimeHH = parseInt(this.Starttime.toString().split(" ")[0].toString().split(":")[0]) + 12;
                }
            }
            else if (this.Starttime.toString().toLowerCase().split(" ")[1] == "am") {
                if (parseInt(this.Starttime.toString().split(" ")[0].toString().split(":")[0]) == 12) {
                    this.getTimeHH = 0;
                }
                else {
                    this.getTimeHH = parseInt(this.Starttime.toString().split(" ")[0].toString().split(":")[0]);
                }
            }
            this.getTimeMin = parseInt(this.Starttime.toString().split(" ")[0].toString().split(":")[1]);

            this.Starttime = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
        }

        // End Time
        if (this.Endtime) {
            if (this.Endtime.toString().toLowerCase().split(" ")[1] == "pm") {
                if (parseInt(this.Endtime.toString().split(" ")[0].toString().split(":")[0]) == 12) {
                    this.getTimeHH = 12;
                }
                else {
                    this.getTimeHH = parseInt(this.Endtime.toString().split(" ")[0].toString().split(":")[0]) + 12;
                }
            } else if (this.Endtime.toString().toLowerCase().split(" ")[1] == "am") {
                if (parseInt(this.Endtime.toString().split(" ")[0].toString().split(":")[0]) == 12) {
                    this.getTimeHH = 0;
                } else {
                    this.getTimeHH = parseInt(this.Endtime.toString().split(" ")[0].toString().split(":")[0]);
                }
            }
            this.getTimeMin = parseInt(this.Endtime.toString().split(" ")[0].toString().split(":")[1]);

            this.Endtime = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
        }

        if ((this.Starttime) >= (this.Endtime)) {
            this.util.showMessage('', 'End Time must be greater than Start Time', BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
                this.speechTherapyForm.get('Endtime').reset();
            });
        }
    }

    onChange(event) {
        this.isFollowUp = event.checked;
        if(this.isFollowUp == false) {
            this.speechTherapyForm.get('Nextfollowupdate').reset();
        }
    }

    getSpeechTherapy() {
        this.audiologySvc.getSpeechTherapyForPatientVisit(this.visitId).then(res => {
            this.speechTherapyData = res;
            if (res != null && res != undefined) {
                this.speechTherapyForm.get('Findings').setValue(res.Findings);
                this.speechTherapyForm.get('ClinicalNotes').setValue(res.ClinicalNotes);
                if (res.Starttime != null && res.Starttime != undefined) {
                    this.speechTherapyForm.get('Starttime').setValue(new Date(res.Starttime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
                }
                if (res.Endtime != null && res.Endtime != undefined) {
                    this.speechTherapyForm.get('Endtime').setValue(new Date(res.Endtime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
                }
                this.speechTherapyForm.get('Totalduration').setValue(res.Totalduration);
                this.speechTherapyForm.get('Nextfollowupdate').setValue(res.Nextfollowupdate);
                this.speechTherapyForm.get('VisitDateandTime').setValue(res.VisitDateandTime);
                this.speechTherapyForm.get('recordeDuring').setValue(res.recordeDuring);
                if (res.Nextfollowupdate != null && res.Nextfollowupdate != undefined) {
                    this.speechTherapyForm.get('checked').setValue(true);
                    this.isFollowUp = true;
                }
                if (res.SignOffStatus == true) {
                    this.speechTherapyForm.disable();
                    this.isShow = true;
                }
            }
            else if (res == null) {
                this.audiologySvc.getAudiologyRecords(this.visitId).then(obj => {
                    this.visitDateandTime = obj.VisitDateandTime;
                    this.recordedDuring = obj.recordedDuring;
                    this.speechTherapyForm.get('VisitDateandTime').setValue(obj.VisitDateandTime);
                    this.speechTherapyForm.get('recordeDuring').setValue(obj.recordedDuring);
                })
            }
        });
    }

    back() {
        this.router.navigate(['home/audiology/consultlist']);
    }

    addUpdateSpeechTherapy() {
        if (this.speechTherapyForm.valid) {
            this.speechTherapyModel.SpeechTherapyId = 0;
            this.speechTherapyModel.VisitID = this.visitId;
            this.speechTherapyModel.Findings = this.speechTherapyForm.get('Findings').value;
            this.speechTherapyModel.ClinicalNotes = this.speechTherapyForm.get('ClinicalNotes').value;
            this.speechTherapyModel.Starttime = this.speechTherapyForm.get('Starttime').value;
            this.speechTherapyModel.Endtime = this.speechTherapyForm.get('Endtime').value;
            this.speechTherapyModel.Totalduration = this.speechTherapyForm.get('Totalduration').value;
            this.speechTherapyModel.Nextfollowupdate = this.speechTherapyForm.get('Nextfollowupdate').value;

            this.audiologySvc.addUpdateSpeechTherapyData(this.speechTherapyModel).then(data => {
                this.util.showMessage('', 'Speech therapy data saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                    (res) => { }
                )
            });
        }
    }

    resetForm() {
        this.speechTherapyForm.reset();
        this.speechTherapyForm.get('VisitDateandTime').setValue(this.visitDateandTime);
        this.speechTherapyForm.get('recordeDuring').setValue(this.recordedDuring);
        this.speechTherapyForm.get('UserName').setValue(localStorage.getItem('LoggedinUser'));
        this.isFollowUp = false;
        this.getSpeechTherapy();
    }

    signOff() {
        this.signOffModel.VisitId = this.visitId;
        this.signOffModel.ScreenName = "SpeechTherapy";
        this.signOffModel.UserName = this.speechTherapyForm.get('UserName').value;
        this.signOffModel.Password = this.speechTherapyForm.get('Password').value;
        this.util.showMessage("Delete", "Are you sure want to signoff? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then(
            (res: any) => {
                if (res == true) {
                    this.audiologySvc.signOff(this.signOffModel).then(data => {
                        if (data.status == "Speech Therapy signOff Success") {
                            this.speechTherapyForm.disable();
                            this.isShow = true;
                            this.util.showMessage('', data.status, BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                                (res) => { 
                                    if (res == true) {
                                        this.router.navigate(['home/audiology/consultlist']);
                                    }
                                }
                            );
                        } else {
                            this.util.showMessage('', data.status, BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox);
                        }
                    });
                }
            });
    }

}