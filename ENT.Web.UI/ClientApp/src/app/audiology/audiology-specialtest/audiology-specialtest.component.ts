import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomHttpService } from "../../core/custom-http.service";
import { UtilService } from "../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../ux/bmsmsgbox/bmsmsgbox.component";
import { AudiologyService } from "../audiology.service";
import { signOffModel } from "../model/signOffModel";
import { SpeechTherapySpecialTestModel } from "../model/speechTherapySpecialTestModel";

@Component({
    selector: 'audiology-specialtest',
    templateUrl: './audiology-specialtest.component.html',
    styleUrls: ['./audiology-specialtest.component.css']
})

export class AudiologySpecialTestComponent implements OnInit {
    speechTherapySpecialTestForm: FormGroup;
    speechTherapySpecialTestModel: SpeechTherapySpecialTestModel = new SpeechTherapySpecialTestModel();
    signOffModel: signOffModel = new signOffModel();
    temporaryDate: Date = new Date();
    isFollowUp = false;
    isShow = false;
    visitId: number;
    specialTestData: any;
    visitDateandTime: any;
    recordedDuring: any;
    Starttime: any;
    Endtime: any;
    getTimeHH: number;
    getTimeMin: number;
 
    constructor(private router: Router, private activeRoute: ActivatedRoute, private fb: FormBuilder, public dialog: MatDialog, private audiologySvc: AudiologyService, private customHttpSvc: CustomHttpService, private util: UtilService) { }

    ngOnInit() {
        this.speechTherapySpecialTestForm = this.fb.group({
            VisitDateandTime: ['', Validators.required],
            recordeDuring: ['', Validators.required],
            SRTRight: ['', Validators.required],
            SRTLeft: ['', Validators.required],
            SDSRight: ['', Validators.required],
            SDSLeft: ['', Validators.required],
            SISIRight: ['', Validators.required],
            SISILeft: ['', Validators.required],
            TDTRight: ['', Validators.required],
            TDTLeft: ['', Validators.required],
            ABLBRight: ['', Validators.required],
            ABLBLeft: ['', Validators.required],
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
            this.getSpeechTherapySpecialTest();
        });
    }

