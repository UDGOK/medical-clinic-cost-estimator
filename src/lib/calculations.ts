import type { Trade, Material, KPIs, SoftCost, Scenario } from './types';
import { scenarioFactors } from './data';

export function calculateMaterialCost(
  materials: Material[],
  scenario: Scenario
): number {
  const factors = scenarioFactors[scenario];

  return materials.reduce((total, material) => {
    const discountedPrice = material.unitPrice * (1 - material.bulkDiscount / 100);
    const wasteAdjusted = material.wasteFactor * factors.wasteFactor;
    const inflationAdjusted = 1 + factors.materialInflation;

    const extendedCost =
      material.quantity *
      discountedPrice *
      (1 + wasteAdjusted) *
      inflationAdjusted;

    return total + extendedCost;
  }, 0);
}

export function calculateLaborCost(
  trades: Trade[],
  scenario: Scenario,
  squareFootage: number
): { trades: Trade[]; total: number } {
  const factors = scenarioFactors[scenario];

  const updatedTrades = trades.map(trade => {
    const estimatedHours = squareFootage * trade.efficiencyFactor / factors.laborEfficiency;
    const totalCost = estimatedHours * trade.burdenedRate;

    return {
      ...trade,
      estimatedHours: Math.round(estimatedHours),
      totalCost: Math.round(totalCost * 100) / 100,
    };
  });

  const total = updatedTrades.reduce((sum, trade) => sum + trade.totalCost, 0);

  return { trades: updatedTrades, total };
}

export function calculateSoftCosts(
  softCosts: SoftCost[],
  hardCostBase: number
): { costs: SoftCost[]; total: number } {
  const calculatedCosts = softCosts.map(cost => ({
    ...cost,
    baseValue: cost.isPercentage ? hardCostBase * (cost.amount / 100) : cost.amount,
  }));

  const total = calculatedCosts.reduce(
    (sum, cost) => sum + (cost.baseValue || cost.amount),
    0
  );

  return { costs: calculatedCosts, total };
}

export function calculateKPIs(
  materialCost: number,
  laborCost: number,
  equipmentCost: number,
  softCostsTotal: number,
  scenario: Scenario,
  squareFootage: number,
  complexityScore: number
): KPIs {
  const factors = scenarioFactors[scenario];

  // Base cost
  const hardCost = materialCost + laborCost + equipmentCost;

  // Contingency based on complexity
  const contingencyRate = factors.contingency + (complexityScore / 100);
  const contingency = hardCost * contingencyRate;

  // Subtotal before margin
  const subtotal = hardCost + softCostsTotal + contingency;

  // Profit margin (industry standard 15-25%)
  const profitMarginRate = scenario === 'optimistic' ? 0.25 : scenario === 'realistic' ? 0.18 : 0.12;
  const profitMargin = subtotal * profitMarginRate;

  // Total project cost
  const totalProjectCost = subtotal + profitMargin;

  return {
    totalProjectCost: Math.round(totalProjectCost * 100) / 100,
    costPerSqFt: Math.round((totalProjectCost / squareFootage) * 100) / 100,
    marginProjection: Math.round(profitMarginRate * 10000) / 100,
    laborCost: Math.round(laborCost * 100) / 100,
    materialCost: Math.round(materialCost * 100) / 100,
    equipmentCost: Math.round(equipmentCost * 100) / 100,
    softCosts: Math.round(softCostsTotal * 100) / 100,
    contingency: Math.round(contingency * 100) / 100,
    profitMargin: Math.round(profitMargin * 100) / 100,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${(value).toFixed(1)}%`;
}
