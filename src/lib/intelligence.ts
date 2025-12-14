import type { Trade, EquipmentItem, KPIs, Scenario, ProjectInputs } from './types';
import { formatCurrency } from './calculations';

export interface StaffingRecommendation {
  position: string;
  recommended: number;
  current: number;
  status: 'optimal' | 'understaffed' | 'overstaffed';
  reasoning: string;
}

export interface BudgetAlert {
  severity: 'low' | 'medium' | 'high';
  category: string;
  message: string;
  recommendation: string;
  potentialSavings?: number;
}

export interface TimelinePrediction {
  estimatedMonths: number;
  phases: {
    name: string;
    duration: number;
    dependencies: string[];
  }[];
  criticalPath: string[];
  confidence: number;
}

export interface RiskAssessment {
  overallScore: number; // 0-100
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  factors: {
    name: string;
    score: number;
    impact: string;
    mitigation: string;
  }[];
}

export interface ROIAnalysis {
  equipmentName: string;
  totalCost: number;
  estimatedRevenue: number;
  breakEvenMonths: number;
  roi5Year: number;
  recommendation: string;
}

export interface MarketComparison {
  metric: string;
  yourValue: number;
  marketAverage: number;
  variance: number;
  percentile: number;
  status: 'below' | 'average' | 'above';
}

export interface CostOptimization {
  category: string;
  currentCost: number;
  optimizedCost: number;
  savings: number;
  savingsPercent: number;
  suggestion: string;
  tradeoffs: string;
}

// Staffing Intelligence
export function predictOptimalStaffing(
  squareFootage: number,
  currentStaff: Trade[]
): StaffingRecommendation[] {
  const recommendations: StaffingRecommendation[] = [];

  // Industry benchmarks per 10,000 sq ft for medical facilities
  const benchmarks = {
    'Physician (General Practice)': squareFootage / 5000, // 1 per 5,000 sq ft
    'Physician (Specialist)': squareFootage / 8000, // 1 per 8,000 sq ft
    'Registered Nurse (RN)': squareFootage / 2500, // 1 per 2,500 sq ft
    'Licensed Practical Nurse (LPN)': squareFootage / 4000,
    'Medical Assistant': squareFootage / 2000,
    'Radiology Technician': squareFootage / 15000,
    'Medical Lab Technician': squareFootage / 10000,
    'Receptionist / Front Desk': squareFootage / 5000,
    'Medical Billing Specialist': squareFootage / 8000,
    'Facility Manager': 1, // Always need 1
  };

  Object.entries(benchmarks).forEach(([position, recommended]) => {
    const current = currentStaff.find(s => s.name === position);
    const recommendedCount = Math.ceil(recommended);
    const currentHours = current?.estimatedHours || 0;
    const currentFTE = currentHours / 2080; // Annual hours

    let status: 'optimal' | 'understaffed' | 'overstaffed' = 'optimal';
    let reasoning = '';

    if (currentFTE < recommendedCount * 0.8) {
      status = 'understaffed';
      reasoning = `Recommended ${recommendedCount} FTE for ${squareFootage.toLocaleString()} sq ft. Currently at ${currentFTE.toFixed(1)} FTE. May impact patient care quality.`;
    } else if (currentFTE > recommendedCount * 1.3) {
      status = 'overstaffed';
      reasoning = `Recommended ${recommendedCount} FTE. Currently at ${currentFTE.toFixed(1)} FTE. Potential for labor cost optimization.`;
    } else {
      reasoning = `Current staffing of ${currentFTE.toFixed(1)} FTE is optimal for facility size.`;
    }

    recommendations.push({
      position,
      recommended: recommendedCount,
      current: Math.round(currentFTE * 10) / 10,
      status,
      reasoning,
    });
  });

  return recommendations;
}

