import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { TableConfig } from '../../../ux/columnConfig';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { Router } from "@angular/router";
import { UtilService } from '../../../core/util.service';
import { AddElabMasterComponent } from "./add-Lab-master/add-lab-master.component";
import { eLabService } from "../../eLab.service";
import { EditLabMasterComponent } from "./edit-lab-master/edit-lab-master.component";
import { ViewLabMasterComponent } from "./view-lab-master/view-lab-master.component";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
    selector: 'app-lab-master',
    templateUrl: './lab-master.component.html',
    styleUrls: ['./lab-master.component.css']
  })

  export class LabMasterComponent implements OnInit {

    //#region Property Declaration
    gridData: any;
    searchForm:FormGroup;
    tableConfig: TableConfig = new TableConfig();
    //#endregion Property Declaration

    //#region Constructor
    constructor(private fb: FormBuilder, public dialog: MatDialog, private LabMasterService: eLabService, 
      public customhttp: CustomHttpService, private router: Router,  private util: UtilService,) {

        this.tableConfig.showPagination = true;
        this.tableConfig.showView = true;
        this.tableConfig.showIcon = false;
        this.tableConfig.showEdit = true;
        this.tableConfig.showAdd = false;
      this.tableConfig.showDelete = false;
    
        this.tableConfig.columnConfig = [
    
          { PropertyName: 'DepartmentDesc', DisplayName: 'Department', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'MasterLabTypeCode', DisplayName: 'Test code', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'MasterLabType', DisplayName: 'Test Name', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'LabTypeDesc', DisplayName: 'Description', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'Status', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'OrderNo', DisplayName: 'Order ID', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
        ];
    }
    //#endregion Constructor

    //#region ngOnInit
    ngOnInit() {
      this.searchForm=this.fb.group({
        search:['']
      });

      this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
      this.getBillingLabMasterList();
      this.search();
    }
    //#endregion ngOnInit

  //#region Table data
    getBillingLabMasterList() {
       this.LabMasterService.getBillingLabMasterList().then(res => {
        this.gridData = res;     
        });
    }
  //#endregion Table data

  //#region Table Search
      search(){
        this.searchForm.get('search').valueChanges.subscribe((key:any)=>
        {
          if(key.length>0){
            this.LabMasterService.MasterSearchGrid(key).then((res)=>
          {
            this.gridData = res;
            })
          }else{
            this.getBillingLabMasterList();
          }
        })
      }
  //#endregion Table Search
      
  //#region after delete function, Table Data
      DeleteSearch(){
        this.LabMasterService.MasterSearchGrid(this.searchForm.get('search').value).then((res)=>
        {
          this.gridData = res;
        })
      }
  //#endregion after delete function, Table Data

  //#region Delete a record
    //DeleteRecord(element: any) {
    //  this.util.showMessage("Delete","Are you sure want to delete this item? This action cannot be undone.",BMSMessageBoxColorMode.Information,
    //      BMSMessageBoxMode.ConfrimBox ) .then((res: any) => {
    //    if (res == true) {
    //      this.LabMasterService.DeleteRecordofMasterLab(element.Item.LabMasterID).then((res) => {
    //        if(res){
    //          this.DeleteSearch();
    //         }
    //      });
    //    }
    //  });   
    //}
  //#endregion Delete a record

  //#region Edit a record
    EditRecord(element: any){
      this.LabMasterService.getLabMasterById(element.Item.LabMasterID).then(data => {
        var MasterLabDetails= data;
        const dialogRef = this.dialog.open(EditLabMasterComponent, {
           data: MasterLabDetails,
           height: 'auto',
           width: 'auto',
           autoFocus: true,
        });
        dialogRef.afterClosed().subscribe((res)=>
         {
          if (res == "updated") {
            this.getBillingLabMasterList();
          }
         })
      });
    }
  //#endregion Edit a record

  //#region View a record
  ViewLabMaster(element: any) {
    this.LabMasterService.getLabMasterById(element.Item.LabMasterID).then(data => {
      var MasterlabBillingValue = data;
       const dialogRef = this.dialog.open(ViewLabMasterComponent, {
         data: MasterlabBillingValue,
         height: 'auto',
         width: '70%',
         autoFocus: false,
       });         
     });
   }
  //#endregion View a record
 
  //#region Add a new record
  addNew() {
    const newBalance = this.dialog.open(AddElabMasterComponent, {
      height: "auto",
      width: "auto",
      autoFocus: false,
    });
    newBalance.afterClosed().subscribe((result) => {
      if (result == "updated") {
        this.getBillingLabMasterList();
      }
    });
  }
  //#endregion Add a new record
}
