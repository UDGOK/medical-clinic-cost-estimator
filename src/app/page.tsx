'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, TrendingUp, DollarSign, Users, Package, Settings, Truck, Building2, Brain } from 'lucide-react';

import type { Scenario, ProjectInputs, EquipmentItem, CostCategory } from '@/lib/types';
import { oklahomaLaborRates, sampleMaterials, defaultSoftCosts, defaultEquipmentItems, defaultCostCategories } from '@/lib/data';
import {
  calculateMaterialCost,
  calculateLaborCost,
  calculateSoftCosts,
  calculateKPIs,
  formatCurrency,
  formatPercent
} from '@/lib/calculations';
import { generateClientProposal } from '@/lib/pdf-generator';
import { scenarioFactors } from '@/lib/data';

import ExecutiveDashboard from '@/components/ExecutiveDashboard';
import MaterialDatabase from '@/components/MaterialDatabase';
import LaborIntelligence from '@/components/LaborIntelligence';
import FinancialModeling from '@/components/FinancialModeling';
import AIInsights from '@/components/AIInsights';
import EquipmentEditor from '@/components/EquipmentEditor';
import DetailedCostEstimation from '@/components/DetailedCostEstimation';

export default function CostEstimator() {
  const [projectInputs, setProjectInputs] = useState<ProjectInputs>({
    projectName: 'Oklahoma City Medical Concierge Clinic',
    clientName: 'Premier Healthcare Partners',
    location: 'Oklahoma City, OK',
    squareFootage: 50000,
    startDate: '2025-03-01',
    endDate: '2026-06-30',
    complexityScore: 6,
    scenario: 'realistic',
  });

  const [equipmentItems, setEquipmentItems] = useState<EquipmentItem[]>(defaultEquipmentItems);
  const [costCategories, setCostCategories] = useState<CostCategory[]>(defaultCostCategories);
  const [trades, setTrades] = useState(oklahomaLaborRates);

  // Calculations
  const materialCost = useMemo(
    () => calculateMaterialCost(sampleMaterials, projectInputs.scenario),
    [projectInputs.scenario]
  );

  const { trades: updatedTrades, total: laborCost } = useMemo(
    () => calculateLaborCost(trades, projectInputs.scenario, projectInputs.squareFootage),
    [trades, projectInputs.scenario, projectInputs.squareFootage]
  );

  const equipmentCost = useMemo(
    () => equipmentItems.reduce((sum, item) => sum + item.totalCost, 0),
    [equipmentItems]
  );

  const factors = scenarioFactors[projectInputs.scenario];

  const detailedCostTotal = useMemo(() => {
    return costCategories.reduce((categorySum, category) => {
      const categoryTotal = category.items.reduce((itemSum, item) => {
        const wasteAdjusted = item.wasteFactor * factors.wasteFactor;
        const inflationAdjusted = 1 + factors.materialInflation;
        return itemSum + (item.quantity * item.unitCost * (1 + wasteAdjusted) * inflationAdjusted);
      }, 0);
      return categorySum + categoryTotal;
    }, 0);
  }, [costCategories, factors]);

  const { costs: softCosts, total: softCostsTotal } = useMemo(
    () => calculateSoftCosts(defaultSoftCosts, materialCost + laborCost + equipmentCost + detailedCostTotal),
    [materialCost, laborCost, equipmentCost, detailedCostTotal]
  );

  const kpis = useMemo(
    () => calculateKPIs(
      materialCost,
      laborCost,
      equipmentCost + detailedCostTotal,
      softCostsTotal,
      projectInputs.scenario,
      projectInputs.squareFootage,
      projectInputs.complexityScore
    ),
    [materialCost, laborCost, equipmentCost, detailedCostTotal, softCostsTotal, projectInputs.scenario, projectInputs.squareFootage, projectInputs.complexityScore]
  );

  const handleGeneratePDF = () => {
    generateClientProposal(projectInputs, kpis, updatedTrades, equipmentItems, costCategories);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 shadow-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Medical Clinic Cost Estimation System
              </h1>
              <p className="text-slate-400 text-sm">
                Professional medical facility cost analysis & proposal generation
              </p>
            </div>
            <div className="flex gap-3">
              <Select
                value={projectInputs.scenario}
                onValueChange={(value: Scenario) =>
                  setProjectInputs({ ...projectInputs, scenario: value })
                }
              >
                <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="optimistic">
                    📈 Optimistic
                  </SelectItem>
                  <SelectItem value="realistic">
                    🎯 Realistic
                  </SelectItem>
                  <SelectItem value="pessimistic">
                    ⚠️ Pessimistic
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleGeneratePDF}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Client Package
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Project Inputs Card */}
        <Card className="mb-6 border-slate-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
            <CardTitle className="text-xl">Project Configuration</CardTitle>
            <CardDescription className="text-slate-300">
              Basic project parameters and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="projectName" className="text-slate-700 font-semibold">
                  Project Name
                </Label>
                <Input
                  id="projectName"
                  value={projectInputs.projectName}
                  onChange={(e) =>
                    setProjectInputs({ ...projectInputs, projectName: e.target.value })
                  }
                  className="border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-slate-700 font-semibold">
                  Client Name
                </Label>
                <Input
                  id="clientName"
                  value={projectInputs.clientName}
                  onChange={(e) =>
                    setProjectInputs({ ...projectInputs, clientName: e.target.value })
                  }
                  className="border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-slate-700 font-semibold">
                  Location
                </Label>
                <Input
                  id="location"
                  value={projectInputs.location}
                  onChange={(e) =>
                    setProjectInputs({ ...projectInputs, location: e.target.value })
                  }
                  className="border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="squareFootage" className="text-slate-700 font-semibold">
                  Square Footage
                </Label>
                <Input
                  id="squareFootage"
                  type="number"
                  value={projectInputs.squareFootage}
                  onChange={(e) =>
                    setProjectInputs({
                      ...projectInputs,
                      squareFootage: Number(e.target.value),
                    })
                  }
                  className="border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-slate-700 font-semibold">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={projectInputs.startDate}
                  onChange={(e) =>
                    setProjectInputs({ ...projectInputs, startDate: e.target.value })
                  }
                  className="border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-slate-700 font-semibold">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={projectInputs.endDate}
                  onChange={(e) =>
                    setProjectInputs({ ...projectInputs, endDate: e.target.value })
                  }
                  className="border-slate-300"
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="complexity" className="text-slate-700 font-semibold">
                  Complexity Score: {projectInputs.complexityScore}/10
                </Label>
                <input
                  id="complexity"
                  type="range"
                  min="1"
                  max="10"
                  value={projectInputs.complexityScore}
                  onChange={(e) =>
                    setProjectInputs({
                      ...projectInputs,
                      complexityScore: Number(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="text-sm text-slate-500">
                  Higher complexity increases contingency requirements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 lg:w-auto bg-slate-900 p-1">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="detailed"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Building2 className="w-4 h-4 mr-2" />
              Detailed Costs
            </TabsTrigger>
            <TabsTrigger
              value="materials"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Package className="w-4 h-4 mr-2" />
              Materials
            </TabsTrigger>
            <TabsTrigger
              value="labor"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Labor
            </TabsTrigger>
            <TabsTrigger
              value="equipment"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Truck className="w-4 h-4 mr-2" />
              Equipment
            </TabsTrigger>
            <TabsTrigger
              value="financial"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <DollarSign className="w-4 h-4 mr-2" />
              Financial
            </TabsTrigger>
            <TabsTrigger
              value="insights"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Brain className="w-4 h-4 mr-2" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>














          </TabsList>

          <TabsContent value="dashboard">
            <ExecutiveDashboard kpis={kpis} scenario={projectInputs.scenario} />
          </TabsContent>

          <TabsContent value="detailed">
            <DetailedCostEstimation
              categories={costCategories}
              onCategoriesChange={setCostCategories}
              scenario={projectInputs.scenario}
              totalCost={detailedCostTotal}
            />
          </TabsContent>

          <TabsContent value="materials">
            <MaterialDatabase materials={sampleMaterials} scenario={projectInputs.scenario} />
          </TabsContent>

          <TabsContent value="labor">
            <LaborIntelligence
              trades={updatedTrades}
              onTradesChange={(updated) => {
                setTrades(updated);
              }}
              totalCost={laborCost}
              scenario={projectInputs.scenario}
            />
          </TabsContent>

          <TabsContent value="equipment">
            <EquipmentEditor
              items={equipmentItems}
              onItemsChange={setEquipmentItems}
              totalCost={equipmentCost}
            />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialModeling
              softCosts={softCosts}
              softCostsTotal={softCostsTotal}
              kpis={kpis}
              scenario={projectInputs.scenario}
            />
          </TabsContent>

          <TabsContent value="insights">
            <AIInsights
              trades={updatedTrades}
              equipment={equipmentItems}
              kpis={kpis}
              projectInputs={projectInputs}
              equipmentCost={equipmentCost}
            />
          </TabsContent>

          <TabsContent value="settings">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure API connections and data sources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">API Integrations</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium">Lowe's API</p>
                        <p className="text-sm text-slate-500">Real-time material pricing</p>
                      </div>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Ready for Integration
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium">Home Depot API</p>
                        <p className="text-sm text-slate-500">Real-time material pricing</p>
                      </div>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Ready for Integration
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium">Build.com API</p>
                        <p className="text-sm text-slate-500">Specialty materials & equipment</p>
                      </div>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Ready for Integration
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">Data Sources</h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>✓ Oklahoma labor rates sourced from state wage data (2025-2026)</p>
                    <p>✓ Material pricing includes bulk discounts and waste factors</p>
                    <p>✓ Scenario-based modeling with industry-standard assumptions</p>
                    <p>✓ Fully burdened labor rates include payroll taxes and benefits (~55%)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
