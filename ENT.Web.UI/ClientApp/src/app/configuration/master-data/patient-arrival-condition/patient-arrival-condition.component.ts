import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { PatientArrivalConditionAddComponent } from './patient-arrival-condition-add/patient-arrival-condition-add.component';

@Component({
  selector: 'app-patient-arrival-condition',
  templateUrl: './patient-arrival-condition.component.html',
  styleUrls: ['./patient-arrival-condition.component.css']
})
export class PatientArrivalConditionComponent implements OnInit {
    // #region "property declaration"
    tableConfig: TableConfig = new TableConfig();
    patientArrivalConditionGrid: any;
  // #endregion
  
  // #region "constructor"
    constructor(public dialog: MatDialog, public configurationService: ConfigurationService, private config: UtilService, public customhttp: CustomHttpService) 
    { 
      this.tableConfig.showPagination = true;
      this.tableConfig.showView = false;
      this.tableConfig.showIcon = false;
      this.tableConfig.showEdit = true;
      this.tableConfig.showAdd = false;
      this.tableConfig.showDelete = true;
      this.tableConfig.columnConfig = [
        { PropertyName: "Patientarrivalconditioncode", DisplayName: "Code", DisplayMode: "Text", LinkUrl: "", width:"15%" },
        { PropertyName: "PatientArrivalconditionDescription", DisplayName: "Description", DisplayMode: "Text", LinkUrl: "", width:"60%" },
        { PropertyName: "OrderNo", DisplayName: "Order", DisplayMode: "Text", LinkUrl: "", width:"15%" }       
      ];
    }
  // #endregion

  // #region "ngOnInit"  
    ngOnInit() {
      this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
      this.getPatientArrivalConditionGridData();
    }
  // #endregion

  // #region "get data for grid"  
    getPatientArrivalConditionGridData() {
      this.configurationService.getPatientArrivalConditions().then(res => {
        this.patientArrivalConditionGrid = res;
      });
    }
  // #endregion

  // #region "add new data to Table"
    addNewPatientArrivalCondition() {
      const newPatientArrivalCondition = this.dialog.open(PatientArrivalConditionAddComponent, {
        height: "auto",
        width: "25%",
        autoFocus: false,
      });
      newPatientArrivalCondition.afterClosed().subscribe(result => {
        if (result == "Updated") {
          this.getPatientArrivalConditionGridData();
        }
      });
    }
  // #endregion 

  // #region "Edit/Update Data of Table"
    editPatientArrivalCondition(element: any) {
      this.configurationService.getPatientArrivalConditionbyId(element.Item.PatientArrivalConditionId).then(res => {
        var editRecordforPatientArrivalCondition = res;
        let editDetailsofPatientArrivalCondition = this.dialog.open(PatientArrivalConditionAddComponent, {
          data: editRecordforPatientArrivalCondition,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofPatientArrivalCondition.afterClosed().subscribe(result => {
          if (result == "Updated") {
            this.getPatientArrivalConditionGridData();
          }
        });
      });
    }
  // #endregion  

  // #region "delete"
    deletePatientArrivalCondition(element: any) {
      this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
        if (res == true) {
          this.configurationService.deletePatientArrivalConditionRecord(element.Item.PatientArrivalConditionId).then(res => {
            this.getPatientArrivalConditionGridData();
          });
        }
      });
    }
  // #endregion 

}