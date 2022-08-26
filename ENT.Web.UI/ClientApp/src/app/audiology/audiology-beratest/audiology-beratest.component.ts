import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomHttpService } from "../../core/custom-http.service";
import { UtilService } from "../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../ux/bmsmsgbox/bmsmsgbox.component";
import { AudiologyService } from "../audiology.service";
import { BERATestModel } from "../model/beraTestModel";
import { signOffModel } from "../model/signOffModel";

@Component({
    selector: 'audiology-beratest',
    templateUrl: './audiology-beratest.component.html',
    styleUrls: ['./audiology-beratest.component.css']
})

export class AudiologyBERATestComponent implements OnInit {
    beraTestForm: FormGroup;
    beraTestModel: BERATestModel = new BERATestModel();
    signOffModel: signOffModel = new signOffModel();
    temporaryDate: Date = new Date();
    isFollowUp = false;
    isShow = false;
    visitId: number;
    beraData: any;
    visitDateandTime: any;
    recordedDuring: any;
    Starttime: any;
    Endtime: any;
    getTimeHH: number;
    getTimeMin: number;
  
    constructor(private router: Router, private activeRoute: ActivatedRoute, private fb: FormBuilder, public dialog: MatDialog, private audiologySvc: AudiologyService, private customHttpSvc: CustomHttpService, private util: UtilService) { }

    ngOnInit() {
        this.beraTestForm = this.fb.group({
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
            this.getBERATest();
        });
    }

    TimeValidation() {
        this.Starttime = this.beraTestForm.get('Starttime').value;
        this.Endtime = this.beraTestForm.get('Endtime').value;

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
                this.beraTestForm.get('Endtime').reset();
            });
        }
    }

    onChange(event) {
        this.isFollowUp = event.checked;
        if(this.isFollowUp == false) {
            this.beraTestForm.get('Nextfollowupdate').reset();
        }
    }

    getBERATest() {
        this.audiologySvc.getBERATestForPatientVisit(this.visitId).then(res => {
            this.beraData = res;
            if (res != null && res != undefined) {
                this.beraTestForm.get('LTEar').setValue(res.LTEar);
                this.beraTestForm.get('RTEar').setValue(res.RTEar);
                this.beraTestForm.get('NotesandInstructions').setValue(res.NotesandInstructions);
                if (res.Starttime != null && res.Starttime != undefined) {
                    this.beraTestForm.get('Starttime').setValue(new Date(res.Starttime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
                }
                if (res.Endtime != null && res.Endtime != undefined) {
                    this.beraTestForm.get('Endtime').setValue(new Date(res.Endtime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
                }
                this.beraTestForm.get('Totalduration').setValue(res.Totalduration);
                this.beraTestForm.get('Nextfollowupdate').setValue(res.Nextfollowupdate);
                this.beraTestForm.get('VisitDateandTime').setValue(res.VisitDateandTime);
                this.beraTestForm.get('recordeDuring').setValue(res.recordeDuring);
                if (res.Nextfollowupdate != null && res.Nextfollowupdate != undefined) {
                    this.beraTestForm.get('checked').setValue(true);
                    this.isFollowUp = true;
                }
                if (res.SignOffStatus == true) {
                    this.beraTestForm.disable();
                    this.isShow = true;
                }
            }
            else if (res == null) {
                this.audiologySvc.getAudiologyRecords(this.visitId).then(obj => {
                    this.visitDateandTime = obj.VisitDateandTime;
                    this.recordedDuring = obj.recordedDuring;
                    this.beraTestForm.get('VisitDateandTime').setValue(obj.VisitDateandTime);
                    this.beraTestForm.get('recordeDuring').setValue(obj.recordedDuring);
                })
            }
        });
    }

    back() {
        this.router.navigate(['home/audiology/consultlist']);
    }

    addUpdateBeraTest() {
        if (this.beraTestForm.valid) {
            this.beraTestModel.BERATestId = 0;
            this.beraTestModel.VisitID = this.visitId;
            this.beraTestModel.LTEar = this.beraTestForm.get('LTEar').value;
            this.beraTestModel.RTEar = this.beraTestForm.get('RTEar').value;
            this.beraTestModel.NotesandInstructions = this.beraTestForm.get('NotesandInstructions').value;
            this.beraTestModel.Starttime = this.beraTestForm.get('Starttime').value;
            this.beraTestModel.Endtime = this.beraTestForm.get('Endtime').value;
            this.beraTestModel.Totalduration = this.beraTestForm.get('Totalduration').value;
            this.beraTestModel.Nextfollowupdate = this.beraTestForm.get('Nextfollowupdate').value;

            this.audiologySvc.addUpdateBERATestData(this.beraTestModel).then(data => {
                this.util.showMessage('', 'BERA test data saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                    (res) => { }
                )
            });
        }
    }

    resetForm() {
        this.beraTestForm.reset();
        this.beraTestForm.get('VisitDateandTime').setValue(this.visitDateandTime);
        this.beraTestForm.get('recordeDuring').setValue(this.recordedDuring);
        this.beraTestForm.get('UserName').setValue(localStorage.getItem('LoggedinUser'));
        this.isFollowUp = false;
        this.getBERATest();
    }

    signOff() {
        this.signOffModel.VisitId = this.visitId;
        this.signOffModel.ScreenName = "BERA Test";
        this.signOffModel.UserName = this.beraTestForm.get('UserName').value;
        this.signOffModel.Password = this.beraTestForm.get('Password').value;
        this.util.showMessage("Delete", "Are you sure want to signoff? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then(
            (res: any) => {
                if (res == true) {
                    this.audiologySvc.signOff(this.signOffModel).then(data => {
                        if (data.status == "BERA Test signOff Success") {
                            this.beraTestForm.disable();
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