// Budget Health Analysis
export function analyzeBudgetHealth(
  kpis: KPIs,
  projectInputs: ProjectInputs,
  equipmentCost: number
): BudgetAlert[] {
  const alerts: BudgetAlert[] = [];
  const costPerSqFt = kpis.costPerSqFt;

  // Industry benchmarks for medical facilities
  const benchmarkCostPerSqFt = {
    optimistic: 250,
    realistic: 320,
    pessimistic: 400,
  };

  const expectedCost = benchmarkCostPerSqFt[projectInputs.scenario];

  // Cost per sq ft analysis
  if (costPerSqFt > expectedCost * 1.2) {
    alerts.push({
      severity: 'high',
      category: 'Overall Budget',
      message: `Cost per sq ft (${formatCurrency(costPerSqFt)}) is 20%+ above market average (${formatCurrency(expectedCost)})`,
      recommendation: 'Review equipment costs and construction methods. Consider value engineering.',
      potentialSavings: (costPerSqFt - expectedCost) * projectInputs.squareFootage,
    });
  } else if (costPerSqFt < expectedCost * 0.7) {
    alerts.push({
      severity: 'medium',
      category: 'Overall Budget',
      message: `Cost per sq ft is significantly below market average. Verify scope completeness.`,
      recommendation: 'Ensure all medical requirements, equipment, and compliance items are included.',
    });
  }

  // Equipment cost analysis
  const equipmentPercent = (equipmentCost / kpis.totalProjectCost) * 100;
  if (equipmentPercent > 65) {
    alerts.push({
      severity: 'medium',
      category: 'Equipment',
      message: `Equipment costs are ${equipmentPercent.toFixed(0)}% of total project (typical is 45-55%)`,
      recommendation: 'Consider leasing vs. purchasing for high-cost items like MRI. Explore refurbished equipment.',
      potentialSavings: equipmentCost * 0.15,
    });
  }

  // Labor cost analysis
  const laborPercent = (kpis.laborCost / kpis.totalProjectCost) * 100;
  if (laborPercent < 3) {
    alerts.push({
      severity: 'high',
      category: 'Labor',
      message: `Labor costs seem unusually low (${laborPercent.toFixed(1)}% of total)`,
      recommendation: 'Verify all required medical staff positions are included with adequate hours.',
    });
  }

  // Contingency analysis
  const contingencyPercent = (kpis.contingency / (kpis.totalProjectCost - kpis.contingency)) * 100;
  if (contingencyPercent < 8 && projectInputs.scenario === 'pessimistic') {
    alerts.push({
      severity: 'medium',
      category: 'Risk Management',
      message: `Contingency of ${contingencyPercent.toFixed(1)}% may be insufficient for pessimistic scenario`,
      recommendation: 'Consider increasing contingency to 12-15% given project complexity and market volatility.',
    });
  }

  // Soft costs analysis
  const softCostPercent = (kpis.softCosts / kpis.totalProjectCost) * 100;
  if (softCostPercent > 20) {
    alerts.push({
      severity: 'low',
      category: 'Soft Costs',
      message: `Soft costs are ${softCostPercent.toFixed(1)}% of total (typical is 15-18%)`,
      recommendation: 'Review professional fees and financing terms for potential optimization.',
      potentialSavings: kpis.softCosts * 0.08,
    });
  }

  return alerts;
}

