export type Scenario = 'optimistic' | 'realistic' | 'pessimistic';

export interface Trade {
  name: string;
  hourlyRate2025: number;
  hourlyRate2026: number;
  burdenedRate: number;
  efficiencyFactor: number; // Hours per unit
  estimatedHours: number;
  totalCost: number;
}

export interface EquipmentItem {
  id: string;
  name: string;
  vendor: string;
  itemType: 'Equipment Rental' | 'Subcontractor' | 'Other';
  rateType: 'Daily' | 'Weekly' | 'Monthly' | 'Lump Sum';
  rate: number;
  duration: number; // in units based on rateType
  totalCost: number;
  notes?: string;
}

export interface DetailedCostItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  wasteFactor: number;
  totalCost: number;
}

export interface CostCategory {
  id: string;
  name: 'Site Work & Foundation' | 'Shell & Structure' | 'Interiors & Finishes' | 'MEP' | 'Medical-Specific Systems' | 'Other';
  items: DetailedCostItem[];
  subtotal: number;
}

export interface Material {
  sku: string;
  itemName: string;
  vendor: 'Lowes' | 'Home Depot' | 'Build.com' | 'Other';
  unitPrice: number;
  bulkDiscount: number; // percentage
  leadTime: number; // days
  quantity: number;
  unit: string;
  category: string;
  wasteFactor: number;
  liveApiLink?: string;
}

export interface CostSection {
  id: string;
  name: string;
  items: CostLineItem[];
  subtotal: number;
}

export interface CostLineItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  wasteFactor: number;
  inflationIndex: number;
  extendedCost: number;
}

export interface SoftCost {
  name: string;
  amount: number;
  isPercentage: boolean;
  baseValue?: number;
}

export interface ProjectInputs {
  projectName: string;
  clientName: string;
  location: string;
  squareFootage: number;
  startDate: string;
  endDate: string;
  complexityScore: number; // 1-10
  scenario: Scenario;
}

export interface ScenarioFactors {
  contingency: number;
  wasteFactor: number;
  laborEfficiency: number;
  materialInflation: number;
}

export interface KPIs {
  totalProjectCost: number;
  costPerSqFt: number;
  marginProjection: number;
  laborCost: number;
  materialCost: number;
  equipmentCost: number;
  softCosts: number;
  contingency: number;
  profitMargin: number;
}
