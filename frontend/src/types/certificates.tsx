export interface BirthCertificateForm {
  childName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  motherAdharNumber: string;
  parentsAddressAtBirth: string;
  fatherName: string;
  fatherAdharNumber: string;
  permanentAddressParent: string;
  motherName: string;
  fatherOccupation: string;
  motherOccupation: string;
  hospitalName: string;
}

export interface DeathCertificateForm {
  deceasedName: string;
  dateOfDeath: string;
  addressOfDeath: string;
  placeOfDeath: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  causeOfDeath: string;
  deceasedAdharNumber: string;
  fatherName: string;
  motherName: string;
  spouseName: string;
  spouseAdhar: string;
  motherAdhar: string;
  fatherAdhar: string;
  permanentAddress: string;
}

export interface MarriageCertificateForm {
  dateOfMarriage: string;
  placeOfMarriage: string;
  HusbandName: string;
  HusbandAge: string;
  HusbandFatherName: string;
  HusbandAddress: string;
  HusbandOccupation: string;
  wifeName: string;
  wifeAge: string;
  wifeFatherName: string;
  wifeAddress: string;
  wifeOccupation: string;
  SolemnizedOn: string;
}

export type CertificateType = 'birth' | 'death' | 'marriage' | null;