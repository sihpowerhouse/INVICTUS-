export const demoAnalyticsData = {
  header: {
    totalCases: 128,
    activeCases: 42,
    documents: 1284,
    aiProcessed: 946
  },
  secondaryMetrics: {
    processing: 18,
    completed: 928,
    verifiedDocuments: 1102,
    accessEvents: 3842
  },
  dailyActivity: [
    { name: 'MON', current: 120, previous: 90 },
    { name: 'TUE', current: 148, previous: 110 },
    { name: 'WED', current: 136, previous: 105, event: 'DOCUMENT IMPORT' },
    { name: 'THU', current: 172, previous: 140 },
    { name: 'FRI', current: 188, previous: 155, event: 'AI PROCESSING SPIKE' },
    { name: 'SAT', current: 164, previous: 130 },
    { name: 'SUN', current: 196, previous: 160 }
  ],
  monthlyActivity: [
    { name: 'JAN', current: 642, previous: 520 },
    { name: 'FEB', current: 598, previous: 480 },
    { name: 'MAR', current: 712, previous: 610, event: 'CASE SURGE' },
    { name: 'APR', current: 684, previous: 590 },
    { name: 'MAY', current: 756, previous: 620 },
    { name: 'JUN', current: 820, previous: 690 },
    { name: 'JUL', current: 790, previous: 670 },
    { name: 'AUG', current: 864, previous: 730 },
    { name: 'SEP', current: 912, previous: 780, event: 'DOCUMENT IMPORT' },
    { name: 'OCT', current: 888, previous: 750 },
    { name: 'NOV', current: 946, previous: 810, event: 'VERIFICATION PEAK' },
    { name: 'DEC', current: 1024, previous: 890 }
  ],
  yearlyActivity: [
    { name: '2022', current: 4250, previous: 3800 },
    { name: '2023', current: 5840, previous: 4900, event: 'SYSTEM ROLLOUT' },
    { name: '2024', current: 7120, previous: 6200 },
    { name: '2025', current: 8940, previous: 7500 },
    { name: '2026', current: 10450, previous: 9100, event: 'AI PROCESSING SPIKE' }
  ],
  caseStatus: [
    { name: 'ACTIVE', value: 42 },
    { name: 'PROCESSING', value: 18 },
    { name: 'CLOSED', value: 68 }
  ],
  documentDistribution: [
    { name: 'FIR', value: 284 },
    { name: 'EVIDENCE', value: 392 },
    { name: 'FORENSIC REPORT', value: 208 },
    { name: 'COURT DOCUMENT', value: 176 },
    { name: 'MEDIA', value: 124 },
    { name: 'OTHER', value: 100 }
  ],
  aiIntelligence: {
    documentsAnalyzed: 946,
    aiReady: 812,
    processing: 96,
    failed: 38,
    aiEnabled: 812,
    aiDisabled: 472
  },
  recentActivity: [
    { time: '10:42', description: 'Document uploaded', actor: 'OFFICER A' },
    { time: '10:35', description: 'Case created', actor: 'SYSTEM' },
    { time: '10:21', description: 'Evidence version updated', actor: 'INVESTIGATOR B' },
    { time: '10:08', description: 'AI analysis completed', actor: 'SYSTEM' },
    { time: '09:54', description: 'Document verified', actor: 'OFFICER A' }
  ],
  departmentActivity: [
    { department: 'POLICE', documents: 342 },
    { department: 'FORENSIC SCIENCE', documents: 218 },
    { department: 'CYBER CRIME', documents: 164 },
    { department: 'PROSECUTION', documents: 126 },
    { department: 'JUDICIARY', documents: 94 },
    { department: 'RECORDS', documents: 286 },
    { department: 'ADMINISTRATION', documents: 54 }
  ]
};
