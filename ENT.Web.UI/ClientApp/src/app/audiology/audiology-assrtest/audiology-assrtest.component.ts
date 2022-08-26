import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomHttpService } from "../../core/custom-http.service";
import { UtilService } from "../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../ux/bmsmsgbox/bmsmsgbox.component";
import { AudiologyService } from "../audiology.service";
import { ASSRTestModel } from "../model/assrTestModel";
import { signOffModel } from "../model/signOffModel";

@Component({
    selector: 'audiology-assrtest',
    templateUrl: './audiology-assrtest.component.html',
    styleUrls: ['./audiology-assrtest.component.css']
})

export class AudiologyASSRTestComponent implements OnInit {
    assrTestForm: FormGroup;
    assrTestModel: ASSRTestModel = new ASSRTestModel();
    signOffModel: signOffModel = new signOffModel();
    temporaryDate: Date = new Date();
    isFollowUp = false;
    isShow = false;
    visitId: number;
    assrData: any;
    visitDateandTime: any;
    recordedDuring: any;
    Starttime: any;
    Endtime: any;
    getTimeHH: number;
    getTimeMin: number;
  
    constructor(private router: Router, private activeRoute: ActivatedRoute, private fb: FormBuilder, public dialog: MatDialog, private audiologySvc: AudiologyService, private customHttpSvc: CustomHttpService, private util: UtilService) { }

    ngOnInit() {
        this.assrTestForm = this.fb.group({
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
            this.getASSRTest();
        });
    }

    TimeValidation() {
        this.Starttime = this.assrTestForm.get('Starttime').value;
        this.Endtime = this.assrTestForm.get('Endtime').value;

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
            } 
            else if (this.Endtime.toString().toLowerCase().split(" ")[1] == "am") {
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
                this.assrTestForm.get('Endtime').reset();
            });
        }
    }

    onChange(event) {
        this.isFollowUp = event.checked;
        if(this.isFollowUp == false) {
            this.assrTestForm.get('Nextfollowupdate').reset();
        }
    }

    getASSRTest() {
        this.audiologySvc.getASSRTestForPatientVisit(this.visitId).then(res => {
            this.assrData = res;
            if (res != null && res != undefined) {
                this.assrTestForm.get('LTEar').setValue(res.LTEar);
                this.assrTestForm.get('RTEar').setValue(res.RTEar);
                this.assrTestForm.get('NotesandInstructions').setValue(res.NotesandInstructions);
                if (res.Starttime != null && res.Starttime != undefined) {
                    this.assrTestForm.get('Starttime').setValue(new Date(res.Starttime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
                }
                if (res.Endtime != null && res.Endtime != undefined) {
                    this.assrTestForm.get('Endtime').setValue(new Date(res.Endtime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
                }
                this.assrTestForm.get('Totalduration').setValue(res.Totalduration);
                this.assrTestForm.get('Nextfollowupdate').setValue(res.Nextfollowupdate);
                this.assrTestForm.get('VisitDateandTime').setValue(res.VisitDateandTime);
                this.assrTestForm.get('recordeDuring').setValue(res.recordeDuring);
                if (res.Nextfollowupdate != null && res.Nextfollowupdate != undefined) {
                    this.assrTestForm.get('checked').setValue(true);
                    this.isFollowUp = true;
                }
                if (res.SignOffStatus == true) {
                    this.assrTestForm.disable();
                    this.isShow = true;
                }
            }
            else if (res == null) {
                this.audiologySvc.getAudiologyRecords(this.visitId).then(obj => {
                    this.visitDateandTime = obj.VisitDateandTime;
                    this.recordedDuring = obj.recordedDuring;
                    this.assrTestForm.get('VisitDateandTime').setValue(obj.VisitDateandTime);
                    this.assrTestForm.get('recordeDuring').setValue(obj.recordedDuring);
                });
            }
        });
    }

    back() {
        this.router.navigate(['home/audiology/consultlist']);
    }

    addUpdateASSRTest() {
        if (this.assrTestForm.valid) {
            this.assrTestModel.ASSRTestId = 0;
            this.assrTestModel.VisitID = this.visitId;
            this.assrTestModel.LTEar = this.assrTestForm.get('LTEar').value;
            this.assrTestModel.RTEar = this.assrTestForm.get('RTEar').value;
            this.assrTestModel.Starttime = this.assrTestForm.get('Starttime').value;
            this.assrTestModel.Endtime = this.assrTestForm.get('Endtime').value;
            this.assrTestModel.Totalduration = this.assrTestForm.get('Totalduration').value;
            this.assrTestModel.NotesandInstructions = this.assrTestForm.get('NotesandInstructions').value;
            this.assrTestModel.Nextfollowupdate = this.assrTestForm.get('Nextfollowupdate').value;

            this.audiologySvc.addUpdateASSRTestData(this.assrTestModel).then(res => {
                this.util.showMessage('', 'ASSR test data saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                    (res) => { }
                )
            });
        }
    }

    resetForm() {
        this.assrTestForm.reset();
        this.assrTestForm.get('VisitDateandTime').setValue(this.visitDateandTime);
        this.assrTestForm.get('recordeDuring').setValue(this.recordedDuring);
        this.assrTestForm.get('UserName').setValue(localStorage.getItem('LoggedinUser'));
        this.isFollowUp = false;
        this.getASSRTest();
    }

    signOff() {
        this.signOffModel.VisitId = this.visitId;
        this.signOffModel.ScreenName = "ASSR Test";
        this.signOffModel.UserName = this.assrTestForm.get('UserName').value;
        this.signOffModel.Password = this.assrTestForm.get('Password').value;
        this.util.showMessage("Delete", "Are you sure want to signoff? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then(
            (res: any) => {
                if (res == true) {
                    this.audiologySvc.signOff(this.signOffModel).then(data => {
                        if (data.status == "ASSR Test signOff Success") {
                            this.assrTestForm.disable();
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