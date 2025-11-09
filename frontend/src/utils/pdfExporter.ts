import jsPDF from "jspdf";

export interface MockParoleData {
  id: number;
  success: boolean;
  filename: string;
  file_size: number;
  extracted_text_length: number;
  markdown_summary: string;
  demographics: {
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
        role: string;
        caseNumber?: string;
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
  };
  summary_type: string;
}

export class PDFExporter {
  private doc: jsPDF;
  private currentY: number;
  private pageHeight: number;
  private margin: number;
  private lineHeight: number;

  constructor() {
    this.doc = new jsPDF("p", "mm", "a4");
    this.currentY = 20;
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
    this.lineHeight = 6;
  }

  private checkPageBreak(additionalHeight: number = 10): void {
    if (this.currentY + additionalHeight > this.pageHeight - this.margin) {
      this.doc.addPage();
      this.currentY = 20;
    }
  }

  private addTitle(title: string, size: number = 16): void {
    this.checkPageBreak(15);
    this.doc.setFontSize(size);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += this.lineHeight * 2;
  }

  private addSubtitle(subtitle: string, size: number = 14): void {
    this.checkPageBreak(12);
    this.doc.setFontSize(size);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(subtitle, this.margin, this.currentY);
    this.currentY += this.lineHeight * 1.5;
  }

  private addText(text: string, indent: number = 0, bold: boolean = false): void {
    this.checkPageBreak();
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", bold ? "bold" : "normal");

    const maxWidth = 170 - indent;
    const lines = this.doc.splitTextToSize(text, maxWidth);

    for (const line of lines) {
      this.checkPageBreak();
      this.doc.text(line, this.margin + indent, this.currentY);
      this.currentY += this.lineHeight;
    }
  }

  private addKeyValue(key: string, value: string, indent: number = 0): void {
    if (!value || value.trim() === "") return;

    this.checkPageBreak();
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(`${key}:`, this.margin + indent, this.currentY);

    this.doc.setFont("helvetica", "normal");
    const keyWidth = this.doc.getTextWidth(`${key}: `);
    const maxWidth = 170 - indent - keyWidth;
    const lines = this.doc.splitTextToSize(value, maxWidth);

    if (lines.length === 1) {
      this.doc.text(value, this.margin + indent + keyWidth, this.currentY);
      this.currentY += this.lineHeight;
    } else {
      this.currentY += this.lineHeight;
      for (const line of lines) {
        this.checkPageBreak();
        this.doc.text(line, this.margin + indent + 5, this.currentY);
        this.currentY += this.lineHeight;
      }
    }
  }

  private addList(items: string[], indent: number = 0): void {
    for (const item of items) {
      if (item && item.trim() !== "") {
        this.checkPageBreak();
        this.doc.setFontSize(10);
        this.doc.setFont("helvetica", "normal");
        this.doc.text("•", this.margin + indent, this.currentY);

        const maxWidth = 165 - indent;
        const lines = this.doc.splitTextToSize(item, maxWidth);

        for (let i = 0; i < lines.length; i++) {
          this.checkPageBreak();
          this.doc.text(lines[i], this.margin + indent + 5, this.currentY);
          this.currentY += this.lineHeight;
        }
      }
    }
  }

  private addSpacer(height: number = 6): void {
    this.currentY += height;
  }

