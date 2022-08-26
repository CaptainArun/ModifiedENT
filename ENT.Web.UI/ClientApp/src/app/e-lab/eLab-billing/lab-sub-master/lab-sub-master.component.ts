import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CustomHttpService } from '../../../core/custom-http.service';
import { TableConfig } from '../../../ux/columnConfig';
import { AddElabSubMasterComponent } from './add-Lab-submaster/add-lab-submaster.component';
import { eLabService } from '../../eLab.service';
import { EditLabSubMasterComponent } from './edit-lab-submaster/edit-lab-submaster.component';
import { ViewLabSubMasterComponent } from './view-lab-submaster/view-lab-submaster.component';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
    selector: 'app-lab-sub-master',
    templateUrl: './lab-sub-master.component.html',
    styleUrls: ['./lab-sub-master.component.css']
  })
export class LabSubMasterComponent implements OnInit {
//#region Property Declaration      
        tableConfig: TableConfig = new TableConfig();
        gridData: any;
        searchForm: FormGroup;
//#endregion Property Declaration   

//#region Constructor   
    constructor(private fb: FormBuilder, public dialog: MatDialog, private LabSubMasterService: eLabService,
       public customhttp: CustomHttpService, private router: Router, private util: UtilService) {

       this.tableConfig.showPagination = true;
        this.tableConfig.showView = true;
        this.tableConfig.showIcon = false;
        this.tableConfig.showEdit = true;
        this.tableConfig.showAdd = false;
      this.tableConfig.showDelete = false;
    
    
        this.tableConfig.columnConfig = [
    
          { PropertyName: 'DepartmentDesc', DisplayName: 'Department', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'LabMasterDesc', DisplayName: 'Test Name', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'SubMasterLabCode', DisplayName: 'Test code sub', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'SubMasterLabType', DisplayName: 'Test Sub Name', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'Status', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'OrderNo', DisplayName: 'Order ID', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'NormalRange', DisplayName: 'Normal Range', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'Units', DisplayName: 'Units', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          
        ];
    
    
    
      }
//#endregion Constructor

//#region ngOnInit
    ngOnInit() {  
      this.searchForm=this.fb.group({
        search:['']
      });
      this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
      this.GetLabSubMasterList();
      this.search();
    }  
//#endregion ngOnInit

//#region search
    search(){
      this.searchForm.get('search').valueChanges.subscribe((key:any)=>
      {
        if(key.length>0){
          this.LabSubMasterService.SubMasterSearchGrid(key).then((res)=>
        {
          this.gridData = res;
          })
        }else{
          this.GetLabSubMasterList();
        }
      })
    }
//#endregion search

//#region Table data
    GetLabSubMasterList() {  
      this.LabSubMasterService.GetLabSubMasterListGrid().then(res => {
        this.gridData = res;
     })
    }
//#endregion Table data

//#region Delete a record and Table data
    //DeleteSearch(){
    //  this.LabSubMasterService.SubMasterSearchGrid(this.searchForm.get('search').value).then((res)=>
    //    {
    //      this.gridData = res;
    //      })
    //}
    //DeleteRecord(element: any) {
    //  this.util.showMessage("Delete","Are you sure want to delete this item? This action cannot be undone.",BMSMessageBoxColorMode.Information,
    //            BMSMessageBoxMode.ConfrimBox ) .then((res: any) => {
    //    if (res == true) {
    //        this.LabSubMasterService.DeleteRecordSubMaster(element.Item.LabSubMasterID).then((res) => {
    //       if(res){
    //        this.DeleteSearch();
    //       }
    //      });
    //    }
    //  });    
    //}
//#endregion Delete a record and Table data   
 
//#region View a record 
  ViewLabSubMaster(element: any){
    this.LabSubMasterService.getIndiviualRecordById(element.Item.LabSubMasterID).then(data => {

        var MasterLabDetails= data;
         const dialogRef = this.dialog.open(ViewLabSubMasterComponent, {
           data: MasterLabDetails,
           height: 'auto',
           width: '70%',
           autoFocus: true,
         });
      });
  }
//#endregion View a record 
 
//#region Edit a record 
  EditRecord(element: any) {
    this.LabSubMasterService.getIndiviualRecordById(element.Item.LabSubMasterID).then(data => {
      var MasterlabBillingValue = data;
       const dialogRef = this.dialog.open(EditLabSubMasterComponent,{
         data: MasterlabBillingValue,
         height: 'auto',
         width: 'auto',
         autoFocus: false,
       });

       dialogRef.afterClosed().subscribe((res)=>{
         if(res=="update"){
          this.GetLabSubMasterList();
         }
       })  
     });
  }
//#endregion Edit a record 

//#region Add a New record 
   addNew() {
    const dialogRef = this.dialog.open(AddElabSubMasterComponent, {
      height: "auto",
      width: "auto",
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "update") {
        this.GetLabSubMasterList();
      }
    });
  }
//#endregion Add a New record 
}