// Timeline Prediction
export function predictProjectTimeline(
  squareFootage: number,
  complexity: number,
  totalCost: number
): TimelinePrediction {
  // Base timeline: 2 months per 10,000 sq ft
  const baseMonths = (squareFootage / 10000) * 2;

  // Complexity adjustment (1-10 scale)
  const complexityFactor = 1 + (complexity - 5) * 0.1;

  // Medical facility specific delays
  const medicalAdjustment = 1.3; // Medical facilities take 30% longer due to regulations

  const estimatedMonths = Math.ceil(baseMonths * complexityFactor * medicalAdjustment);

  const phases = [
    {
      name: 'Planning & Permits',
      duration: Math.ceil(estimatedMonths * 0.15),
      dependencies: [],
    },
    {
      name: 'Site Work & Foundation',
      duration: Math.ceil(estimatedMonths * 0.20),
      dependencies: ['Planning & Permits'],
    },
    {
      name: 'Shell & Structure',
      duration: Math.ceil(estimatedMonths * 0.25),
      dependencies: ['Site Work & Foundation'],
    },
    {
      name: 'MEP & Medical Systems',
      duration: Math.ceil(estimatedMonths * 0.25),
      dependencies: ['Shell & Structure'],
    },
    {
      name: 'Interior Finishes',
      duration: Math.ceil(estimatedMonths * 0.15),
      dependencies: ['MEP & Medical Systems'],
    },
    {
      name: 'Equipment Installation & Commissioning',
      duration: Math.ceil(estimatedMonths * 0.20),
      dependencies: ['Interior Finishes'],
    },
    {
      name: 'Licensing & Final Inspections',
      duration: Math.ceil(estimatedMonths * 0.10),
      dependencies: ['Equipment Installation & Commissioning'],
    },
  ];

  const confidence = complexity <= 6 ? 85 : complexity <= 8 ? 70 : 60;

  return {
    estimatedMonths,
    phases,
    criticalPath: ['Site Work & Foundation', 'Shell & Structure', 'MEP & Medical Systems', 'Equipment Installation & Commissioning'],
    confidence,
  };
}

// Risk Assessment
export function assessProjectRisks(
  kpis: KPIs,
  projectInputs: ProjectInputs,
  equipmentItems: EquipmentItem[]
): RiskAssessment {
  const factors = [];
  let totalScore = 0;

  // Complexity risk
  const complexityScore = projectInputs.complexityScore * 10;
  factors.push({
    name: 'Project Complexity',
    score: complexityScore,
    impact: projectInputs.complexityScore > 7
      ? 'High complexity increases likelihood of scope changes and delays'
      : 'Moderate complexity with manageable risks',
    mitigation: 'Increase contingency, detailed planning phase, experienced contractor selection',
  });
  totalScore += complexityScore;

  // Budget risk
  const costPerSqFt = kpis.costPerSqFt;
  const budgetRisk = costPerSqFt > 350 ? 80 : costPerSqFt > 300 ? 50 : 30;
  factors.push({
    name: 'Budget Overrun Risk',
    score: budgetRisk,
    impact: budgetRisk > 60
      ? 'High cost per sq ft suggests tight budget with little room for overruns'
      : 'Budget appears reasonable with adequate contingency',
    mitigation: 'Lock in material prices early, fixed-price contracts where possible, monthly budget reviews',
  });
  totalScore += budgetRisk;

  // Equipment concentration risk
  const equipmentTotal = equipmentItems.reduce((sum, item) => sum + item.totalCost, 0);
  const equipmentPercent = (equipmentTotal / kpis.totalProjectCost) * 100;
  const equipmentRisk = equipmentPercent > 60 ? 70 : equipmentPercent > 50 ? 40 : 20;
  factors.push({
    name: 'Equipment Dependency',
    score: equipmentRisk,
    impact: `${equipmentPercent.toFixed(0)}% of budget in equipment creates supply chain and financing risk`,
    mitigation: 'Diversify vendors, negotiate flexible payment terms, consider lease vs. buy options',
  });
  totalScore += equipmentRisk;

  // Timeline risk
  const timelineRisk = projectInputs.complexityScore > 7 ? 65 : 35;
  factors.push({
    name: 'Schedule Delays',
    score: timelineRisk,
    impact: 'Medical facility projects often face regulatory and permitting delays',
    mitigation: 'Early permit applications, overlap planning and procurement, buffer in schedule',
  });
  totalScore += timelineRisk;

  // Market volatility risk
  const marketRisk = projectInputs.scenario === 'pessimistic' ? 75 : projectInputs.scenario === 'realistic' ? 50 : 30;
  factors.push({
    name: 'Market Conditions',
    score: marketRisk,
    impact: 'Construction and medical equipment markets subject to inflation and supply disruptions',
    mitigation: 'Lock in pricing early, include escalation clauses, maintain supplier relationships',
  });
  totalScore += marketRisk;

  const overallScore = Math.round(totalScore / factors.length);

  let riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  if (overallScore < 40) riskLevel = 'Low';
  else if (overallScore < 60) riskLevel = 'Moderate';
  else if (overallScore < 80) riskLevel = 'High';
  else riskLevel = 'Critical';

  return {
    overallScore,
    riskLevel,
    factors,
  };
}

