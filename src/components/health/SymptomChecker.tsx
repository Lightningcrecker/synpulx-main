import React, { useState } from 'react';
import { Activity, AlertCircle } from 'lucide-react';

interface SymptomCheckerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({ isOpen, onClose }) => {
  const [symptoms, setSymptoms] = useState('');
  const [prediction, setPrediction] = useState<any>(null);

  const analyzeSymptoms = async () => {
    // Simulate API call to ML model
    const mockPrediction = {
      possibleConditions: [
        { name: 'Common Cold', probability: 0.85 },
        { name: 'Seasonal Allergies', probability: 0.65 },
        { name: 'Sinusitis', probability: 0.45 }
      ],
      recommendations: [
        'Rest and stay hydrated',
        'Monitor symptoms for 24-48 hours',
        'Consider over-the-counter medication'
      ],
      severity: 'mild',
      shouldSeekCare: false
    };

    setPrediction(mockPrediction);
  };

  return (
    <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
      <div className="flex items-center mb-6">
        <Activity className="h-6 w-6 text-blue-400 mr-2" />
        <h3 className="text-xl font-semibold text-white">Symptom Checker</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Describe your symptoms
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Enter your symptoms..."
          />
        </div>

        <button
          onClick={analyzeSymptoms}
          disabled={!symptoms.trim()}
          className="w-full p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Analyze Symptoms
        </button>

        {prediction && (
          <div className="mt-6 space-y-4">
            <div className="p-4 rounded-lg bg-white/5">
              <h4 className="text-lg font-medium text-white mb-2">Possible Conditions</h4>
              {prediction.possibleConditions.map((condition: any, index: number) => (
                <div key={index} className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">{condition.name}</span>
                  <span className="text-blue-400">{Math.round(condition.probability * 100)}%</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-white/5">
              <h4 className="text-lg font-medium text-white mb-2">Recommendations</h4>
              <ul className="space-y-2">
                {prediction.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-gray-300 flex items-start">
                    <span className="mr-2">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {prediction.shouldSeekCare && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-lg font-medium text-red-400">Seek Medical Attention</h4>
                  <p className="text-red-300">
                    Based on your symptoms, we recommend consulting a healthcare professional.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};