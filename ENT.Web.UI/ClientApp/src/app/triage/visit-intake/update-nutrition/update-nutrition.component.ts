import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NutritionAssessmentModel } from "../../../triage/models/nutritionAssessmentModel";
import { TriageService } from "../../../triage/triage.service";
import { CustomHttpService } from "../../../core/custom-http.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode, } from "../../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: "app-updateNutritionComponent",
  templateUrl: "./update-nutrition.component.html",
  styleUrls: ["./update-nutrition.component.css"],
})
export class updateNutritionComponent implements OnInit {

  NutritionForm: FormGroup;
  patientNutritionModel: NutritionAssessmentModel = new NutritionAssessmentModel();
  visitId: number;
  patientById = [];
  patientvisitHistoryList: any;
  visitIntake: any;
  recordedDuring: any = "";
  visitID: number;
  visitDandt: any[] = [];
  facilityId: number = 0;
  recordby: any[] = [];
  cpt: any;
  getDate: any;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  foodIntakeTypes: any;
  IntakeCategoryValue: any;
  EatRegularlyvalue: any;

  constructor(
    public triageService: TriageService,
    public fb: FormBuilder,
    public customHttpSvc: CustomHttpService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<updateNutritionComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: any,
    private util: UtilService
  ) { }

  ngOnInit() {
    this.NutritionForm = this.fb.group({
      NutritionAssessmentID: [""],
      VisitId: [""],
      VisitDateandTime: ["", Validators.required],
      RecordedDate: ["", Validators.required],
      RecordedTime: ["", Validators.required],
      recordedDuring: ["", Validators.required],
      RecordedBy: ["", Validators.required],
      PatientId: [""],
      IntakeCategory: [""],
      FoodIntakeTypeID: [""],
      EatRegularly: [""],
      RegularMeals: [""],
      Carvings: [""],
      DislikedIntake: [""],
      FoodAllergies: [""],
      Notes: [""],
      FoodName: [""],
      Units: [""],
      Frequency: [""],
      NutritionNotes: [""],
      FoodIntakeTypeDesc: [""]
    });
    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));
    this.getProviderNames();
    this.bindAllFoodIntakeTypes();
    this.setNutrition();
    this.getIntakeCategoryValue();
    this.getEatRegularlyvalue();
  }
  getEatRegularlyvalue() {
    this.triageService.getEatRegularlyvalue().then((res) => {
      this.EatRegularlyvalue = res;
    });
  }

  getIntakeCategoryValue() {
    this.triageService.getIntakeCategoryValue().then((res) => {
      this.IntakeCategoryValue = res;
    });
  }

  getProviderNames() {
    this.triageService.getProviderNames(this.facilityId).then((res) => {
      this.recordby = res;
    });
  }

  bindAllFoodIntakeTypes() {
    this.triageService.getAllFoodIntakeTypes().then((data) => {
      this.foodIntakeTypes = data;
    });
  }

  setNutrition() {

    this.NutritionForm.get("RecordedDate").setValue(new Date(this.data1.RecordedDate));
    this.NutritionForm.get("RecordedTime").setValue(new Date(this.data1.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.recordedDuring = this.data1.recordedDuring;
    this.NutritionForm.get("RecordedBy").setValue(this.data1.RecordedBy);
    this.NutritionForm.get("VisitDateandTime").setValue(this.data1.visitDateandTime);
    this.NutritionForm.get("recordedDuring").setValue(this.data1.recordedDuring);
    this.NutritionForm.get("IntakeCategory").setValue(this.data1.IntakeCategory);
    this.NutritionForm.get("FoodIntakeTypeID").setValue(this.data1.FoodIntakeTypeID);
    this.NutritionForm.get("EatRegularly").setValue(this.data1.EatRegularly);
    this.NutritionForm.get("RegularMeals").setValue(this.data1.RegularMeals);
    this.NutritionForm.get("Carvings").setValue(this.data1.Carvings);
    this.NutritionForm.get("DislikedIntake").setValue(this.data1.DislikedIntake);
    this.NutritionForm.get("FoodAllergies").setValue(this.data1.FoodAllergies);
    this.NutritionForm.get("Notes").setValue(this.data1.Notes);
    this.NutritionForm.get("FoodName").setValue(this.data1.FoodName);
    this.NutritionForm.get("Units").setValue(this.data1.Units);
    this.NutritionForm.get("Frequency").setValue(this.data1.Frequency);
    this.NutritionForm.get("NutritionNotes").setValue(this.data1.NutritionNotes);
    this.NutritionForm.get("FoodIntakeTypeDesc").setValue(this.data1.FoodIntakeTypeDesc);

  }

  sendDateWithTime() {
    this.getDate = new Date(this.NutritionForm.get("RecordedDate").value);

    if (this.NutritionForm.get("RecordedDate").value != "") {
      if (this.NutritionForm.get("RecordedTime").value.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.NutritionForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 12;
        } else {
          this.getTimeHH = parseInt(this.NutritionForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (this.NutritionForm.get("RecordedTime").value.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.NutritionForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.NutritionForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[0]);
        }
      }
      this.getTimeMin = parseInt(this.NutritionForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getDateAndTime = this.getDate;
  }

  addUpdateNutrition() {
    this.sendDateWithTime();
    this.patientNutritionModel.RecordedDate = this.getDateAndTime;
    this.patientNutritionModel.RecordedBy = this.NutritionForm.get("RecordedBy").value;
    this.patientNutritionModel.recordedDuring = this.recordedDuring;
    this.patientNutritionModel.PatientId = this.data1.PatientId;
    this.patientNutritionModel.VisitId = this.data1.VisitId;
    this.patientNutritionModel.NutritionAssessmentID = this.data1.NutritionAssessmentID;
    this.patientNutritionModel.IntakeCategory = this.NutritionForm.get("IntakeCategory").value;
    this.patientNutritionModel.FoodIntakeTypeID = this.NutritionForm.get("FoodIntakeTypeID").value;
    this.patientNutritionModel.EatRegularly = this.NutritionForm.get("EatRegularly").value;
    this.patientNutritionModel.RegularMeals = this.NutritionForm.get("RegularMeals").value;
    this.patientNutritionModel.Carvings = this.NutritionForm.get("Carvings").value;
    this.patientNutritionModel.DislikedIntake = this.NutritionForm.get("DislikedIntake").value;
    this.patientNutritionModel.FoodAllergies = this.NutritionForm.get("FoodAllergies").value;
    this.patientNutritionModel.Notes = this.NutritionForm.get("Notes").value;
    this.patientNutritionModel.FoodName = this.NutritionForm.get("FoodName").value;
    this.patientNutritionModel.Units = this.NutritionForm.get("Units").value;
    this.patientNutritionModel.Frequency = parseInt(this.NutritionForm.get("Frequency").value);
    this.patientNutritionModel.NutritionNotes = this.NutritionForm.get("NutritionNotes").value;
    this.patientNutritionModel.visitDateandTime = this.NutritionForm.get("VisitDateandTime").value;
    this.patientNutritionModel.recordedDuring = this.NutritionForm.get("recordedDuring").value;
    this.patientNutritionModel.FoodIntakeTypeDesc = this.NutritionForm.get("FoodIntakeTypeDesc").value;
    this.dialogRef.close(this.patientNutritionModel);

    // this.triageService.addSingleNutritionRecord(this.patientNutritionModel).then((data) => {
    //   this.util.showMessage("", "Nutrition details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { });

    // });
  }

  cancelForm() {
    this.NutritionForm.reset();
    this.setNutrition();
  }

  dialogClose(): void {
    this.dialogRef.close();
  }
  tosetFoodIntakeTypeDesc(desc: string) {
    this.NutritionForm.get('FoodIntakeTypeDesc').setValue(desc);
  }
}
