// Type definitions for Person data structure
// Combines data from /pdf/parole-summary and /pdf/innocence-analysis APIs

// Demographics structure from parole summary
export interface ClientInfo {
  name: string
  cdcrNumber: string
  dateOfBirth: string
  contactInfo: string
}

export interface Introduction {
  shortSummary: string
}

export interface ConvictionInfo {
  dateOfCrime: string
  locationOfCrime: string
  dateOfArrest: string
  charges: string
  dateOfConviction: string
  sentenceLength: string
  county: string
  trialOrPlea: string
}

export interface AppealInfo {
  directAppealFiled: string
  appellateCourtCaseNumber: string
  dateDecided: string
  result: string
  habenasFilings: string[]
}

export interface CurrentAttorney {
  name: string
  title: string
  firm: string
  address: string
  phone: string
  email: string
  presentAtHearing: boolean
  representationContext: string
}

export interface TrialAttorney {
  name: string
  address: string
  phone: string
  caseNumber: string
  appointedOrRetained: string
}

export interface AppellateAttorney {
  name: string
  address: string
  phone: string
  caseNumbers: string
  courtLevel: string
}

export interface OtherLegalRepresentation {
  name: string
  role?: string
  organization?: string
  caseNumber?: string
}

export interface AttorneyInfo {
  currentAttorneyForIncarceratedPerson: CurrentAttorney
  trialAttorney: TrialAttorney
  appellateAttorney: AppellateAttorney
  otherLegalRepresentation: OtherLegalRepresentation[]
}

export interface PhysicalDescription {
  height: string
  weight: string
  race: string
  build: string
  distinguishingMarks: string
}

export interface VictimInfo {
  name: string
  relationship: string
}

export interface PrisonRecord {
  conduct: string
  programming: string
  support: string
}

export interface Demographics {
  clientInfo: ClientInfo
  introduction: Introduction
  evidenceUsedToConvict: string[]
  potentialTheory: string
  convictionInfo: ConvictionInfo
  appealInfo: AppealInfo
  attorneyInfo: AttorneyInfo
  newEvidence: string[]
  codefendants: string
  physicalDescription: PhysicalDescription
  victimInfo: VictimInfo
  prisonRecord: PrisonRecord
}

// Innocence analysis structure
export interface InnocenceFinding {
  quote: string
  speaker: string
  page: number
  line: number
  category: string
  significance: string
}

export interface InnocenceSummary {
  total_findings: number
  innocence_indicators: number
  responsibility_pressure: number
  consistency_issues: number
  external_evidence: number
  overall_assessment: string
}

export interface InnocenceAnalysis {
  findings: InnocenceFinding[]
  summary: InnocenceSummary
  raw_analysis?: string
  note?: string
}

// Combined Person type
export interface Person {
  id: number
  success: boolean
  filename: string
  file_size: number
  extracted_text_length: number
  markdown_summary: string
  demographics: Demographics
  summary_type: string
  innocence_analysis?: InnocenceAnalysis
  analysis_type?: string
  // Error tracking for partial success
  parole_summary_error?: string
  innocence_analysis_error?: string
}

// API Response types
export interface ParoleSummaryResponse {
  success: boolean
  filename: string
  file_size: number
  extracted_text_length: number
  markdown_summary: string
  demographics: Demographics
  summary_type: string
}

export interface InnocenceAnalysisResponse {
  success: boolean
  filename: string
  file_size: number
  extracted_text_length: number
  innocence_analysis: InnocenceAnalysis
  analysis_type: string
  categories: string[]
}
