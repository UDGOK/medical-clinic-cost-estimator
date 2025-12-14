'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { KPIs, Scenario } from '@/lib/types';
import { formatCurrency, formatPercent } from '@/lib/calculations';
import { TrendingUp, DollarSign, Target } from 'lucide-react';

interface Props {
  kpis: KPIs;
  scenario: Scenario;
}

export default function ExecutiveDashboard({ kpis, scenario }: Props) {
  // Chart data
  const costBreakdownData = [
    { name: 'Materials', value: kpis.materialCost, color: '#3b82f6' },
    { name: 'Labor', value: kpis.laborCost, color: '#0f172a' },
    { name: 'Equipment', value: kpis.equipmentCost, color: '#64748b' },
    { name: 'Soft Costs', value: kpis.softCosts, color: '#94a3b8' },
    { name: 'Contingency', value: kpis.contingency, color: '#cbd5e1' },
    { name: 'Profit', value: kpis.profitMargin, color: '#10b981' },
  ];

  const comparisonData = [
    {
      category: 'Materials',
      amount: kpis.materialCost,
    },
    {
      category: 'Labor',
      amount: kpis.laborCost,
    },
    {
      category: 'Equipment',
      amount: kpis.equipmentCost,
    },
    {
      category: 'Soft Costs',
      amount: kpis.softCosts,
    },
  ];

  const scenarioColor = scenario === 'optimistic' ? 'bg-green-500' : scenario === 'realistic' ? 'bg-blue-500' : 'bg-amber-500';

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-white/20 rounded-lg">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${scenarioColor}`}>
                {scenario.toUpperCase()}
              </div>
            </div>
            <p className="text-blue-100 text-sm font-medium mb-1">Total Project Cost</p>
            <p className="text-3xl font-bold">{formatCurrency(kpis.totalProjectCost)}</p>
          </div>
        </Card>

        <Card className="border-slate-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-white/20 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <p className="text-slate-300 text-sm font-medium mb-1">Cost per Sq Ft</p>
            <p className="text-3xl font-bold">{formatCurrency(kpis.costPerSqFt)}</p>
          </div>
        </Card>

        <Card className="border-slate-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-white/20 rounded-lg">
                <Target className="w-6 h-6" />
              </div>
            </div>
            <p className="text-green-100 text-sm font-medium mb-1">Profit Margin</p>
            <p className="text-3xl font-bold">{formatPercent(kpis.marginProjection)}</p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="text-lg">Cost Distribution</CardTitle>
            <CardDescription>Breakdown by category</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="text-lg">Hard Cost Breakdown</CardTitle>
            <CardDescription>Materials, Labor, Equipment & Soft Costs</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" stroke="#64748b" />
                <YAxis stroke="#64748b" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown Table */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle className="text-lg">Detailed Cost Summary</CardTitle>
          <CardDescription>Complete project financial breakdown</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div>
                <p className="text-sm text-slate-600 mb-1">Materials</p>
                <p className="text-xl font-bold text-slate-900">{formatCurrency(kpis.materialCost)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Labor</p>
                <p className="text-xl font-bold text-slate-900">{formatCurrency(kpis.laborCost)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="text-sm text-slate-600 mb-1">Equipment & Subcontractors</p>
                <p className="text-xl font-bold text-slate-900">{formatCurrency(kpis.equipmentCost)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Soft Costs</p>
                <p className="text-xl font-bold text-slate-900">{formatCurrency(kpis.softCosts)}</p>
              </div>
            </div>

            <div className="border-t border-slate-300 pt-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-700">Subtotal (Hard + Soft)</span>
                  <span className="font-semibold">
                    {formatCurrency(kpis.materialCost + kpis.laborCost + kpis.equipmentCost + kpis.softCosts)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-700">Contingency</span>
                  <span className="font-semibold text-amber-700">{formatCurrency(kpis.contingency)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-700">Profit Margin ({formatPercent(kpis.marginProjection)})</span>
                  <span className="font-semibold text-green-700">{formatCurrency(kpis.profitMargin)}</span>
                </div>
              </div>

              <div className="border-t-2 border-slate-900 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-slate-900">TOTAL PROJECT COST</span>
                  <span className="text-2xl font-bold text-blue-600">{formatCurrency(kpis.totalProjectCost)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
