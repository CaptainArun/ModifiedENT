import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomHttpService } from "../../core/custom-http.service";
import { UtilService } from "../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../ux/bmsmsgbox/bmsmsgbox.component";
import { AudiologyService } from "../audiology.service";
import { OAETestModel } from "../model/oaeTestModel";
import { signOffModel } from "../model/signOffModel";

@Component({
    selector: 'audiology-oaetest',
    templateUrl: './audiology-oaetest.component.html',
    styleUrls: ['./audiology-oaetest.component.css']
})

export class AudiologyOAETestComponent implements OnInit {
    oaeTestForm: FormGroup;
    oaeTestModel: OAETestModel = new OAETestModel();
    signOffModel: signOffModel = new signOffModel();
    temporaryDate: Date = new Date();
    isFollowUp = false;
    isShow = false;
    visitId: number;
    oaeData: any;
    visitDateandTime: any;
    recordedDuring: any;
    Starttime: any;
    Endtime: any;
    getTimeHH: number;
    getTimeMin: number;

    constructor(private router: Router, private activeRoute: ActivatedRoute, private fb: FormBuilder, public dialog: MatDialog, private audiologySvc: AudiologyService, private customHttpSvc: CustomHttpService, private util: UtilService) { }

    ngOnInit() {
        this.oaeTestForm = this.fb.group({
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
            this.getOAETest();
        });
    }

    TimeValidation() {
        this.Starttime = this.oaeTestForm.get('Starttime').value;
        this.Endtime = this.oaeTestForm.get('Endtime').value;

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
                this.oaeTestForm.get('Endtime').reset();
            });
        }
    }

    onChange(event) {
        this.isFollowUp = event.checked;
        if(this.isFollowUp == false) {
            this.oaeTestForm.get('Nextfollowupdate').reset();
        }
    }

    getOAETest() {
        this.audiologySvc.getOAETestForPatientVisit(this.visitId).then(res => {
            this.oaeData = res;
            if (res != null && res != undefined) {
                this.oaeTestForm.get('LTEar').setValue(res.LTEar);
                this.oaeTestForm.get('RTEar').setValue(res.RTEar);
                this.oaeTestForm.get('NotesandInstructions').setValue(res.NotesandInstructions);
                if (res.Starttime != null && res.Starttime != undefined) {
                    this.oaeTestForm.get('Starttime').setValue(new Date(res.Starttime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
                }
                if (res.Endtime != null && res.Endtime != undefined) {
                    this.oaeTestForm.get('Endtime').setValue(new Date(res.Endtime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
                }
                this.oaeTestForm.get('Totalduration').setValue(res.Totalduration);
                this.oaeTestForm.get('Nextfollowupdate').setValue(res.Nextfollowupdate);
                this.oaeTestForm.get('VisitDateandTime').setValue(res.VisitDateandTime);
                this.oaeTestForm.get('recordeDuring').setValue(res.recordeDuring);
                if(res.Nextfollowupdate != null && res.Nextfollowupdate != undefined) {
                    this.oaeTestForm.get('checked').setValue(true);
                    this.isFollowUp = true;
                }
                if (res.SignOffStatus == true) {
                    this.oaeTestForm.disable();
                    this.isShow = true;
                }
            }
            else if (res == null) {
                this.audiologySvc.getAudiologyRecords(this.visitId).then(obj => {
                    this.visitDateandTime = obj.VisitDateandTime;
                    this.recordedDuring = obj.recordedDuring;
                    this.oaeTestForm.get('VisitDateandTime').setValue(obj.VisitDateandTime);
                    this.oaeTestForm.get('recordeDuring').setValue(obj.recordedDuring);
                });
            }
        });
    }

    back() {
        this.router.navigate(['home/audiology/consultlist']);
    }

    addUpdateOAETest() {
        if (this.oaeTestForm.valid) {
            this.oaeTestModel.OEATestId = 0;
            this.oaeTestModel.VisitID = this.visitId;  
            this.oaeTestModel.LTEar = this.oaeTestForm.get('LTEar').value;
            this.oaeTestModel.RTEar = this.oaeTestForm.get('RTEar').value;
            this.oaeTestModel.NotesandInstructions = this.oaeTestForm.get('NotesandInstructions').value;
            this.oaeTestModel.Starttime = this.oaeTestForm.get('Starttime').value;
            this.oaeTestModel.Endtime = this.oaeTestForm.get('Endtime').value;
            this.oaeTestModel.Totalduration = this.oaeTestForm.get('Totalduration').value;
            this.oaeTestModel.Nextfollowupdate = this.oaeTestForm.get('Nextfollowupdate').value;
            
            this.audiologySvc.addUpdateOAETestData(this.oaeTestModel).then(data => {
                this.util.showMessage('', 'OAE test data saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                    (res) => { }
                )
            });
        }
    }

    resetForm() {
        this.oaeTestForm.reset();
        this.oaeTestForm.get('VisitDateandTime').setValue(this.visitDateandTime);
        this.oaeTestForm.get('recordeDuring').setValue(this.recordedDuring);
        this.oaeTestForm.get('UserName').setValue(localStorage.getItem('LoggedinUser'));
        this.isFollowUp = false;
        this.getOAETest();
    }

    signOff() {
        this.signOffModel.VisitId = this.visitId;
        this.signOffModel.ScreenName = "OAETest";
        this.signOffModel.UserName = this.oaeTestForm.get('UserName').value;
        this.signOffModel.Password = this.oaeTestForm.get('Password').value;
        this.util.showMessage("Delete", "Are you sure want to signoff? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then(
            (res: any) => {
                if (res == true) {
                    this.audiologySvc.signOff(this.signOffModel).then(data => {
                        if (data.status == "OAE Test signOff Success") {
                            this.oaeTestForm.disable();
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