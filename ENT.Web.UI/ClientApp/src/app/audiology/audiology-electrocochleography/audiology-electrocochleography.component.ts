import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomHttpService } from "../../core/custom-http.service";
import { UtilService } from "../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../ux/bmsmsgbox/bmsmsgbox.component";
import { AudiologyService } from "../audiology.service";
import { ElectrocochleographyModel } from "../model/electrocochleographyModel";
import { signOffModel } from "../model/signOffModel";

@Component({
    selector: 'audiology-electrocochleography',
    templateUrl: './audiology-electrocochleography.component.html',
    styleUrls: ['./audiology-electrocochleography.component.css']
})

export class AudiologyElectrocochleographyComponent implements OnInit {
    electrocochleographyForm: FormGroup;
    electrocochleographyModel: ElectrocochleographyModel = new ElectrocochleographyModel();
    signOffModel: signOffModel = new signOffModel();
    temporaryDate: Date = new Date();
    isFollowUp = false;
    isShow = false;
    visitId: number;
    electrocochleographyData: any;
    visitDateandTime: any;
    recordedDuring: any;
    Starttime: any;
    Endtime: any;
    getTimeHH: number;
    getTimeMin: number;

    constructor(private router: Router, private activeRoute: ActivatedRoute, private fb: FormBuilder, public dialog: MatDialog, private audiologySvc: AudiologyService, private customHttpSvc: CustomHttpService, private util: UtilService) { }

    ngOnInit() {
        this.electrocochleographyForm = this.fb.group({
            VisitDateandTime: ['', Validators.required],
            recordeDuring: ['', Validators.required],
            LTEar: ['', Validators.required],
            RTEar: ['', Validators.required],
            Starttime: [''],
            Endtime: [''],
            Totalduration: [''],
            ClinicalNotes: [''],
            checked: [''],
            Nextfollowupdate: [''],
            UserName: [localStorage.getItem('LoggedinUser')],
            Password: ['']
        });
        this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
        this.activeRoute.params.subscribe(params => {
            this.visitId = params.id;
            this.getElectrocochleographyTest();
        });
    }

    TimeValidation() {
        this.Starttime = this.electrocochleographyForm.get('Starttime').value;
        this.Endtime = this.electrocochleographyForm.get('Endtime').value;

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
                this.electrocochleographyForm.get('Endtime').reset();
            });
        }
    }
  
    onChange(event) {
        this.isFollowUp = event.checked;
        if(this.isFollowUp == false) {
            this.electrocochleographyForm.get('Nextfollowupdate').reset();
        }
    }

    getElectrocochleographyTest() {
        this.audiologySvc.getElectrocochleographyForPatientVisit(this.visitId).then(res => {
            this.electrocochleographyData = res;
            if (res != null && res != undefined) {
                this.electrocochleographyForm.get('LTEar').setValue(res.LTEar);
                this.electrocochleographyForm.get('RTEar').setValue(res.RTEar);
                this.electrocochleographyForm.get('ClinicalNotes').setValue(res.ClinicalNotes);
                if (res.Starttime != null && res.Starttime != undefined) {
                    this.electrocochleographyForm.get('Starttime').setValue(new Date(res.Starttime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
                }
                if (res.Endtime != null && res.Endtime != undefined) {
                    this.electrocochleographyForm.get('Endtime').setValue(new Date(res.Endtime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }));
                }
                this.electrocochleographyForm.get('Totalduration').setValue(res.Totalduration);
                this.electrocochleographyForm.get('Nextfollowupdate').setValue(res.Nextfollowupdate);
                this.electrocochleographyForm.get('VisitDateandTime').setValue(res.VisitDateandTime);
                this.electrocochleographyForm.get('recordeDuring').setValue(res.recordeDuring);
                if (res.Nextfollowupdate != null && res.Nextfollowupdate != undefined) {
                    this.electrocochleographyForm.get('checked').setValue(true);
                    this.isFollowUp = true;
                }
                if (res.SignOffStatus == true) {
                    this.electrocochleographyForm.disable();
                    this.isShow = true;
                }
            }
            else if (res == null) {
                this.audiologySvc.getAudiologyRecords(this.visitId).then(obj => {
                    this.visitDateandTime = obj.VisitDateandTime;
                    this.recordedDuring = obj.recordedDuring;
                    this.electrocochleographyForm.get('VisitDateandTime').setValue(obj.VisitDateandTime);
                    this.electrocochleographyForm.get('recordeDuring').setValue(obj.recordedDuring);
                })
            }
        });
    }
    
    back() {
        this.router.navigate(['home/audiology/consultlist']);
    }

    addUpdateElectrocochleography() {
        if (this.electrocochleographyForm.valid) {
            this.electrocochleographyModel.ElectrocochleographyId = 0; 
            this.electrocochleographyModel.VisitID = this.visitId;    
            this.electrocochleographyModel.LTEar = this.electrocochleographyForm.get('LTEar').value;
            this.electrocochleographyModel.RTEar = this.electrocochleographyForm.get('RTEar').value;
            this.electrocochleographyModel.ClinicalNotes = this.electrocochleographyForm.get('ClinicalNotes').value;
            this.electrocochleographyModel.Starttime = this.electrocochleographyForm.get('Starttime').value;
            this.electrocochleographyModel.Endtime = this.electrocochleographyForm.get('Endtime').value;
            this.electrocochleographyModel.Totalduration = this.electrocochleographyForm.get('Totalduration').value;
            this.electrocochleographyModel.Nextfollowupdate = this.electrocochleographyForm.get('Nextfollowupdate').value;
            
            this.audiologySvc.addUpdateElectrocochleographyData(this.electrocochleographyModel).then(data => {
                this.util.showMessage('', 'Electrocochleography data saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                    (res) => { }
                )
            });
        }
    }

    resetForm() {
        this.electrocochleographyForm.reset();
        this.electrocochleographyForm.get('VisitDateandTime').setValue(this.visitDateandTime);
        this.electrocochleographyForm.get('recordeDuring').setValue(this.recordedDuring);
        this.electrocochleographyForm.get('UserName').setValue(localStorage.getItem('LoggedinUser'));
        this.isFollowUp = false;
        this.getElectrocochleographyTest();
    }

    signOff() {
        this.signOffModel.VisitId = this.visitId;
        this.signOffModel.ScreenName = "Electrocochleography Test";
        this.signOffModel.UserName = this.electrocochleographyForm.get('UserName').value;
        this.signOffModel.Password = this.electrocochleographyForm.get('Password').value;
        this.util.showMessage("Delete", "Are you sure want to signoff? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then(
            (res: any) => {
                if (res == true) {
                    this.audiologySvc.signOff(this.signOffModel).then(data => {
                        if (data.status == "Electrocochleography Test signOff Success") {
                            this.electrocochleographyForm.disable();
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