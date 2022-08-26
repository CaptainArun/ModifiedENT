import { OPDNursingMedicationModel } from './opdNursingMedicationModel';

export class OPDNursingOrderModel {
  public OPDNOId: number;
  public VisitID: number;
  public CaseSheetID: number;
  public ChiefComplaint: string;
  public ICD10: number;  
  public Proceduretype: number;
  public ProcedureNotes: string;
  public Instructiontype: number;
  public NursingNotes: string;

  public opdnursingMedications: Array<OPDNursingMedicationModel> = [];
}
