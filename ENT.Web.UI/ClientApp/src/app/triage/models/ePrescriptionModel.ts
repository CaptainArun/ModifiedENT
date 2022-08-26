export class EPrescriptionModel {
  public eprescriptionId: number;
  public VisitID: number;
  public CaseSheetID: number;
  public ProviderId: number;
  public ChiefComplaint: string;
  public Drugname: string;
  public Dispenseform: number;
  public SelectedDiagnosis: string;
  public Quantity: number;
  public Morning: boolean;
  public Brunch: boolean;
  public Noon: boolean;
  public Evening: boolean;
  public Night: boolean;
  public After: boolean;
  public Before: boolean;
  public NotesandInstructions: string;
  public SIGNotes: string;
}
