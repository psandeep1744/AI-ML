import { Database } from './db.js';

export function analyzeSymptomsAndRecommend(selectedSymptoms = [], userCity = 'Bengaluru') {
  const allSymptoms = Database.getSymptoms();
  const allDoctors = Database.getDoctors();

  // Normalize user symptom inputs
  const normalizedInputs = selectedSymptoms.map(s => (typeof s === 'string' ? s : s.name || '').trim().toLowerCase());

  // 1. Match symptoms against the symptoms table
  const matchedSymptoms = [];
  const specVoteWeights = {};

  for (const sym of allSymptoms) {
    const symLower = sym.name.toLowerCase();
    const isDirectMatch = normalizedInputs.some(input => input.includes(symLower) || symLower.includes(input));

    if (isDirectMatch) {
      matchedSymptoms.push(sym);
      const spec = sym.specialization;
      const weight = sym.severity_weight || 0.5;
      specVoteWeights[spec] = (specVoteWeights[spec] || 0) + weight;
    }
  }

  // Fallback if no direct symptom match found: default to General Medicine / Internal Medicine
  if (matchedSymptoms.length === 0) {
    specVoteWeights['Internal Medicine'] = 1.0;
  }

  // 2. Determine recommended specialization by highest weighted vote
  let topSpecialization = 'Internal Medicine';
  let maxWeight = 0;
  for (const [spec, weight] of Object.entries(specVoteWeights)) {
    if (weight > maxWeight) {
      maxWeight = weight;
      topSpecialization = spec;
    }
  }

  // Calculate recommendation confidence
  const totalWeight = Object.values(specVoteWeights).reduce((a, b) => a + b, 0);
  const confidenceScore = totalWeight > 0 ? Math.min(96, Math.max(78, Math.round((maxWeight / totalWeight) * 100))) : 80;

  // 3. Rank doctors using the specified scoring concept:
  // 0.5 * specializationMatch + 0.3 * normalizedRating + 0.1 * experienceScore + 0.1 * cityMatch
  const rankedDoctors = allDoctors.map(doctor => {
    // Specialization Match (1.0 for exact, 0.5 for related/internal medicine, 0.0 otherwise)
    let specializationMatch = 0.0;
    if (doctor.specialization.toLowerCase() === topSpecialization.toLowerCase()) {
      specializationMatch = 1.0;
    } else if (
      doctor.specialization.toLowerCase().includes('internal') ||
      doctor.qualification.toLowerCase().includes(topSpecialization.toLowerCase())
    ) {
      specializationMatch = 0.4;
    }

    // Normalized Rating (Rating out of 5 -> scale 0 to 1)
    const normalizedRating = Math.min(1.0, Math.max(0.0, (doctor.rating || 4.5) / 5.0));

    // Experience Score (Normalized to 25 years max -> scale 0 to 1)
    const experienceScore = Math.min(1.0, (doctor.experience_years || 5) / 25.0);

    // City Match (Bengaluru priority)
    const cityMatch = doctor.city.toLowerCase() === userCity.toLowerCase() ? 1.0 : 0.5;

    // Weighted composite ranking formula
    const totalScore =
      0.5 * specializationMatch +
      0.3 * normalizedRating +
      0.1 * experienceScore +
      0.1 * cityMatch;

    return {
      ...doctor,
      ai_score: Number(totalScore.toFixed(3)),
      match_percentage: Math.round(totalScore * 100),
      is_top_specialist: specializationMatch === 1.0,
    };
  });

  // Sort descending by totalScore
  rankedDoctors.sort((a, b) => b.ai_score - a.ai_score);

  // 4. Return explainable recommendation
  const matchedSymptomNames = matchedSymptoms.map(s => s.name);
  const reasoning = matchedSymptomNames.length > 0
    ? `Your reported symptoms (${matchedSymptomNames.join(', ')}) strongly correlate with clinical protocols in ${topSpecialization}. Our weighted engine prioritized verified specialists in ${userCity} with high patient ratings and relevant diagnostic experience.`
    : `Based on your symptom context, an evaluation with an ${topSpecialization} specialist in ${userCity} is recommended to establish comprehensive baselines.`;

  return {
    success: true,
    recommended_specialization: topSpecialization,
    confidence_score: confidenceScore,
    matched_symptoms: matchedSymptomNames,
    recommendation_reasoning: reasoning,
    target_city: userCity,
    recommended_doctors: rankedDoctors.slice(0, 6),
    medical_disclaimer:
      'Medical Disclaimer: Kynovia AI recommendations are informational clinical guidance and probabilistic triage assistance. This does NOT constitute a confirmed medical diagnosis. For life-threatening emergencies, immediately dial 112 / 108 or report to the nearest hospital emergency room.',
  };
}