    TimeValidation() {
        this.Starttime = this.speechTherapySpecialTestForm.get('Starttime').value;
        this.Endtime = this.speechTherapySpecialTestForm.get('Endtime').value;

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
                this.speechTherapySpecialTestForm.get('Endtime').reset();
            });
        }
    }

    onChange(event) {
        this.isFollowUp = event.checked;
        if(this.isFollowUp == false) {
            this.speechTherapySpecialTestForm.get('Nextfollowupdate').reset();
        }
    }

    getSpeechTherapySpecialTest() {
        this.audiologySvc.getSpeechTherapySpecialTestForPatientVisit(this.visitId).then(res => {
            this.specialTestData = res;
            if (res != null && res != undefined) {
                this.speechTherapySpecialTestForm.get('SRTRight').setValue(res.SRTRight);
                this.speechTherapySpecialTestForm.get('SRTLeft').setValue(res.SRTLeft);
                this.speechTherapySpecialTestForm.get('SDSRight').setValue(res.SDSRight);
                this.speechTherapySpecialTestForm.get('SDSLeft').setValue(res.SDSLeft);
                this.speechTherapySpecialTestForm.get('SISIRight').setValue(res.SISIRight);
                this.speechTherapySpecialTestForm.get('SISILeft').setValue(res.SISILeft);
                this.speechTherapySpecialTestForm.get('TDTRight').setValue(res.TDTRight);
                this.speechTherapySpecialTestForm.get('TDTLeft').setValue(res.TDTLeft);
                this.speechTherapySpecialTestForm.get('ABLBRight').setValue(res.ABLBRight);
                this.speechTherapySpecialTestForm.get('ABLBLeft').setValue(res.ABLBLeft);
                this.speechTherapySpecialTestForm.get('NotesandInstructions').setValue(res.NotesandInstructions);
                if (res.Starttime != null && res.Starttime != undefined) {
                    this.speechTherapySpecialTestForm.get('Starttime').setValue(new Date(res.Starttime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
                }
                if (res.Endtime != null && res.Endtime != undefined) {
                    this.speechTherapySpecialTestForm.get('Endtime').setValue(new Date(res.Endtime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
                }
                this.speechTherapySpecialTestForm.get('Totalduration').setValue(res.Totalduration);
                this.speechTherapySpecialTestForm.get('Nextfollowupdate').setValue(res.Nextfollowupdate);
                this.speechTherapySpecialTestForm.get('VisitDateandTime').setValue(res.VisitDateandTime);
                this.speechTherapySpecialTestForm.get('recordeDuring').setValue(res.recordeDuring);
                if(res.Nextfollowupdate != null && res.Nextfollowupdate != undefined) {
                    this.speechTherapySpecialTestForm.get('checked').setValue(true);
                    this.isFollowUp = true;
                }
                if (res.SignOffStatus == true) {
                    this.speechTherapySpecialTestForm.disable();
                    this.isShow = true;
                }
            }
            else if (res == null) {
                this.audiologySvc.getAudiologyRecords(this.visitId).then(obj => {
                    this.visitDateandTime = obj.VisitDateandTime;
                    this.recordedDuring = obj.recordedDuring;
                    this.speechTherapySpecialTestForm.get('VisitDateandTime').setValue(obj.VisitDateandTime);
                    this.speechTherapySpecialTestForm.get('recordeDuring').setValue(obj.recordedDuring);
                })
            }
        });
    }

    back() {
        this.router.navigate(['home/audiology/consultlist']);
    }

    addUpdateSpeechTherapySpecialTest() {
        if (this.speechTherapySpecialTestForm.valid) {
            this.speechTherapySpecialTestModel.SpeechTherapySpecialTestId = 0;
            this.speechTherapySpecialTestModel.VisitID = this.visitId;
            this.speechTherapySpecialTestModel.ChiefComplaint = "";
            this.speechTherapySpecialTestModel.ICD10 = 1;
            this.speechTherapySpecialTestModel.SRTRight = this.speechTherapySpecialTestForm.get('SRTRight').value;
            this.speechTherapySpecialTestModel.SRTLeft = this.speechTherapySpecialTestForm.get('SRTLeft').value;
            this.speechTherapySpecialTestModel.SDSRight = this.speechTherapySpecialTestForm.get('SDSRight').value;
            this.speechTherapySpecialTestModel.SDSLeft = this.speechTherapySpecialTestForm.get('SDSLeft').value;
            this.speechTherapySpecialTestModel.SISIRight = this.speechTherapySpecialTestForm.get('SISIRight').value;
            this.speechTherapySpecialTestModel.SISILeft = this.speechTherapySpecialTestForm.get('SISILeft').value;
            this.speechTherapySpecialTestModel.TDTRight = this.speechTherapySpecialTestForm.get('TDTRight').value;
            this.speechTherapySpecialTestModel.TDTLeft = this.speechTherapySpecialTestForm.get('TDTLeft').value;
            this.speechTherapySpecialTestModel.ABLBRight = this.speechTherapySpecialTestForm.get('ABLBRight').value;
            this.speechTherapySpecialTestModel.ABLBLeft = this.speechTherapySpecialTestForm.get('ABLBLeft').value;
            this.speechTherapySpecialTestModel.NotesandInstructions = this.speechTherapySpecialTestForm.get('NotesandInstructions').value;
            this.speechTherapySpecialTestModel.Starttime = this.speechTherapySpecialTestForm.get('Starttime').value;
            this.speechTherapySpecialTestModel.Endtime = this.speechTherapySpecialTestForm.get('Endtime').value;
            this.speechTherapySpecialTestModel.Totalduration = this.speechTherapySpecialTestForm.get('Totalduration').value;
            this.speechTherapySpecialTestModel.Nextfollowupdate = this.speechTherapySpecialTestForm.get('Nextfollowupdate').value;
            
            this.audiologySvc.addUpdateSpeechTherapySpecialTestData(this.speechTherapySpecialTestModel).then(data => {
                this.util.showMessage('', 'Speech therapy special test data saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                    (res) => { }
                )
            });
        }
    }

    resetForm() {
        this.speechTherapySpecialTestForm.reset();
        this.speechTherapySpecialTestForm.get('VisitDateandTime').setValue(this.visitDateandTime);
        this.speechTherapySpecialTestForm.get('recordeDuring').setValue(this.recordedDuring);
        this.speechTherapySpecialTestForm.get('UserName').setValue(localStorage.getItem('LoggedinUser'));
        this.isFollowUp = false;
        this.getSpeechTherapySpecialTest();
    }

    signOff() {
        this.signOffModel.VisitId = this.visitId;
        this.signOffModel.ScreenName = "SpeechTherapySpecialTest";
        this.signOffModel.UserName = this.speechTherapySpecialTestForm.get('UserName').value;
        this.signOffModel.Password = this.speechTherapySpecialTestForm.get('Password').value;
        this.util.showMessage("Delete", "Are you sure want to signoff? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then(
            (res: any) => {
                if (res == true) {
                    this.audiologySvc.signOff(this.signOffModel).then(data => {
                        if (data.status == "Speech Therapy Special Test signOff Success") {
                            this.speechTherapySpecialTestForm.disable();
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