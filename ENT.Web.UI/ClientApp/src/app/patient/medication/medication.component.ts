import { Component, OnInit } from "@angular/core";
import { TableConfig } from "../../ux/columnConfig";
import { NewPatientService } from "../newPatient.service";
import { CustomHttpService } from "../../core/custom-http.service";
import { MatDialog } from "@angular/material";
import { AddMedicationComponent } from "./add-medication/add-medication.component";
import { ViewMedicationComponent } from "./view-medication/view-medication.component";
import { UpdateMedicationComponent } from "./update-medication/update-medication.component";
import { ActivatedRoute } from "@angular/router";
import { UtilService } from "../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: "app-medication",
  templateUrl: "./medication.component.html",
  styleUrls: ["./medication.component.css"],
})
export class MedicationComponent implements OnInit {
  tableConfig: TableConfig = new TableConfig();
  patientId: any;
  medicationRecord: any;
  constructor(
    public newPatientService: NewPatientService,
    public custHttp: CustomHttpService,
    public dialog: MatDialog,
    public activateRoute: ActivatedRoute,
    public config: UtilService
  ) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    // this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    //this.tableConfig.showDelete = true;

    this.tableConfig.columnConfig = [
      {
        PropertyName: "visitDateandTime",
        DisplayName: "visit Date and Time",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "DrugName",
        DisplayName: "DrugName",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "ICDCode",
        DisplayName: " Dignosis",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "TotalQuantity",
        DisplayName: "Total Quantity",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "NoOfDays",
        DisplayName: "No. of Days",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "SIG",
        DisplayName: "SIG",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "RecordedBy",
        DisplayName: "Recorded By",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "RecordedDate",
        DisplayName: "Record Date",
        DisplayMode: "DateTime",
        FormatString: "dd-MM-yyyy",
        LinkUrl: "",
      },
    ];
  }

  ngOnInit() {
    this.custHttp.getDbName(localStorage.getItem("DatabaseName"));
    this.activateRoute.params.subscribe((params) => {
      this.patientId = params["PatientId"];
      this.newPatientService.patientId = this.patientId;
    });
    this.getMedicationRecords();
  }
  //get
  getMedicationRecords() {
    this.newPatientService.GetPatientMedicationHistoryListForPatient(this.patientId).then((res) => {
      this.medicationRecord = res;
    });
  }

  //view
  viewMedication(data: any) {
    this.newPatientService.GetPatientMedicationHistoryRecordbyID(data.Item.PatientmedicationId).then((data) => {
      var patientDetail = data;
      const viewDetails = this.dialog.open(ViewMedicationComponent, {
        data: patientDetail,
        height: "auto",
        width: "auto",
        autoFocus: false,
      });
    });
  }
  //add
  // addMedication() {
  //   const addMedication = this.dialog.open(AddMedicationComponent, {
  //     height: "auto",
  //     width: "auto",
  //     autoFocus: false,
  //   });
  //   addMedication.afterClosed().subscribe((result) => {
  //     if (result == "Updated") {
  //       this.getMedicationRecords();
  //     }
  //   });
  // }

  // //update
  // updateMedication(element: any) {
  //   this.newPatientService.GetPatientMedicationHistoryRecordbyID(element.Item.PatientmedicationId).then((res) => {
  //     var editRecord = res;
  //     let editDetails = this.dialog.open(UpdateMedicationComponent, {
  //       data: editRecord,
  //       height: "auto",
  //       width: "auto",
  //       autoFocus: true,
  //     });
  //     editDetails.afterClosed().subscribe((result) => {
  //       if (result == "Updated") {
  //         this.getMedicationRecords();
  //       }
  //     });
  //   });
  // }
  //delete
  // deleteMedication(element: any) {
  //   this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox)
  //     .then((res: any) => {
  //       if (res == true) {
  //         this.newPatientService.DeletePatientMedicationRecord(element.Item.PatientmedicationId).then((res) => {
  //           this.getMedicationRecords();
  //         });
  //       }
  //     });
  // }
}
