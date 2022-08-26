import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ImgViewerComponent } from 'ng-picture-viewer';
import { TriageService } from '../triage.service';

@Component({
  selector: 'triage-imagesPopupComponent',
  templateUrl: 'triage-imagesPopup.component.html'
})

export class TriageImagesPopupComponent implements OnInit {
  imagesForm: FormGroup;
  getVisitDT: any;
  visitDateandTime: any;
  leftImgView: any;
  leftImgFile: any;
  listOfLeftImage: Array<File> = [];
  leftImgSrc: any;
  leftShowImg: boolean;
  rightImgView: any;
  rightImgFile: any;
  listOfRightImage: Array<File> = [];
  rightImgSrc: any;
  rightShowImg: boolean;

  @ViewChild('viewLeftImg', { static: true }) leftImgCtrl: ImgViewerComponent;
  @ViewChild('viewRightImg', { static: false }) rightImgCtrl: ImgViewerComponent;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<TriageImagesPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public triageService: TriageService, private sanitizer: DomSanitizer) {
    this.leftShowImg = true;
  }

  ngOnInit() {
    this.imagesForm = this.fb.group({
      VisitDateandTime: [''],
    });
    this.getVisitDateandTime();
    this.loadRightSide();
    this.leftToolTip();
    if (this.data.imageCount) {
      this.leftShowImg = false;
    }
    else {
      this.leftShowImg = true;
      this.leftImgSrc = [];
    }
    if (!this.leftShowImg) {
      this.displayLeftImg();
    }
  }

  getVisitDateandTime() {
    this.triageService.getPreviousVisitRecordById(this.data.VisitID).then(res => {
      this.getVisitDT = res;
      if (this.getVisitDT) {
        let DT = this.getVisitDT[0];
        if (DT != undefined && DT != null) {
          this.imagesForm.get('VisitDateandTime').setValue(DT.VisitDateandTime);
        }
      }
    });
    this.visitDateandTime = this.data.visitDateandTime;
  }

  leftToolTip() {
    this.leftImgCtrl.imageViewerType.zoomInToolTip = "zoom in";
    this.leftImgCtrl.imageViewerType.zoomOutToolTip = "zoom out";
    this.leftImgCtrl.imageViewerType.resetToolTip = "reset";
    this.leftImgCtrl.imageViewerType.fullScreenToolTip = "full screen";
    this.leftImgCtrl.imageViewerType.downloadToolTip = "download";
  }

  rightToolTip() {
    this.rightImgCtrl.imageViewerType.zoomInToolTip = "zoom in";
    this.rightImgCtrl.imageViewerType.zoomOutToolTip = "zoom out";
    this.rightImgCtrl.imageViewerType.resetToolTip = "reset";
    this.rightImgCtrl.imageViewerType.fullScreenToolTip = "full screen";
    this.rightImgCtrl.imageViewerType.downloadToolTip = "download";
  }

  loadRightSide() {
    this.triageService.getPreviousVisitRecordById(this.data.VisitID).then(res => {
      let data = res[0];
      if (data != undefined && data != null) {
        let visitId = data.VisitId;
        this.displayRightImg(visitId);
      }
    });
  }

  displayLeftImg() {
    let imgData = [];
    imgData = this.data.imageSet;
    for (let i = 0; i < imgData.length; i++) {
      this.leftImgView = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + imgData[i]);
      this.leftImgFile = this.leftImgView.changingThisBreaksApplicationSecurity;
      this.listOfLeftImage.push(this.leftImgFile);
    }
    this.leftImgSrc = this.listOfLeftImage;
  }

  displayRightImg(visitId) {
    this.triageService.getDiagnosisRecordById(visitId).then(res => {
      if (res.imageSet != null && res.imageSet.length > 0) {
        this.rightShowImg = true;
        let imageData = res.imageSet;
        for (let i = 0; i < imageData.length; i++) {
          this.rightImgView = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + imageData[i]);
          this.rightImgFile = this.rightImgView.changingThisBreaksApplicationSecurity;
          this.listOfRightImage.push(this.rightImgFile);
        }
        this.rightImgSrc = this.listOfRightImage;
        setTimeout(() => {
          let a = [];
          a = this.rightImgSrc;
          if (a.length > 0) {
            this.rightToolTip();
            this.rightImgCtrl.showImg();
          }
        }, 1);
      }
      else {
        this.rightShowImg = false;
      }
    });
    this.listOfRightImage = [];
  }

  getLeftImg(e) {
    this.leftImgSrc = [];
    this.leftImgSrc.push(e);
    this.leftImgCtrl.images = this.leftImgSrc;
    this.leftImgCtrl.showImg();
  }

  getRightImg(e) {
    this.rightImgSrc = [];
    this.rightImgSrc.push(e);
    this.rightImgCtrl.images = this.rightImgSrc;
    this.rightImgCtrl.showImg();
  }

  dialogClose() {
    this.dialogRef.close();
  }

}