import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../core/custom-http.service";
import { UtilService } from "../../core/util.service";
import { TableConfig } from "../../ux/columnConfig";
import { AddElabSetupComponent } from "./add-eLab-setup/add-eLab-setup.component";
import { eLabService } from "../eLab.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../ux/bmsmsgbox/bmsmsgbox.component";
import { ViewElabSetupComponent } from "./view-eLab-setup/view-eLab-setup.component";
import { EditElabSetupComponent } from "./edit-eLab-setup/edit-eLab-setup.component";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: 'app-elab-setup',
    templateUrl: './elab-setup.component.html',
    styleUrls: ['./elab-setup.component.css']
  })
export class ElabSetupComponent implements OnInit {
//#region Property Declaration
    gridData: any;
    tableConfig: TableConfig = new TableConfig();
    searchForm: FormGroup;
     //#endregion Property Declaration

//#region Constructor
    constructor(private config: UtilService, public MatDialog: MatDialog, public CustHttp: CustomHttpService,
     public ELabSetupService: eLabService,public fb:FormBuilder)
      {
        this.tableConfig.showPagination = true;
        this.tableConfig.showView = true;
        this.tableConfig.showIcon = false;
        this.tableConfig.showEdit = true;
        this.tableConfig.showAdd = false;
      this.tableConfig.showDelete = false;
        this.tableConfig.columnConfig = [      
          { PropertyName: 'DepartmentDesc', DisplayName: 'Department', DisplayMode: 'Text', LinkUrl: '', isVisible: true },        
          { PropertyName: 'LabMasterDesc', DisplayName: 'Test Name', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'LabSubMasterDesc', DisplayName: 'Test Sub Name', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'Status', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'Charges', DisplayName: 'charges', DisplayMode: 'Text', LinkUrl: '', isVisible: true },         
          ];    
      }
      //#endregion Constructor
      
//#region ngOnInit
      ngOnInit() {
        this.searchForm=this.fb.group({
          search:['']
        });
        this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
        this.GetAllSetupMasterData();
        this.search();
      }
      //#endregion ngOnInit
    
//#region Table/Grid Data
      GetAllSetupMasterData() {
        this.ELabSetupService.GetAllSetupMasterData().then(res => {
         this.gridData = res;         
        })
      }
      //#endregion Table/Grid Data

//#region Table/Grid search
      search(){
        this.searchForm.get('search').valueChanges.subscribe((key:any)=>
        {
          if(key.length>0){
            this.ELabSetupService.setupSearchGrid(key).then((res)=>
          {
            this.gridData = res;
            })
          }else{
            this.GetAllSetupMasterData();
          }
        })
      }
      //#endregion Table/Grid search
      
//#region After Delete Table/Grid Data
      DeleteSearch(){
        this.ELabSetupService.setupSearchGrid(this.searchForm.get('search').value).then((res)=>
        {
          this.gridData = res;
        })
      }
      //#endregion After Delete Table/Grid Data
  
//#region Delete a Record
      //DeleteRecord(element: any){
      //  this.config.showMessage("Delete","Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox)
      //    .then((res: any) => {
      //       if (res == true) {
      //          this.ELabSetupService.DeleteRecordSetupMaster(element.Item.SetupMasterID).then((res) => {
      //            if(res){
      //              this.DeleteSearch();
      //            }
      //          });
      //        }
      //  });
      //}
      //#endregion Delete a Record

//#region View a Record
      ViewELabsetupMaster(element: any){
        this.ELabSetupService.getOneRecordOfSetup(element.Item.SetupMasterID).then(data => {
          var ElabBillingMasterViewDetails= data;
          const dialogRef = this.MatDialog.open( ViewElabSetupComponent, {
           data: ElabBillingMasterViewDetails,
           height: 'auto',
           width: '70%',
           autoFocus: true,
         });
        });
      }
      //#endregion View a Record

//#region edit a Record
    EditRecord(element: any) {
      this.ELabSetupService.getOneRecordOfSetup(element.Item.SetupMasterID).then(data => {
        var ElabBillingMasterEditDetails = data;
        const dialogRef = this.MatDialog.open(EditElabSetupComponent, {
         data: ElabBillingMasterEditDetails,
         height: 'auto',
         width: 'auto',
         autoFocus: false,
        });  
        dialogRef.afterClosed().subscribe(res=>
        {
          if(res=="Updated"){
            this.GetAllSetupMasterData();
          }
        })
      });
    }
    //#endregion edit a Record
      
//#region Add a New Record
    addElabBilling() {
      const newElabBilling = this.MatDialog.open(AddElabSetupComponent, {
      height: "auto",
      width: "auto",
      autoFocus: false,
      });
      newElabBilling.afterClosed().subscribe((result) => {
        if (result == "Updated") {
          this.GetAllSetupMasterData();
        }
      });
    }
    //#endregion Add a New Record

}
