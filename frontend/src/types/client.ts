export interface ClientData {
  id: number;
  success: boolean;
  filename: string;
  file_size: number;
  extracted_text_length: number;
  markdown_summary: string;
  demographics: ClientDemographics;
  summary_type: string;
}

export interface ClientDemographics {
  clientInfo: {
    name: string;
    cdcrNumber: string;
    dateOfBirth: string;
    contactInfo: string;
  };
  introduction: {
    shortSummary: string;
  };
  evidenceUsedToConvict: string[];
  potentialTheory: string;
  convictionInfo: {
    dateOfCrime: string;
    locationOfCrime: string;
    dateOfArrest: string;
    charges: string;
    dateOfConviction: string;
    sentenceLength: string;
    county: string;
    trialOrPlea: string;
  };
  appealInfo: {
    directAppealFiled: string;
    appellateCourtCaseNumber: string;
    dateDecided: string;
    result: string;
    habenasFilings: string[];
  };
  attorneyInfo: {
    currentAttorneyForIncarceratedPerson: {
      name: string;
      title: string;
      firm: string;
      address: string;
      phone: string;
      email: string;
      presentAtHearing: boolean;
      representationContext: string;
    };
    trialAttorney: {
      name: string;
      address: string;
      phone: string;
      caseNumber: string;
      appointedOrRetained: string;
    };
    appellateAttorney: {
      name: string;
      address: string;
      phone: string;
      caseNumbers: string;
      courtLevel: string;
    };
    otherLegalRepresentation: Array<{
      name: string;
      role?: string;
      organization?: string;
    }>;
  };
  newEvidence: string[];
  codefendants: string;
  physicalDescription: {
    height: string;
    weight: string;
    race: string;
    build: string;
    distinguishingMarks: string;
  };
  victimInfo: {
    name: string;
    relationship: string;
  };
  prisonRecord: {
    conduct: string;
    programming: string;
    support: string;
  };
}

export interface SidebarClient {
  id: number;
  name: string;
  cdcrNumber: string;
  dateOfBirth: string;
  contactInfo: string;
  status: string;
}