  public exportMockDataToPDF(data: MockParoleData): void {
    // Header
    this.addTitle("PAROLE HEARING CASE SUMMARY", 18);
    this.addText(`Generated: ${new Date().toLocaleDateString()}`);
    this.addText(`Source File: ${data.filename}`);
    this.addSpacer(10);

    // Client Information
    this.addTitle("CLIENT INFORMATION");
    this.addKeyValue("Name", data.demographics.clientInfo.name);
    this.addKeyValue("CDCR Number", data.demographics.clientInfo.cdcrNumber);
    this.addKeyValue("Date of Birth", data.demographics.clientInfo.dateOfBirth);
    this.addKeyValue("Contact Info", data.demographics.clientInfo.contactInfo);
    this.addSpacer();

    // Case Overview
    this.addTitle("CASE OVERVIEW");
    this.addText(data.demographics.introduction.shortSummary);
    this.addSpacer();

    // Conviction Information
    this.addTitle("CONVICTION INFORMATION");
    this.addKeyValue("Date of Crime", data.demographics.convictionInfo.dateOfCrime);
    this.addKeyValue("Location", data.demographics.convictionInfo.locationOfCrime);
    this.addKeyValue("Date of Arrest", data.demographics.convictionInfo.dateOfArrest);
    this.addKeyValue("Charges", data.demographics.convictionInfo.charges);
    this.addKeyValue("Date of Conviction", data.demographics.convictionInfo.dateOfConviction);
    this.addKeyValue("Sentence Length", data.demographics.convictionInfo.sentenceLength);
    this.addKeyValue("County", data.demographics.convictionInfo.county);
    this.addKeyValue("Trial or Plea", data.demographics.convictionInfo.trialOrPlea);
    this.addSpacer();

    // Attorney Information
    this.addTitle("LEGAL REPRESENTATION");

    const attorney = data.demographics.attorneyInfo.currentAttorneyForIncarceratedPerson;
    if (attorney.name) {
      this.addSubtitle("Current Attorney");
      this.addKeyValue("Name", attorney.name, 5);
      this.addKeyValue("Title", attorney.title, 5);
      this.addKeyValue("Firm", attorney.firm, 5);
      this.addKeyValue("Address", attorney.address, 5);
      this.addKeyValue("Phone", attorney.phone, 5);
      this.addKeyValue("Email", attorney.email, 5);
      this.addKeyValue("Present at Hearing", attorney.presentAtHearing ? "Yes" : "No", 5);
      this.addKeyValue("Context", attorney.representationContext, 5);
    }

    const trialAttorney = data.demographics.attorneyInfo.trialAttorney;
    if (trialAttorney.name) {
      this.addSubtitle("Trial Attorney");
      this.addKeyValue("Name", trialAttorney.name, 5);
      this.addKeyValue("Address", trialAttorney.address, 5);
      this.addKeyValue("Phone", trialAttorney.phone, 5);
      this.addKeyValue("Case Number", trialAttorney.caseNumber, 5);
      this.addKeyValue("Appointed/Retained", trialAttorney.appointedOrRetained, 5);
    }

    const appellateAttorney = data.demographics.attorneyInfo.appellateAttorney;
    if (appellateAttorney.name) {
      this.addSubtitle("Appellate Attorney");
      this.addKeyValue("Name", appellateAttorney.name, 5);
      this.addKeyValue("Address", appellateAttorney.address, 5);
      this.addKeyValue("Phone", appellateAttorney.phone, 5);
      this.addKeyValue("Case Numbers", appellateAttorney.caseNumbers, 5);
      this.addKeyValue("Court Level", appellateAttorney.courtLevel, 5);
    }

    this.addSpacer();

    // Evidence Used to Convict
    if (data.demographics.evidenceUsedToConvict.length > 0) {
      this.addTitle("EVIDENCE USED TO CONVICT");
      this.addList(data.demographics.evidenceUsedToConvict);
      this.addSpacer();
    }

    // Potential Theory
    if (data.demographics.potentialTheory) {
      this.addTitle("POTENTIAL THEORY");
      this.addText(data.demographics.potentialTheory);
      this.addSpacer();
    }

    // Appeal Information
    this.addTitle("APPEAL INFORMATION");
    this.addKeyValue("Direct Appeal Filed", data.demographics.appealInfo.directAppealFiled);
    this.addKeyValue("Court Case Number", data.demographics.appealInfo.appellateCourtCaseNumber);
    this.addKeyValue("Date Decided", data.demographics.appealInfo.dateDecided);
    this.addKeyValue("Result", data.demographics.appealInfo.result);

    if (data.demographics.appealInfo.habenasFilings.length > 0) {
      this.addSubtitle("Habeas Filings");
      this.addList(data.demographics.appealInfo.habenasFilings);
    }
    this.addSpacer();

    // New Evidence
    if (data.demographics.newEvidence.length > 0) {
      this.addTitle("NEW EVIDENCE");
      this.addList(data.demographics.newEvidence);
      this.addSpacer();
    }

    // Physical Description
    this.addTitle("PHYSICAL DESCRIPTION");
    this.addKeyValue("Height", data.demographics.physicalDescription.height);
    this.addKeyValue("Weight", data.demographics.physicalDescription.weight);
    this.addKeyValue("Race", data.demographics.physicalDescription.race);
    this.addKeyValue("Build", data.demographics.physicalDescription.build);
    this.addKeyValue("Distinguishing Marks", data.demographics.physicalDescription.distinguishingMarks);
    this.addSpacer();

    // Victim Information
    this.addTitle("VICTIM INFORMATION");
    this.addKeyValue("Name", data.demographics.victimInfo.name);
    this.addKeyValue("Relationship", data.demographics.victimInfo.relationship);
    this.addSpacer();

    // Prison Record
    this.addTitle("PRISON RECORD");
    this.addKeyValue("Conduct", data.demographics.prisonRecord.conduct);
    this.addKeyValue("Programming", data.demographics.prisonRecord.programming);
    this.addKeyValue("Support", data.demographics.prisonRecord.support);
    this.addSpacer();

    // Summary Analysis (simplified markdown)
    this.addTitle("HEARING SUMMARY");
    const summaryText = data.markdown_summary
      .replace(/# /g, "")
      .replace(/## /g, "")
      .replace(/### /g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/- /g, "• ");

    this.addText(summaryText);

    // Save the PDF
    const fileName = `parole_case_${data.demographics.clientInfo.name.replace(
      /\s+/g,
      "_"
    )}_${new Date().getTime()}.pdf`;
    this.doc.save(fileName);
  }

  public exportAllMockData(mockDataArray: MockParoleData[]): void {
    // Create a summary PDF with all cases
    this.addTitle("PAROLE HEARING CASES SUMMARY", 20);
    this.addText(`Generated: ${new Date().toLocaleDateString()}`);
    this.addText(`Total Cases: ${mockDataArray.length}`);
    this.addSpacer(15);

    mockDataArray.forEach((data, index) => {
      this.addTitle(`CASE ${index + 1}: ${data.demographics.clientInfo.name}`, 14);
      this.addKeyValue("CDCR Number", data.demographics.clientInfo.cdcrNumber);
      this.addKeyValue("Charges", data.demographics.convictionInfo.charges);
      this.addKeyValue("Sentence", data.demographics.convictionInfo.sentenceLength);
      this.addText(data.demographics.introduction.shortSummary);
      this.addSpacer(10);

      if (index < mockDataArray.length - 1) {
        this.doc.addPage();
        this.currentY = 20;
      }
    });

    const fileName = `all_parole_cases_${new Date().getTime()}.pdf`;
    this.doc.save(fileName);
  }
}