// Equipment ROI Analysis
export function analyzeEquipmentROI(equipment: EquipmentItem[]): ROIAnalysis[] {
  const analyses: ROIAnalysis[] = [];

  // Estimated annual revenue by equipment type (conservative estimates)
  const revenueEstimates: Record<string, number> = {
    'MRI Machine': 800000, // ~$1,000-1,500 per scan, 800-1200 scans/year
    'Digital X-Ray System': 200000, // ~$100-150 per exam, 1500-2000 exams/year
    'Ultrasound System': 150000, // ~$150-300 per scan, 600-800 scans/year
    'Medical Gas System': 0, // Infrastructure, no direct revenue
    'Electronic Health Records': 50000, // Efficiency savings
    'Exam Tables': 0, // Infrastructure
    'Sterilization Equipment': 30000, // Enables revenue, cost avoidance
  };

  equipment.forEach(item => {
    const matchedKey = Object.keys(revenueEstimates).find(key => item.name.includes(key.split(' ')[0]));
    const estimatedRevenue = matchedKey ? revenueEstimates[matchedKey] : 0;

    if (estimatedRevenue > 0) {
      const breakEvenMonths = Math.ceil((item.totalCost / estimatedRevenue) * 12);
      const roi5Year = ((estimatedRevenue * 5 - item.totalCost) / item.totalCost) * 100;

      let recommendation = '';
      if (breakEvenMonths < 24) {
        recommendation = 'Excellent ROI. High priority investment with quick payback.';
      } else if (breakEvenMonths < 36) {
        recommendation = 'Good ROI. Reasonable payback period for medical equipment.';
      } else if (breakEvenMonths < 60) {
        recommendation = 'Moderate ROI. Consider usage volume and reimbursement rates carefully.';
      } else {
        recommendation = 'Extended payback period. Explore leasing or lower-cost alternatives.';
      }

      analyses.push({
        equipmentName: item.name,
        totalCost: item.totalCost,
        estimatedRevenue,
        breakEvenMonths,
        roi5Year,
        recommendation,
      });
    }
  });

  return analyses;
}

