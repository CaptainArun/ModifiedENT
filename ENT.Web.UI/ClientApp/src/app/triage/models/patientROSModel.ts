export class PatientROSModel {
  public ROSID: number;
  public PatientID: number;
  public VisitID: number;
  public RecordedDate: Date;
  public RecordedBy: string;
  //General
  public Weightlossorgain: boolean;
  public Feverorchills: boolean;
  public Troublesleeping: boolean;
  public Fatigue: boolean;
  public GeneralWeakness: boolean;
  public GeneralOthers: boolean;
  public GeneralothersComments: string;
  //Skin
  public Rashes: boolean;
  public SkinItching: boolean;
  public Colorchanges: boolean;
  public SkinLumps: boolean;
  public Dryness: boolean;
  public Hairandnailchanges: boolean;
  public SkinOthers: boolean;
  public SkinothersComments: string;
  //Head
  public Headache: boolean;
  public Headinjury: boolean;
  public Others: boolean;
  public HeadothersComments: string;
  //Ears
  public Decreasedhearing: boolean;
  public Earache: boolean;
  public Ringinginears: boolean;
  public Drainage: boolean;
  public EarOthers: boolean;
  public EarothersComments: string;
  //Eyes
  public Vision: boolean;
  public Blurryordoublevision: boolean;
  public Cataracts: boolean;
  public Glassesorcontacts: boolean;
  public Flashinglights: boolean;
  public Lasteyeexam: boolean;
  public EyePain: boolean;
  public Specks: boolean;
  public Redness: boolean;
  public Glaucoma: boolean;
  public EyeOthers: boolean;
  public EyesothersComments: string;
  //Nose
  public Stuffiness: boolean;
  public NoseItching: boolean;
  public Nosebleeds: boolean;
  public Discharge: boolean;
  public Hayfever: boolean;
  public Sinuspain: boolean;
  public NoseOthers: boolean;
  public NoseothersComments: string;
  //Throat
  public Teeth: boolean;
  public Soretongue: boolean;
  public Thrush: boolean;
  public Gums: boolean;
  public Drymouth: boolean;
  public Nonhealingsores: boolean;
  public Bleeding: boolean;
  public Sorethroat: boolean;
  public Sinus: boolean;
  public Lastdentalexam: boolean;
  public Lastdentalexamdate: Date;
  public Dentures: boolean;
  public Hoarseness: boolean;
  public ThroatOthers: boolean;
  public ThroatothersComments: string;
  //Neck
  public NeckLumps: boolean;
  public NeckPain: boolean;
  public Swollenglands: boolean;
  public Stiffness: boolean;
  public NeckOthers: boolean;
  public NeckothersComments: string;
  //Respiratory
  public Cough: boolean;
  public Coughingupblood: boolean;
  public Wheezing: boolean;
  public Sputum: boolean;
  public Shortnessofbreath: boolean;
  public Painfulbreathing: boolean;
  public RespiratoryOthers: boolean;
  public Respiratoryotherscomments: string;
  //Neurologic
  public Dizziness: boolean;
  public Weakness: boolean;
  public Tremor: boolean;
  public Fainting: boolean;
  public Numbness: boolean;
  public Seizures: boolean;
  public Tingling: boolean;
  public NeurologicOthers: boolean;
  public Neurologicotherscomments: string;
  //Hematologic
  public Easeofbruising: boolean;
  public Easeofbleeding: boolean;
  public HematologicOthers: boolean;
  public Hematologicotherscomments: string;
  //Psychiatric
  public Nervousness: boolean;
  public Memoryloss: boolean;
  public Stress: boolean;
  public Depression: boolean;
  public PsychiatricOthers: boolean;
  public Psychiatricotherscomments: string;
}
