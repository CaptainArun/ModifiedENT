export interface ColumnCardConfig {
  DisplayName?: string;             // Will be shown in the Card header or label
  PropertyName: string;             // Property name of Json object
  SectionType?: string;             // SectionType=" Header ||  Content"DisplayType
  DisplayType?: any;                 // Use it for Image it should in Header only DisplayImg="Image"
  ApplyStatusFontcolor?: any;       // Use it for font color ----------- ApplyFont || ApplyIconFont  
  DisplayMode?: string;  // DateTime
  FormatString?: string; // DateTime format 
}

export class FlexCardConfig {

  public showPagination: Boolean = true;

  public showView: Boolean = false;    // Whether to show View option in table
  public showEdit: Boolean = false;    // Whether to show Edit option in table
  public showDelete: Boolean = false; // Whether to show delete option in table
  public showOpen: Boolean = false;   // Whether to show delete option in table
  public showCancel: Boolean = false; // Whether to show cancel option in table
  public showPayment: Boolean = false; // Whether to show Payment option in table 
  public showOpeningItem: Boolean = false; // Whether to show OpeningItem option in table
  public showHistory: Boolean = false;  // Whether to show History option in table
  public showCaseSheet: Boolean = false; // Whether to show CaseSheet option in table
  public showIntake: Boolean = false;  // Whether to show Intake option in table
  public showSchedule: Boolean = false; // Whether to show Schedule option in table
  public showAnaesthesia: Boolean = false; // Whether to show Anaesthesia option in table
  public showDrugChart: Boolean = false;  // Whether to show DrugChart option in table
  public showDrugAdminChart: Boolean = false; // Whether to show DrugAdminChart option in table
  public showEmail: Boolean = false;  // Whether to show AdmissionPayment option in table
  public showReport: Boolean = false; // Whether to show Report option in table
  public FlexDataConfig: Array<ColumnCardConfig> = []; // Array of ColumnCardConfig. Will be shown in the table

  public showIcon: Boolean;   // Whether to show Icon column. It will be the first column in table
  public IconField: string;   // Json object property for Icon image url field.
  public showAdd: Boolean = false;    // Whether to show Add option in table
  public showSelection: Boolean = false; //

  
  //Title for Icon

//  public showViewTitle:string; 
//  public showEditTitle:string;
//  public showOpenTitle:string; 
//  public showCancelTitle:string;
//  public showPaymentTitle:string;
//  public showOpeningItemTitle:string;
//  public showHistoryTitle:string;
//  public showCaseSheetTitle:string;
//  public showIntakeTitle:string;
//  public showScheduleTitle:string;
//  public showAnaesthesiaTitle:string;
//  public showDrugChartTitle:string;
//  public showDrugAdminChartTitle:string;
//  public showEmailTitle:string;
//  public showReportTitle:string;
//  public showDeleteTitle:string; 

}


/* 

Header

// Don't use the DisplayType property for Image.
// Assign SectionType="Header".

Content
// Assign SectionType="Content".
// Assign PropertyName of objData.

Icons

// Assign the boolean value for the icons property.


// -------------- Use this structure in component --------------------

   // public VisitListTable: FlexCardConfig = new FlexCardConfig();

constructor(){

  this.VisitListTable.FlexDataConfig = [

    // Header

     { PropertyName: '', DisplayType:"Image, SectionType:"Header"},  
     { PropertyName: '', DisplayName:'' ,    SectionType:"Header"},
     { PropertyName: '', DisplayName:'' ,    SectionType:"Header"},
     { PropertyName: '', DisplayName:'' ,    SectionType:"Header"},

    // Content

     { PropertyName: '', DisplayName: '' ,SectionType:"Content"},
     { PropertyName: '', DisplayName: '' ,SectionType:"Content"},
     { PropertyName: '', DisplayName: '' ,SectionType:"Content" ,DisplayMode:'DateTime' ,FormatString: "hh:mm:ss aa"}, // FormatString: "hh:mm:ss aa",
     { PropertyName: '', DisplayName: '' ,SectionType:"Content" ,ApplyStatusFontcolor:"ApplyIconFont"}, // Icons with font color
     { PropertyName: '', DisplayName: '' ,SectionType:"Content" ,ApplyStatusFontcolor:""ApplyFont""}, // change a fontcolor 
    ];

    // Icons
     this.VisitListTable.showView=false;
     this.VisitListTable.showEdit=true;
     this.VisitListTable.showOpen=false;
     this.VisitListTable.showCancel=false;
     this.VisitListTable.showPayment=false;
     this.VisitListTable.showOpeningItem=false;
     this.VisitListTable.showHistory=false;
     this.VisitListTable.showCaseSheet=false;
     this.VisitListTable.showIntake=false;
     this.VisitListTable.showSchedule=false;
     this.VisitListTable.showAnaesthesia=false;
     this.VisitListTable.showDrugChart=false;
     this.VisitListTable.showDrugAdminChart=false;
     this.VisitListTable.showEmail=false;
     this.VisitListTable.showReport=false;
     this.VisitListTable.showDelete=false;
   }

   }
  
  #endregion

  */