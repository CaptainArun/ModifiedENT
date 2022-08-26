import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomHttpService } from "../../core/custom-http.service";
import { UtilService } from "../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../ux/bmsmsgbox/bmsmsgbox.component";
import { AudiologyService } from "../audiology.service";
import { HearingAidTrialModel } from "../model/hearingAidTrialModel";
import { signOffModel } from "../model/signOffModel";

@Component({
    selector: 'audiology-hearing-aid-trial',
    templateUrl: './audiology-hearing-aid-trial.component.html',
    styleUrls: ['./audiology-hearing-aid-trial.component.css']
})

export class AudiologyHearingAidTrialComponent implements OnInit {
    hearingAidTrialForm: FormGroup;
    hearingAidTrialModel: HearingAidTrialModel = new HearingAidTrialModel();
    signOffModel: signOffModel = new signOffModel();
    temporaryDate: Date = new Date();
    isFollowUp = false;
    isShow = false;
    visitId: number;
    hearingAidData: any;
    visitDateandTime: any;
    recordedDuring: any;
    Starttime: any;
    Endtime: any;
    getTimeHH: number;
    getTimeMin: number;

    constructor(private router: Router, private activeRoute: ActivatedRoute, private fb: FormBuilder, public dialog: MatDialog, private audiologySvc: AudiologyService, private customHttpSvc: CustomHttpService, private util: UtilService) { }

    ngOnInit() {
        this.hearingAidTrialForm = this.fb.group({
            VisitDateandTime: ['', Validators.required],
            recordeDuring: ['', Validators.required],
            LTEar: ['', Validators.required],
            RTEar: ['', Validators.required],
            Starttime: [''],
            Endtime: [''],
            Totalduration: [''],
            NotesandInstructions: [''],
            checked: [''],
            Nextfollowupdate: [''],
            UserName: [localStorage.getItem('LoggedinUser')],
            Password: ['']
        });
        this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
        this.activeRoute.params.subscribe(params => {
            this.visitId = params.id;
            this.getHearingAidTrialData();
        });
    }

    TimeValidation() {
        this.Starttime = this.hearingAidTrialForm.get('Starttime').value;
        this.Endtime = this.hearingAidTrialForm.get('Endtime').value;

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
                this.hearingAidTrialForm.get('Endtime').reset();
            });
        }
    }

    onChange(event) {
        this.isFollowUp = event.checked;
        if(this.isFollowUp == false) {
            this.hearingAidTrialForm.get('Nextfollowupdate').reset();
        }
    }

    getHearingAidTrialData() {
        this.audiologySvc.getHearingAidTrialDataForPatientVisit(this.visitId).then(res => {
            this.hearingAidData = res;
            if (res != null && res != undefined) {
                this.hearingAidTrialForm.get('LTEar').setValue(res.LTEar);
                this.hearingAidTrialForm.get('RTEar').setValue(res.RTEar);
                this.hearingAidTrialForm.get('NotesandInstructions').setValue(res.NotesandInstructions);
                if (res.Starttime != null && res.Starttime != undefined) {
                    this.hearingAidTrialForm.get('Starttime').setValue(new Date(res.Starttime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
                }
                if (res.Endtime != null && res.Endtime != undefined) {
                    this.hearingAidTrialForm.get('Endtime').setValue(new Date(res.Endtime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
                }
                this.hearingAidTrialForm.get('Totalduration').setValue(res.Totalduration);
                this.hearingAidTrialForm.get('Nextfollowupdate').setValue(res.Nextfollowupdate);
                this.hearingAidTrialForm.get('VisitDateandTime').setValue(res.VisitDateandTime);
                this.hearingAidTrialForm.get('recordeDuring').setValue(res.recordeDuring);
                if (res.Nextfollowupdate != null && res.Nextfollowupdate != undefined) {
                    this.hearingAidTrialForm.get('checked').setValue(true);
                    this.isFollowUp = true;
                }
                if (res.SignOffStatus == true) {
                    this.hearingAidTrialForm.disable();
                    this.isShow = true;
                }
            }
            else if (res == null) {
                this.audiologySvc.getAudiologyRecords(this.visitId).then(obj => {
                    this.visitDateandTime = obj.VisitDateandTime;
                    this.recordedDuring = obj.recordedDuring;
                    this.hearingAidTrialForm.get('VisitDateandTime').setValue(obj.VisitDateandTime);
                    this.hearingAidTrialForm.get('recordeDuring').setValue(obj.recordedDuring);
                })
            }
        });
    }

    back() {
        this.router.navigate(['home/audiology/consultlist']);
    }

    addUpdateHearingAidTrial() {
        if (this.hearingAidTrialForm.valid) {
            this.hearingAidTrialModel.HearingAidTrialId = 0;
            this.hearingAidTrialModel.VisitID = this.visitId;
            this.hearingAidTrialModel.LTEar = this.hearingAidTrialForm.get('LTEar').value;
            this.hearingAidTrialModel.RTEar = this.hearingAidTrialForm.get('RTEar').value;
            this.hearingAidTrialModel.NotesandInstructions = this.hearingAidTrialForm.get('NotesandInstructions').value;
            this.hearingAidTrialModel.Starttime = this.hearingAidTrialForm.get('Starttime').value;
            this.hearingAidTrialModel.Endtime = this.hearingAidTrialForm.get('Endtime').value;
            this.hearingAidTrialModel.Totalduration = this.hearingAidTrialForm.get('Totalduration').value;
            this.hearingAidTrialModel.Nextfollowupdate = this.hearingAidTrialForm.get('Nextfollowupdate').value;

            this.audiologySvc.addUpdateHearingAidTrialData(this.hearingAidTrialModel).then(data => {
                this.util.showMessage('', 'Hearing aid trial data saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                    (res) => { }
                )
            });
        }
    }

    resetForm() {
        this.hearingAidTrialForm.reset();
        this.hearingAidTrialForm.get('VisitDateandTime').setValue(this.visitDateandTime);
        this.hearingAidTrialForm.get('recordeDuring').setValue(this.recordedDuring);
        this.hearingAidTrialForm.get('UserName').setValue(localStorage.getItem('LoggedinUser'));
        this.isFollowUp = false;
        this.getHearingAidTrialData();
    }

    signOff() {
        this.signOffModel.VisitId = this.visitId;
        this.signOffModel.ScreenName = "Hearing Aid Trial Test";
        this.signOffModel.UserName = this.hearingAidTrialForm.get('UserName').value;
        this.signOffModel.Password = this.hearingAidTrialForm.get('Password').value;
        this.util.showMessage("Delete", "Are you sure want to signoff? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then(
            (res: any) => {
                if (res == true) {
                    this.audiologySvc.signOff(this.signOffModel).then(data => {
                        if (data.status == "Hearing Aid signOff Success") {
                            this.hearingAidTrialForm.disable();
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