import { AIService } from './AIService';

export class SymptomAnalyzer {
  private aiService: AIService;

  constructor() {
    this.aiService = AIService.getInstance();
  }

  async analyzeSymptoms(description: string): Promise<{
    analysis: {
      category: string;
      confidence: number;
      predictions: Array<{ condition: string; probability: number }>;
    };
    recommendations: string[];
    severity: 'low' | 'medium' | 'high';
    shouldSeekCare: boolean;
  }> {
    const analysis = await this.aiService.analyzeSymptoms(description);
    const sentiment = await this.aiService.analyzeSentiment(description);

    const severity = this.calculateSeverity(analysis, sentiment);
    const shouldSeekCare = this.determineCareNeed(severity, analysis.predictions);
    const recommendations = this.generateRecommendations(analysis.category, severity);

    return {
      analysis,
      recommendations,
      severity,
      shouldSeekCare
    };
  }

  private calculateSeverity(
    analysis: { confidence: number; predictions: Array<{ probability: number }> },
    sentiment: { toxicity?: number }
  ): 'low' | 'medium' | 'high' {
    const avgProbability = analysis.predictions.reduce((sum, p) => sum + p.probability, 0) / analysis.predictions.length;
    const toxicityFactor = sentiment.toxicity || 0;

    const severityScore = (avgProbability + analysis.confidence + toxicityFactor) / 3;

    if (severityScore > 0.7) return 'high';
    if (severityScore > 0.4) return 'medium';
    return 'low';
  }

  private determineCareNeed(
    severity: 'low' | 'medium' | 'high',
    predictions: Array<{ condition: string; probability: number }>
  ): boolean {
    if (severity === 'high') return true;
    if (severity === 'medium' && predictions.some(p => p.probability > 0.8)) return true;
    return false;
  }

  private generateRecommendations(category: string, severity: 'low' | 'medium' | 'high'): string[] {
    const recommendations: string[] = [];

    // Base recommendations by category
    switch (category) {
      case 'neurological':
        recommendations.push('Ensure proper hydration');
        recommendations.push('Maintain regular sleep schedule');
        break;
      case 'cardiovascular':
        recommendations.push('Monitor blood pressure regularly');
        recommendations.push('Engage in light cardio exercises');
        break;
      case 'musculoskeletal':
        recommendations.push('Apply ice/heat therapy as needed');
        recommendations.push('Practice gentle stretching');
        break;
      case 'psychological':
        recommendations.push('Practice stress management techniques');
        recommendations.push('Consider mindfulness exercises');
        break;
      default:
        recommendations.push('Monitor symptoms');
        break;
    }

    // Severity-based recommendations
    if (severity === 'high') {
      recommendations.push('Seek immediate medical attention');
      recommendations.push('Keep detailed symptom diary');
    } else if (severity === 'medium') {
      recommendations.push('Schedule check-up with healthcare provider');
      recommendations.push('Monitor symptoms closely');
    }

    return recommendations;
  }
}