import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eLab-billing',
  templateUrl: './eLab-billing.component.html',
  styleUrls: ['./eLab-billing.component.css']
})
export class ELabBillingComponent implements OnInit {

  TitleValues: { Id: number; Title: string; Url: string; isOpen: any; Items: any[]; Icon: string; }[];

  constructor(public router: Router) { }

  ngOnInit(): void {
    this.TitleValues = [
      { "Id": 0, "Title": "e-Lab Test(Master)", "Url": "/home/e-lab/LabMaster", "isOpen": false, "Items": [], "Icon": "assets/images/MenuNewIcons/e-lab/Test_master.png", },
      { "Id": 1, "Title": "e-Lab Test(Setup)", "Url": "/home/e-lab/LabSetup", "isOpen": false, "Items": [], "Icon": "assets/images/MenuNewIcons/e-lab/setup.png" },
    ];
    this.toCheckButtonColor();
  }

  changeButtonColor(option: any): void {
    //   for (let Title of this.TitleValues) {
    //     Title.isOpen = false;
    //     this.TitleValues.splice(Title.Id, 1, Title);
    //     if (Title.Id == option.Id) {
    //       Title.isOpen = true;
    //       this.TitleValues.splice(Title.Id, 1, Title);
    //     }
    //   }
  }

  toCheckButtonColor(): void {
    const path = (this.router as any).location.path();
    for (let Title of this.TitleValues) {
      if (path == (Title.Url)) {
        Title.isOpen = true;
        this.TitleValues.splice(Title.Id, 1, Title);
      }
    }
  }
  Back() {
    this.router.navigate(['home/e-lab']);
  }
}
  // //#region "Property Declaration"
  // MasterIsActive: boolean = false;
  // SetupIsActive: boolean = false;

  // constructor(private router: Router) { }

  // ngOnInit() {
    
  //   const path = (this.router as any).location.path();
    
  // }

  // openTestMaster() {
  //   this.router.navigate(['home/e-lab/LabMaster']);
  //   this.buttonIsActive();
  //   this.MasterIsActive = true;
  // }

  // openTestSetup() {
  //   this.router.navigate(['home/e-lab/LabSetup']);
  //   this.buttonIsActive();
  //   this.SetupIsActive = true;
  // }


  // buttonIsActive() {
  //   this.MasterIsActive = false;
  //   this.SetupIsActive = false;
  // }
  // //#endregion
