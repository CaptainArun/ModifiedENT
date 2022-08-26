import { CarePlanModel } from './carePlanModel';
import { DiagnosisModel } from './diagnosisModel';
import { ProcedureModel } from './procedureModel';

export class PatientCaseSheetModel {
  public CaseSheetId: number;
  public PatientId: number;
  public VisitId: number;
  public ProviderId: number;
  public procedureId: number;
  public CarePlanId: number;
  public DiagnosisId: number;

  public carePlanModel: CarePlanModel;
  public diagnosisModel: DiagnosisModel;
  public procedureModel: ProcedureModel;
}