// Market Comparison
export function compareToMarket(
  kpis: KPIs,
  projectInputs: ProjectInputs
): MarketComparison[] {
  const comparisons: MarketComparison[] = [];

  // National averages for medical facilities (2025)
  const marketAverages = {
    costPerSqFt: 310,
    laborPercentage: 5,
    equipmentPercentage: 52,
    softCostPercentage: 16,
    contingencyPercentage: 11,
  };

  // Cost per sq ft
  const costPerSqFtVariance = ((kpis.costPerSqFt - marketAverages.costPerSqFt) / marketAverages.costPerSqFt) * 100;
  comparisons.push({
    metric: 'Cost per Square Foot',
    yourValue: kpis.costPerSqFt,
    marketAverage: marketAverages.costPerSqFt,
    variance: costPerSqFtVariance,
    percentile: costPerSqFtVariance > 0 ? 65 : 45,
    status: Math.abs(costPerSqFtVariance) < 10 ? 'average' : costPerSqFtVariance > 0 ? 'above' : 'below',
  });

  // Labor percentage
  const laborPercent = (kpis.laborCost / kpis.totalProjectCost) * 100;
  const laborVariance = ((laborPercent - marketAverages.laborPercentage) / marketAverages.laborPercentage) * 100;
  comparisons.push({
    metric: 'Labor Cost %',
    yourValue: laborPercent,
    marketAverage: marketAverages.laborPercentage,
    variance: laborVariance,
    percentile: laborPercent > 5 ? 55 : 40,
    status: Math.abs(laborPercent - marketAverages.laborPercentage) < 2 ? 'average' : laborPercent > marketAverages.laborPercentage ? 'above' : 'below',
  });

  // Equipment percentage
  const equipmentPercent = (kpis.equipmentCost / kpis.totalProjectCost) * 100;
  const equipmentVariance = ((equipmentPercent - marketAverages.equipmentPercentage) / marketAverages.equipmentPercentage) * 100;
  comparisons.push({
    metric: 'Equipment Cost %',
    yourValue: equipmentPercent,
    marketAverage: marketAverages.equipmentPercentage,
    variance: equipmentVariance,
    percentile: equipmentPercent > 52 ? 70 : 50,
    status: Math.abs(equipmentPercent - marketAverages.equipmentPercentage) < 8 ? 'average' : equipmentPercent > marketAverages.equipmentPercentage ? 'above' : 'below',
  });

  return comparisons;
}

// Cost Optimization Suggestions
export function suggestOptimizations(
  kpis: KPIs,
  equipmentItems: EquipmentItem[]
): CostOptimization[] {
  const optimizations: CostOptimization[] = [];

  // Equipment optimization
  const expensiveEquipment = equipmentItems.filter(item => item.totalCost > 500000);
  expensiveEquipment.forEach(item => {
    const leaseVsBuy = item.totalCost * 0.70; // Typical 30% savings over 5 years
    optimizations.push({
      category: 'Equipment',
      currentCost: item.totalCost,
      optimizedCost: leaseVsBuy,
      savings: item.totalCost - leaseVsBuy,
      savingsPercent: 30,
      suggestion: `Consider leasing ${item.name} instead of purchasing. Reduces upfront capital and provides upgrade flexibility.`,
      tradeoffs: 'Long-term cost may be higher if equipment is used beyond 5-7 years. Less ownership equity.',
    });
  });

  // Soft cost optimization
  if (kpis.softCosts > kpis.totalProjectCost * 0.17) {
    const optimizedSoftCosts = kpis.totalProjectCost * 0.15;
    optimizations.push({
      category: 'Soft Costs',
      currentCost: kpis.softCosts,
      optimizedCost: optimizedSoftCosts,
      savings: kpis.softCosts - optimizedSoftCosts,
      savingsPercent: ((kpis.softCosts - optimizedSoftCosts) / kpis.softCosts) * 100,
      suggestion: 'Negotiate professional fees, explore alternative financing, competitive bid insurance.',
      tradeoffs: 'May require more time in procurement. Ensure quality standards are maintained.',
    });
  }

  // Contingency optimization (only if excessive)
  const contingencyPercent = (kpis.contingency / (kpis.totalProjectCost - kpis.contingency)) * 100;
  if (contingencyPercent > 15) {
    const optimalContingency = (kpis.totalProjectCost - kpis.contingency) * 0.12;
    optimizations.push({
      category: 'Contingency',
      currentCost: kpis.contingency,
      optimizedCost: optimalContingency,
      savings: kpis.contingency - optimalContingency,
      savingsPercent: ((kpis.contingency - optimalContingency) / kpis.contingency) * 100,
      suggestion: 'Contingency appears high. Consider reducing to 12% and implementing stricter change order controls.',
      tradeoffs: 'Less buffer for unforeseen costs. Requires excellent project management and cost control.',
    });
  }

  return optimizations;
}
