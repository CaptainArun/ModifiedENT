import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomHttpService } from "../../core/custom-http.service";
import { UtilService } from "../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../ux/bmsmsgbox/bmsmsgbox.component";
import { AudiologyService } from "../audiology.service";
import { signOffModel } from "../model/signOffModel";
import { TinnitusMaskingModel } from "../model/tinnitusMaskingModel";

@Component({
    selector: 'audiology-tinnitus-masking',
    templateUrl: './audiology-tinnitus-masking.component.html',
    styleUrls: ['./audiology-tinnitus-masking.component.css']
})

export class AudiologyTinnitusMaskingComponent implements OnInit {
    tinnitusMaskingForm: FormGroup;
    tinnitusMaskingModel: TinnitusMaskingModel = new TinnitusMaskingModel();
    signOffModel: signOffModel = new signOffModel();
    temporaryDate: Date = new Date();
    isFollowUp = false;
    isShow = false;
    visitId: number;
    tinnitusMaskingData: any;
    visitDateandTime: any;
    recordedDuring: any;
    Starttime: any;
    Endtime: any;
    getTimeHH: number;
    getTimeMin: number;

    constructor(private router: Router, private activeRoute: ActivatedRoute, private fb: FormBuilder, public dialog: MatDialog, private audiologySvc: AudiologyService, private customHttpSvc: CustomHttpService, private util: UtilService) { }

    ngOnInit() {
        this.tinnitusMaskingForm = this.fb.group({
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
            this.getTinnitusmaskingData();
        });
    }

    TimeValidation() {
        this.Starttime = this.tinnitusMaskingForm.get('Starttime').value;
        this.Endtime = this.tinnitusMaskingForm.get('Endtime').value;

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
                this.tinnitusMaskingForm.get('Endtime').reset();
            });
        }
    }

    onChange(event) {
        this.isFollowUp = event.checked;
        if(this.isFollowUp == false) {
            this.tinnitusMaskingForm.get('Nextfollowupdate').reset();
        }
    }

    getTinnitusmaskingData() {
        this.audiologySvc.getTinnitusMaskingDataForPatientVisit(this.visitId).then(res => {
            this.tinnitusMaskingData = res;
            if (res != null && res != undefined) {
                this.tinnitusMaskingForm.get('LTEar').setValue(res.LTEar);
                this.tinnitusMaskingForm.get('RTEar').setValue(res.RTEar);
                this.tinnitusMaskingForm.get('NotesandInstructions').setValue(res.NotesandInstructions);
                if (res.Starttime != null && res.Starttime != undefined) {
                    this.tinnitusMaskingForm.get('Starttime').setValue(new Date(res.Starttime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
                }
                if (res.Endtime != null && res.Endtime != undefined) {
                    this.tinnitusMaskingForm.get('Endtime').setValue(new Date(res.Endtime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
                }
                this.tinnitusMaskingForm.get('Totalduration').setValue(res.Totalduration);
                this.tinnitusMaskingForm.get('Nextfollowupdate').setValue(res.Nextfollowupdate);
                this.tinnitusMaskingForm.get('VisitDateandTime').setValue(res.VisitDateandTime);
                this.tinnitusMaskingForm.get('recordeDuring').setValue(res.recordeDuring);
                if(res.Nextfollowupdate != null && res.Nextfollowupdate != undefined) {
                    this.tinnitusMaskingForm.get('checked').setValue(true);
                    this.isFollowUp = true;
                }
                if (res.SignOffStatus == true) {
                    this.tinnitusMaskingForm.disable();
                    this.isShow = true;
                }
            }
            else if (res == null) {
                this.audiologySvc.getAudiologyRecords(this.visitId).then(obj => {
                    this.visitDateandTime = obj.VisitDateandTime;
                    this.recordedDuring = obj.recordedDuring;
                    this.tinnitusMaskingForm.get('VisitDateandTime').setValue(obj.VisitDateandTime);
                    this.tinnitusMaskingForm.get('recordeDuring').setValue(obj.recordedDuring);
                });
            }
        });
    }

    back() {
        this.router.navigate(['home/audiology/consultlist']);
    }

    addUpdateTinnitusMasking() {
        if (this.tinnitusMaskingForm.valid) {
            this.tinnitusMaskingModel.TinnitusmaskingId = 0;
            this.tinnitusMaskingModel.VisitID = this.visitId;
            this.tinnitusMaskingModel.LTEar = this.tinnitusMaskingForm.get('LTEar').value;
            this.tinnitusMaskingModel.RTEar = this.tinnitusMaskingForm.get('RTEar').value;
            this.tinnitusMaskingModel.NotesandInstructions = this.tinnitusMaskingForm.get('NotesandInstructions').value;
            this.tinnitusMaskingModel.Starttime = this.tinnitusMaskingForm.get('Starttime').value;
            this.tinnitusMaskingModel.Endtime = this.tinnitusMaskingForm.get('Endtime').value;
            this.tinnitusMaskingModel.Totalduration = this.tinnitusMaskingForm.get('Totalduration').value;
            this.tinnitusMaskingModel.Nextfollowupdate = this.tinnitusMaskingForm.get('Nextfollowupdate').value;
            
            this.audiologySvc.addUpdateTinnitusMaskingData(this.tinnitusMaskingModel).then(data => {
                this.util.showMessage('', 'Tinnitus masking data saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                    (res) => { }
                )
            });
        }
    }

    resetForm() {
        this.tinnitusMaskingForm.reset();
        this.tinnitusMaskingForm.get('VisitDateandTime').setValue(this.visitDateandTime);
        this.tinnitusMaskingForm.get('recordeDuring').setValue(this.recordedDuring);
        this.tinnitusMaskingForm.get('UserName').setValue(localStorage.getItem('LoggedinUser'));
        this.isFollowUp = false;
        this.getTinnitusmaskingData();
    }

    signOff() {
        this.signOffModel.VisitId = this.visitId;
        this.signOffModel.ScreenName = "TinnitusMaskingTest";
        this.signOffModel.UserName = this.tinnitusMaskingForm.get('UserName').value;
        this.signOffModel.Password = this.tinnitusMaskingForm.get('Password').value;
        this.util.showMessage("Delete", "Are you sure want to signoff? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then(
            (res: any) => {
                if (res == true) {
                    this.audiologySvc.signOff(this.signOffModel).then(data => {
                        if (data.status == "Tinnitus Masking signOff Success") {
                            this.tinnitusMaskingForm.disable();
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