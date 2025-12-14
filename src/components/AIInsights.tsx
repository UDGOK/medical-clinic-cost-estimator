'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Brain,
  Users,
  AlertTriangle,
  Calendar,
  Shield,
  TrendingUp,
  DollarSign,
  BarChart3,
  Lightbulb,
  CheckCircle2,
  XCircle,
  MinusCircle
} from 'lucide-react';
import type { Trade, EquipmentItem, KPIs, ProjectInputs } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import {
  predictOptimalStaffing,
  analyzeBudgetHealth,
  predictProjectTimeline,
  assessProjectRisks,
  analyzeEquipmentROI,
  compareToMarket,
  suggestOptimizations,
} from '@/lib/intelligence';

interface Props {
  trades: Trade[];
  equipment: EquipmentItem[];
  kpis: KPIs;
  projectInputs: ProjectInputs;
  equipmentCost: number;
}

export default function AIInsights({ trades, equipment, kpis, projectInputs, equipmentCost }: Props) {
  const staffingRecommendations = useMemo(
    () => predictOptimalStaffing(projectInputs.squareFootage, trades),
    [projectInputs.squareFootage, trades]
  );

  const budgetAlerts = useMemo(
    () => analyzeBudgetHealth(kpis, projectInputs, equipmentCost),
    [kpis, projectInputs, equipmentCost]
  );

  const timeline = useMemo(
    () => predictProjectTimeline(projectInputs.squareFootage, projectInputs.complexityScore, kpis.totalProjectCost),
    [projectInputs.squareFootage, projectInputs.complexityScore, kpis.totalProjectCost]
  );

  const riskAssessment = useMemo(
    () => assessProjectRisks(kpis, projectInputs, equipment),
    [kpis, projectInputs, equipment]
  );

  const roiAnalyses = useMemo(
    () => analyzeEquipmentROI(equipment),
    [equipment]
  );

  const marketComparisons = useMemo(
    () => compareToMarket(kpis, projectInputs),
    [kpis, projectInputs]
  );

  const optimizations = useMemo(
    () => suggestOptimizations(kpis, equipment),
    [kpis, equipment]
  );

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'text-red-700 bg-red-100';
      case 'High': return 'text-orange-700 bg-orange-100';
      case 'Moderate': return 'text-yellow-700 bg-yellow-100';
      case 'Low': return 'text-green-700 bg-green-100';
      default: return 'text-slate-700 bg-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8" />
            <div>
              <CardTitle className="text-2xl">AI-Powered Project Intelligence</CardTitle>
              <CardDescription className="text-purple-100">
                Predictive analytics and smart recommendations for your medical facility project
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Budget Health Alerts */}
      {budgetAlerts.length > 0 && (
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Budget Health Alerts
            </CardTitle>
            <CardDescription>{budgetAlerts.length} items requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {budgetAlerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="ml-2 font-semibold">{alert.category}</span>
                    </div>
                    {alert.potentialSavings && (
                      <span className="text-sm font-bold">{formatCurrency(alert.potentialSavings)} potential savings</span>
                    )}
                  </div>
                  <p className="text-sm mb-2">{alert.message}</p>
                  <p className="text-sm font-medium">💡 {alert.recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Assessment */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-slate-600" />
              <CardTitle>Risk Assessment</CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">Overall Risk Score:</span>
              <Badge className={`${getRiskColor(riskAssessment.riskLevel)} text-lg px-4 py-1`}>
                {riskAssessment.overallScore}/100 - {riskAssessment.riskLevel}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {riskAssessment.factors.map((factor, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{factor.name}</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${factor.score > 70 ? 'bg-red-500' : factor.score > 50 ? 'bg-amber-500' : 'bg-green-500'}`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-8">{factor.score}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-2">{factor.impact}</p>
                <p className="text-sm font-medium text-blue-700">🛡️ Mitigation: {factor.mitigation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Staffing Recommendations */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Smart Staffing Recommendations
          </CardTitle>
          <CardDescription>AI-predicted optimal staffing based on {projectInputs.squareFootage.toLocaleString()} sq ft facility</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {staffingRecommendations.map((rec, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  {rec.status === 'optimal' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  {rec.status === 'understaffed' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                  {rec.status === 'overstaffed' && <MinusCircle className="w-5 h-5 text-blue-600" />}
                  <div>
                    <p className="font-medium">{rec.position}</p>
                    <p className="text-sm text-slate-600">{rec.reasoning}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Recommended</p>
                  <p className="font-bold">{rec.recommended} FTE</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline Prediction */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <CardTitle>Project Timeline Prediction</CardTitle>
            </div>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              {timeline.estimatedMonths} months · {timeline.confidence}% confidence
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {timeline.phases.map((phase, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${timeline.criticalPath.includes(phase.name) ? 'bg-red-500' : 'bg-blue-500'}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{phase.name}</span>
                    <span className="text-sm text-slate-600">{phase.duration} months</span>
                  </div>
                  {timeline.criticalPath.includes(phase.name) && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                      Critical Path
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <p className="text-sm text-slate-600">
            <strong>Note:</strong> Medical facilities typically require 30% more time than standard construction due to regulatory compliance, specialized systems, and inspection requirements.
          </p>
        </CardContent>
      </Card>

      {/* Equipment ROI Analysis */}
      {roiAnalyses.length > 0 && (
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Equipment ROI Analysis
            </CardTitle>
            <CardDescription>Revenue potential and break-even projections</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {roiAnalyses.map((roi, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold">{roi.equipmentName}</h4>
                    <Badge className={roi.breakEvenMonths < 36 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                      {roi.breakEvenMonths} months to break-even
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-slate-500">Total Investment</p>
                      <p className="font-bold">{formatCurrency(roi.totalCost)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Annual Revenue</p>
                      <p className="font-bold text-green-700">{formatCurrency(roi.estimatedRevenue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">5-Year ROI</p>
                      <p className="font-bold text-blue-700">{roi.roi5Year.toFixed(0)}%</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700">💡 {roi.recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Comparison */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Market Comparison
          </CardTitle>
          <CardDescription>How your project compares to national medical facility averages</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {marketComparisons.map((comp, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{comp.metric}</h4>
                  <Badge className={
                    comp.status === 'average' ? 'bg-green-100 text-green-800' :
                    comp.status === 'above' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }>
                    {comp.percentile}th percentile
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Your Project</p>
                    <p className="font-bold">{comp.metric.includes('%') ? comp.yourValue.toFixed(1) + '%' : formatCurrency(comp.yourValue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Market Average</p>
                    <p className="font-bold">{comp.metric.includes('%') ? comp.marketAverage.toFixed(1) + '%' : formatCurrency(comp.marketAverage)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Variance</p>
                    <p className={`font-bold ${comp.variance > 0 ? 'text-red-700' : 'text-green-700'}`}>
                      {comp.variance > 0 ? '+' : ''}{comp.variance.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost Optimization Suggestions */}
      {optimizations.length > 0 && (
        <Card className="border-green-200 shadow-lg bg-green-50">
          <CardHeader className="border-b border-green-200">
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Lightbulb className="w-5 h-5 text-green-600" />
              Cost Optimization Opportunities
            </CardTitle>
            <CardDescription className="text-green-700">
              Potential savings: {formatCurrency(optimizations.reduce((sum, opt) => sum + opt.savings, 0))}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {optimizations.map((opt, index) => (
                <div key={index} className="bg-white border border-green-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-green-900">{opt.category}</h4>
                    <div className="text-right">
                      <p className="text-sm text-green-600">Potential Savings</p>
                      <p className="font-bold text-green-700 text-lg">{formatCurrency(opt.savings)}</p>
                      <p className="text-xs text-green-600">({opt.savingsPercent.toFixed(0)}% reduction)</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-slate-500">Current Cost</p>
                      <p className="font-bold">{formatCurrency(opt.currentCost)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Optimized Cost</p>
                      <p className="font-bold text-green-700">{formatCurrency(opt.optimizedCost)}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Suggestion:</strong> {opt.suggestion}</p>
                    <p className="text-sm text-amber-700"><strong>⚠️ Trade-offs:</strong> {opt.tradeoffs}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
