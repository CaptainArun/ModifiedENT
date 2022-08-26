export interface ColumnConfig {

  PropertyName: string; // Property name of Json object
  DisplayName: string;  // Will be shown in the header or label
  DisplayMode: string;  // Type of the column. Available values Text, Multiline, HTML, Numeric, DateTime, Image, ImageLink, Attachment
  FormatString?: string; // Angular format string. Used for Numeric and DateTime fields
  CssClass?: string; // Additional CSS class
  LinkUrl: string;  // Hyperllink url string. Need to be verified or re-designed.
  filtered?: boolean;
  filterValue?: string;
  isVisible?: boolean;
  width?: string;

  // constructor(propertyName:string, displayName:string)
  // {
  //     this.PropertyName = propertyName;
  //     this.DisplayName = displayName;
  //     // this.DisplayMode = displayMode;
  //     // this.FormatString = formatString;
  //     // this.CssClass = cssClass;
  //     // this.LinkUrl = linkUrl;
  // }
}

export class TableConfig {
  public showPagination: Boolean = true;
  public showSelection: Boolean = false;
  public showView: Boolean = false;    // Whether to show View option in table
  // public NavgationLink?:string;    // Router Url
  // public NavigationField?:string;  // Router ID

  public showEdit: Boolean = false;   // Whether to show Edit option in table
  public showAdd: Boolean = false;    // Whether to show Add option in table
  public showDelete: Boolean = false; // Whether to show delete option in table
  public showOpen: Boolean = false; // Whether to show delete option in table

// My changes
  public showCancel: Boolean = false; // Whether to show cancel option in table
  public showPayment: Boolean = false; // Whether to show Payment option in table 
  public showOpeningItem : Boolean = false;  // Whether to show OpeningItem option in table
  public showHistory  : Boolean = false;  // Whether to show History option in table
  public showCaseSheet  : Boolean = false; // Whether to show CaseSheet option in table
  public showIntake  : Boolean = false;  // Whether to show Intake option in table
  public showSchedule  : Boolean = false; // Whether to show Schedule option in table
  public showAnaesthesia  : Boolean = false; // Whether to show Anaesthesia option in table
  public showDrugChart  : Boolean = false;  // Whether to show DrugChart option in table
  public showDrugAdminChart  : Boolean = false; // Whether to show DrugAdminChart option in table
  public showEmail  : Boolean = false;  // Whether to show AdmissionPayment option in table
  public showReport  : Boolean = false; // Whether to show Report option in table

  // public EditNavgationLink?:string;    // Router Url
  // public EditNavigationField?:string;  // Router ID

  public showIcon: Boolean;   // Whether to show Icon column. It will be the first column in table
  public IconField: string;   // Josn object property for Icon image url field.
  public columnConfig: Array<ColumnConfig> = []; // Array of ColumnConfig. Will be shown in the table
}
