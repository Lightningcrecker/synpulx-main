import { AIService } from './AIService';

export class MedicalReportAnalyzer {
  private aiService: AIService;

  constructor() {
    this.aiService = AIService.getInstance();
  }

  async analyzeReport(file: File): Promise<{
    findings: string[];
    recommendations: string[];
    riskFactors: string[];
    summary: string;
    confidence: number;
  }> {
    const analysis = await this.aiService.analyzeMedicalReport(file);
    
    return {
      ...analysis,
      summary: this.generateSummary(analysis),
      confidence: this.calculateConfidence(analysis)
    };
  }

  private generateSummary(analysis: {
    findings: string[];
    recommendations: string[];
    riskFactors: string[];
  }): string {
    const totalFindings = analysis.findings.length;
    const hasRiskFactors = analysis.riskFactors.length > 0;
    const recommendationCount = analysis.recommendations.length;

    return `Analysis found ${totalFindings} significant findings${
      hasRiskFactors ? ` with ${analysis.riskFactors.length} risk factors` : ''
    }. ${recommendationCount} recommendations provided.`;
  }

  private calculateConfidence(analysis: {
    findings: string[];
    recommendations: string[];
    riskFactors: string[];
  }): number {
    // Calculate confidence based on the comprehensiveness of the analysis
    const hasFindings = analysis.findings.length > 0;
    const hasRecommendations = analysis.recommendations.length > 0;
    const hasRiskFactors = analysis.riskFactors.length > 0;

    let confidence = 0.6; // Base confidence

    if (hasFindings) confidence += 0.2;
    if (hasRecommendations) confidence += 0.1;
    if (hasRiskFactors) confidence += 0.1;

    return confidence;
  }
}