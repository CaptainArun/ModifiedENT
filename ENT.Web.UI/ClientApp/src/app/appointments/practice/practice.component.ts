import { AfterContentChecked, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { TableConfig } from "src/app/ux/columnConfig";
import { editFacilityComponent } from "./edit.component";
import { PracticePartService } from "./practice.service";

@Component({
    selector: 'app-practice-part',
    templateUrl: './practice.component.html',
    styleUrls: ['./practice.component.css']
})

export class PracticePartComponent implements OnInit {

    facilityData: any[];

    facilityID: number = 0;

    tableConfig: TableConfig = new TableConfig;


    constructor(private practiceSer: PracticePartService, public dialog: MatDialog) {

        this.tableConfig.showPagination = true;
        this.tableConfig.showView = false;
        this.tableConfig.showIcon = false;
        this.tableConfig.showEdit = true;
        this.tableConfig.showAdd = false;
        this.tableConfig.showDelete = false;
        this.tableConfig.showOpen = false;
        this.tableConfig.columnConfig = [
            { PropertyName: 'FacilityName', DisplayName: 'Facility Name', DisplayMode: "Text", LinkUrl: '', width: "25%", },
            { PropertyName: 'Email', DisplayName: 'Email', DisplayMode: "Text", LinkUrl: '', width: "25%", },
            { PropertyName: 'State', DisplayName: 'State', DisplayMode: "Text", LinkUrl: '', width: "25%", },
            { PropertyName: 'Telephone', DisplayName: 'Telephone', DisplayMode: "Text", LinkUrl: '', width: "25%", },
        ];
    }

    ngOnInit(): void {
        this.getAllFacilityData();
        // this.fetchFacilityById();
    }



    getAllFacilityData() {
        this.practiceSer.fetchAllFacilityData().then(data => {
            console.log(data)
            this.facilityData = data;
        })
    }

    createNewFacility(): void {
        let newFacility = this.dialog.open(editFacilityComponent, {
            height: "auto",
            width: "70%",
            autoFocus: false,
        });
        newFacility.afterClosed().subscribe((result) => {
            if (result == "Updated") {
                this.getAllFacilityData();
            }
        });

    }

    editFacilityForm(element : any) {
        this.practiceSer.getFacilityById(element.Item.FacilityId).then(res => {
            let editFacilityId = res;
            let editFacility = this.dialog.open(editFacilityComponent, {
                data: editFacilityId,
                height: "auto",
                width: "70%",
                autoFocus: false,
            })
            editFacility.afterClosed().subscribe((result) => {
                if (result == "Updated") {
                    this.getAllFacilityData();
                }
            })
        })

    }


    // fetchFacilityById() {
    //     this.facilitySer.getFacilityById(this.facilityId).then(res => {
    //         console.log(res)
    //     })
    // }


}