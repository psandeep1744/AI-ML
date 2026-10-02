import { Database } from './db.js';
import { analyzeSymptomsAndRecommend } from './aiEngine.js';

export function processChatbotMessage(userMessage = '', history = []) {
  const text = (userMessage || '').trim().toLowerCase();
  const doctors = Database.getDoctors();

  // 1. Emergency Detection
  if (
    text.includes('emergency') ||
    text.includes('heart attack') ||
    text.includes('severe chest pain') ||
    text.includes('unconscious') ||
    text.includes('stroke') ||
    text.includes('cannot breathe')
  ) {
    return {
      reply:
        '⚠️ **EMERGENCY MEDICAL ADVISORY**: If you or someone nearby is experiencing acute chest pain, sudden numbness, or severe breathing distress, please call emergency services immediately:\n\n• **National Emergency Helpline**: 112\n• **Medical Ambulance**: 108\n• **Nearest ER in Bengaluru**: Manipal Hospital (HAL Airport Rd) or Fortis (Cunningham Rd).\n\nDo not wait for online consultation in life-threatening emergencies.',
      intent: 'emergency',
      suggested_prompts: ['Find doctors in Bengaluru', 'Check consultation fees', 'Book regular appointment'],
    };
  }

  // 2. Greeting / Identity
  if (
    text === 'hi' ||
    text === 'hello' ||
    text === 'hey' ||
    text.includes('good morning') ||
    text.includes('good afternoon') ||
    text.includes('who are you')
  ) {
    return {
      reply:
        'Hello! I am **Kynovia AI Assistant** — your intelligent healthcare companion for Bengaluru. I can help you find verified specialists across Indiranagar, Koramangala, and Whitefield, guide you through symptom triaging, and coordinate instant appointment bookings. How can I help you today?',
      intent: 'greeting',
      suggested_prompts: [
        'Help me find the right specialist',
        'Help me understand my symptoms',
        'What doctors are available in Bangalore?',
        'What is the consultation fee?',
      ],
    };
  }

  // 3. Consultation Fee / Pricing Inquiry
  if (text.includes('fee') || text.includes('cost') || text.includes('price') || text.includes('charge')) {
    const feeList = doctors
      .slice(0, 4)
      .map(d => `• **${d.name}** (${d.specialization}): ₹${d.consultation_fee.toLocaleString('en-IN')}`)
      .join('\n');

    return {
      reply:
        `At Kynovia AI, consultation fees are transparent and set directly by each verified physician:\n\n${feeList}\n\nThere are no hidden booking charges or surprise platform fees. Would you like to schedule an appointment with one of these doctors?`,
      intent: 'pricing',
      suggested_prompts: ['Book an appointment', 'Find cardiology doctors', 'Find neurology doctors'],
    };
  }

  // 4. Bangalore Location / Available Doctors Inquiry
  if (
    text.includes('bangalore') ||
    text.includes('bengaluru') ||
    text.includes('near me') ||
    text.includes('available doctors') ||
    text.includes('location')
  ) {
    const docSummary = doctors
      .slice(0, 3)
      .map(d => `• **${d.name}** — ${d.specialization} at ${d.hospital_affiliation} (${d.area}, ₹${d.consultation_fee.toLocaleString('en-IN')})`)
      .join('\n');

    return {
      reply:
        `Here are top verified medical specialists available across Bengaluru:\n\n${docSummary}\n\nYou can book both in-clinic visits and instant telehealth consultations right here on Kynovia AI.`,
      intent: 'doctors_list',
      suggested_prompts: ['View Dr. Rajeshwar Sharma profile', 'View Dr. Priya V. Nambiar profile', 'Check my symptoms'],
    };
  }

  // 5. Booking Inquiry
  if (text.includes('how to book') || text.includes('booking') || text.includes('schedule')) {
    return {
      reply:
        'Booking an appointment on Kynovia AI is quick and validated in real time:\n\n1. Go to the **Find Doctors** directory or select your recommended doctor.\n2. Choose between **Telehealth Video** or **In-Clinic Visit** in Bengaluru.\n3. Pick an available date and time slot.\n4. Enter your consultation reason and confirm — your appointment is instantly secured with zero double-booking risk.',
      intent: 'booking_guide',
      suggested_prompts: ['Browse Doctor Directory', 'Find doctors in Indiranagar', 'AI Symptom Check'],
    };
  }

  // 6. Symptom keyword detection & AI matching
  const symptomKeywords = [
    'headache', 'head ache', 'migraine', 'neck pain', 'neck stiffness',
    'chest pain', 'palpitation', 'breath', 'cough',
    'rash', 'itching', 'skin', 'pimple', 'acne',
    'knee', 'joint', 'back pain', 'spine',
    'tired', 'fatigue', 'sugar', 'diabetes', 'dizziness'
  ];

  const matchedKeywords = symptomKeywords.filter(k => text.includes(k));

  if (matchedKeywords.length > 0 || text.includes('symptom')) {
    // Run content-based recommendation engine
    const analysis = analyzeSymptomsAndRecommend(matchedKeywords.length > 0 ? matchedKeywords : ['General Checkup']);
    const topDoc = analysis.recommended_doctors[0];

    const docCard = topDoc
      ? `\n\n**Top Recommended Specialist in Bengaluru:**\n• **${topDoc.name}** (${topDoc.specialization})\n• Location: ${topDoc.area}, Bengaluru\n• Consultation Fee: ₹${topDoc.consultation_fee.toLocaleString('en-IN')}\n• Rating: ★ ${topDoc.rating} (${topDoc.reviews_count} reviews)`
      : '';

    return {
      reply:
        `Based on the symptoms mentioned (${matchedKeywords.join(', ') || 'general discomfort'}):\n\n• **Recommended Specialization**: ${analysis.recommended_specialization}\n• **Clinical Insight**: ${analysis.recommendation_reasoning}${docCard}\n\n*Note: This is an AI clinical recommendation and not a confirmed diagnosis.*`,
      intent: 'symptom_triage',
      suggested_prompts: [
        topDoc ? `Book with ${topDoc.name}` : 'Browse all specialists',
        'Open Full AI Symptom Screener',
        'Ask another question',
      ],
      recommendation: analysis,
    };
  }

  // 7. General FAQ Fallback
  return {
    reply:
      "I'm here to assist with finding doctors in Bengaluru, understanding symptom specializations, verifying consultation fees, or guiding your appointment booking. Could you tell me more about what you're looking for?",
    intent: 'fallback',
    suggested_prompts: [
      'Help me find the right specialist',
      'What doctors are available near Bangalore?',
      'What is the consultation fee?',
      'Help me understand my symptoms',
    ],
  };
}
