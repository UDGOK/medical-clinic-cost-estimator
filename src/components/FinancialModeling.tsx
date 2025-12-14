'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import type { SoftCost, KPIs, Scenario } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { DollarSign, TrendingUp, Shield } from 'lucide-react';

interface Props {
  softCosts: SoftCost[];
  softCostsTotal: number;
  kpis: KPIs;
  scenario: Scenario;
}

export default function FinancialModeling({ softCosts, softCostsTotal, kpis, scenario }: Props) {
  // Waterfall chart data showing cost buildup
  const waterfallData = [
    { name: 'Materials', value: kpis.materialCost, cumulative: kpis.materialCost },
    { name: 'Labor', value: kpis.laborCost, cumulative: kpis.materialCost + kpis.laborCost },
    {
      name: 'Equipment',
      value: kpis.equipmentCost,
      cumulative: kpis.materialCost + kpis.laborCost + kpis.equipmentCost
    },
    {
      name: 'Soft Costs',
      value: kpis.softCosts,
      cumulative: kpis.materialCost + kpis.laborCost + kpis.equipmentCost + kpis.softCosts
    },
    {
      name: 'Contingency',
      value: kpis.contingency,
      cumulative: kpis.materialCost + kpis.laborCost + kpis.equipmentCost + kpis.softCosts + kpis.contingency
    },
    {
      name: 'Profit',
      value: kpis.profitMargin,
      cumulative: kpis.totalProjectCost
    },
  ];

  const hardCost = kpis.materialCost + kpis.laborCost + kpis.equipmentCost;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Financial Modeling & Analysis
              </CardTitle>
              <CardDescription className="text-green-100">
                Soft costs, contingency planning, and profit margins
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-100 mb-1">Total Soft Costs</p>
              <p className="text-3xl font-bold">{formatCurrency(softCostsTotal)}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Cost Buildup Chart */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle>Project Cost Buildup</CardTitle>
          <CardDescription>Cumulative cost progression from base to total</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={waterfallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" name="Incremental Cost" />
              <Line
                type="monotone"
                dataKey="cumulative"
                stroke="#10b981"
                strokeWidth={3}
                name="Cumulative Total"
                dot={{ fill: '#10b981', r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Soft Costs Table */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle>Soft Cost Breakdown</CardTitle>
          <CardDescription>
            Percentage-based costs applied to hard cost base of {formatCurrency(hardCost)}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-bold">Cost Category</TableHead>
                  <TableHead className="font-bold text-right">Rate/Amount</TableHead>
                  <TableHead className="font-bold text-right">Calculated Value</TableHead>
                  <TableHead className="font-bold text-center">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {softCosts.map((cost, index) => (
                  <TableRow key={index} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{cost.name}</TableCell>
                    <TableCell className="text-right font-semibold text-blue-700">
                      {cost.isPercentage ? `${cost.amount.toFixed(1)}%` : formatCurrency(cost.amount)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      {formatCurrency(cost.baseValue || cost.amount)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cost.isPercentage ? 'bg-purple-50 text-purple-700' : 'bg-slate-50 text-slate-700'}>
                        {cost.isPercentage ? 'Percentage' : 'Fixed'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-slate-900 text-white font-bold">
                  <TableCell colSpan={2} className="text-right">
                    TOTAL SOFT COSTS
                  </TableCell>
                  <TableCell className="text-right text-xl">
                    {formatCurrency(softCostsTotal)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contingency Analysis */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="bg-amber-50 border-b border-amber-200">
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <Shield className="w-5 h-5" />
              Contingency Analysis
            </CardTitle>
            <CardDescription className="text-amber-700">
              Risk buffer based on project complexity
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-slate-600 mb-2">Contingency Amount</p>
              <p className="text-3xl font-bold text-amber-700">{formatCurrency(kpis.contingency)}</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Base Contingency Rate:</span>
                <span className="font-semibold">
                  {scenario === 'optimistic' ? '5%' : scenario === 'realistic' ? '10%' : '18%'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Complexity Adjustment:</span>
                <span className="font-semibold">Variable</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Applied To:</span>
                <span className="font-semibold">Hard Costs</span>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-200">
              <p className="text-xs text-amber-800">
                Contingency covers unforeseen conditions, scope changes, and market volatility.
                Higher complexity scores increase the buffer to account for project risk.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profit Margin Analysis */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="bg-green-50 border-b border-green-200">
            <CardTitle className="flex items-center gap-2 text-green-900">
              <TrendingUp className="w-5 h-5" />
              Profit Margin Analysis
            </CardTitle>
            <CardDescription className="text-green-700">
              Target margin based on scenario
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-slate-600 mb-2">Profit Amount</p>
              <p className="text-3xl font-bold text-green-700">{formatCurrency(kpis.profitMargin)}</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Margin Rate:</span>
                <span className="font-semibold text-green-700">
                  {kpis.marginProjection.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Scenario Target:</span>
                <span className="font-semibold">
                  {scenario === 'optimistic' ? '25%' : scenario === 'realistic' ? '18%' : '12%'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Applied To:</span>
                <span className="font-semibold">Subtotal + Contingency</span>
              </div>
            </div>

            <div className="pt-4 border-t border-green-200">
              <p className="text-xs text-green-800">
                Industry-standard profit margins range from 12-25% based on project risk,
                market conditions, and competitive positioning.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Summary Breakdown */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle>Complete Financial Summary</CardTitle>
          <CardDescription>All cost components from base to final total</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded border border-blue-100">
              <span className="font-medium text-slate-700">Materials</span>
              <span className="font-bold text-blue-700">{formatCurrency(kpis.materialCost)}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-200">
              <span className="font-medium text-slate-700">Labor</span>
              <span className="font-bold text-slate-700">{formatCurrency(kpis.laborCost)}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-200">
              <span className="font-medium text-slate-700">Equipment & Subcontractors</span>
              <span className="font-bold text-slate-700">{formatCurrency(kpis.equipmentCost)}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-purple-50 rounded border border-purple-100">
              <span className="font-medium text-slate-700">Soft Costs</span>
              <span className="font-bold text-purple-700">{formatCurrency(kpis.softCosts)}</span>
            </div>

            <div className="h-px bg-slate-300 my-2"></div>

            <div className="flex justify-between items-center p-3 bg-slate-100 rounded">
              <span className="font-semibold text-slate-700">Subtotal</span>
              <span className="font-bold text-slate-900">{formatCurrency(hardCost + softCostsTotal)}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-amber-50 rounded border border-amber-100">
              <span className="font-medium text-slate-700">Contingency</span>
              <span className="font-bold text-amber-700">{formatCurrency(kpis.contingency)}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-100">
              <span className="font-medium text-slate-700">Profit Margin</span>
              <span className="font-bold text-green-700">{formatCurrency(kpis.profitMargin)}</span>
            </div>

            <div className="h-px bg-slate-900 my-3"></div>

            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
              <span className="text-xl font-bold text-white">TOTAL PROJECT COST</span>
              <span className="text-3xl font-bold text-white">{formatCurrency(kpis.totalProjectCost)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
