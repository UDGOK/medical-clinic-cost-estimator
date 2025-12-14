'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Trade, Scenario } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { Users, TrendingUp, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

interface Props {
  trades: Trade[];
  onTradesChange: (trades: Trade[]) => void;
  totalCost: number;
  scenario: Scenario;
}

export default function LaborIntelligence({ trades, onTradesChange, totalCost, scenario }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTrade, setNewTrade] = useState<Partial<Trade>>({
    name: '',
    hourlyRate2025: 0,
    hourlyRate2026: 0,
    burdenedRate: 0,
    efficiencyFactor: 0.01,
    estimatedHours: 0,
  });

  const calculateTotalCost = (hours: number, rate: number) => hours * rate;

  const handleAdd = () => {
    if (!newTrade.name || !newTrade.burdenedRate || !newTrade.estimatedHours) return;

    const trade: Trade = {
      name: newTrade.name || '',
      hourlyRate2025: newTrade.hourlyRate2025 || 0,
      hourlyRate2026: newTrade.hourlyRate2026 || 0,
      burdenedRate: newTrade.burdenedRate || 0,
      efficiencyFactor: newTrade.efficiencyFactor || 0.01,
      estimatedHours: newTrade.estimatedHours || 0,
      totalCost: calculateTotalCost(newTrade.estimatedHours || 0, newTrade.burdenedRate || 0),
    };

    onTradesChange([...trades, trade]);
    setIsAdding(false);
    setNewTrade({
      name: '',
      hourlyRate2025: 0,
      hourlyRate2026: 0,
      burdenedRate: 0,
      efficiencyFactor: 0.01,
      estimatedHours: 0,
    });
  };

  const handleEdit = (trade: Trade) => {
    setEditingId(trade.name);
    setEditingTrade({ ...trade });
  };

  const handleSave = () => {
    if (!editingTrade) return;

    const updated = trades.map(trade =>
      trade.name === editingId
        ? {
            ...editingTrade,
            totalCost: calculateTotalCost(editingTrade.estimatedHours, editingTrade.burdenedRate),
          }
        : trade
    );

    onTradesChange(updated);
    setEditingId(null);
    setEditingTrade(null);
  };

  const handleDelete = (name: string) => {
    onTradesChange(trades.filter(trade => trade.name !== name));
  };

  const chartData = trades.map(trade => ({
    name: trade.name.split(' ').slice(0, 2).join(' '), // Shorten names for chart
    cost: trade.totalCost,
    hours: trade.estimatedHours,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="w-5 h-5" />
                Medical Staff Labor Costs
              </CardTitle>
              <CardDescription className="text-slate-300">
                Oklahoma Market Rates 2025-2026 · {scenario.charAt(0).toUpperCase() + scenario.slice(1)} Scenario
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-300 mb-1">Total Labor Cost</p>
              <p className="text-3xl font-bold">{formatCurrency(totalCost)}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Labor Cost Chart */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle>Labor Cost by Role</CardTitle>
          <CardDescription>Total cost breakdown across all staff positions</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="name" stroke="#64748b" width={140} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="cost" fill="#0f172a" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Labor Table */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Staff Position Breakdown</CardTitle>
              <CardDescription>
                Fully burdened rates include malpractice insurance, benefits, taxes (~55% burden)
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Position
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-bold">Position</TableHead>
                  <TableHead className="font-bold text-right">2025 Base Rate</TableHead>
                  <TableHead className="font-bold text-right">2026 Projected</TableHead>
                  <TableHead className="font-bold text-right">Burdened Rate</TableHead>
                  <TableHead className="font-bold text-right">Efficiency (hrs/sqft)</TableHead>
                  <TableHead className="font-bold text-right">Estimated Hours</TableHead>
                  <TableHead className="font-bold text-right">Total Cost</TableHead>
                  <TableHead className="font-bold text-center">% of Total</TableHead>
                  <TableHead className="font-bold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Add New Row */}
                {isAdding && (
                  <TableRow className="bg-blue-50">
                    <TableCell>
                      <Input
                        value={newTrade.name}
                        onChange={(e) => setNewTrade({ ...newTrade, name: e.target.value })}
                        placeholder="Position name"
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={newTrade.hourlyRate2025}
                        onChange={(e) => setNewTrade({ ...newTrade, hourlyRate2025: Number(e.target.value) })}
                        className="h-8 text-right w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={newTrade.hourlyRate2026}
                        onChange={(e) => setNewTrade({ ...newTrade, hourlyRate2026: Number(e.target.value) })}
                        className="h-8 text-right w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={newTrade.burdenedRate}
                        onChange={(e) => setNewTrade({ ...newTrade, burdenedRate: Number(e.target.value) })}
                        className="h-8 text-right w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.001"
                        value={newTrade.efficiencyFactor}
                        onChange={(e) => setNewTrade({ ...newTrade, efficiencyFactor: Number(e.target.value) })}
                        className="h-8 text-right w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={newTrade.estimatedHours}
                        onChange={(e) => setNewTrade({ ...newTrade, estimatedHours: Number(e.target.value) })}
                        className="h-8 text-right w-24"
                      />
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatCurrency((newTrade.estimatedHours || 0) * (newTrade.burdenedRate || 0))}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-center">
                        <Button size="sm" variant="ghost" onClick={handleAdd} className="h-8 w-8 p-0">
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setIsAdding(false)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* Existing Trades */}
                {trades.map((trade, index) => (
                  <TableRow key={index} className="hover:bg-slate-50">
                    {editingId === trade.name && editingTrade ? (
                      <>
                        <TableCell>
                          <Input
                            value={editingTrade.name}
                            onChange={(e) => setEditingTrade({ ...editingTrade, name: e.target.value })}
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={editingTrade.hourlyRate2025}
                            onChange={(e) => setEditingTrade({ ...editingTrade, hourlyRate2025: Number(e.target.value) })}
                            className="h-8 text-right w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={editingTrade.hourlyRate2026}
                            onChange={(e) => setEditingTrade({ ...editingTrade, hourlyRate2026: Number(e.target.value) })}
                            className="h-8 text-right w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={editingTrade.burdenedRate}
                            onChange={(e) => setEditingTrade({ ...editingTrade, burdenedRate: Number(e.target.value) })}
                            className="h-8 text-right w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.001"
                            value={editingTrade.efficiencyFactor}
                            onChange={(e) => setEditingTrade({ ...editingTrade, efficiencyFactor: Number(e.target.value) })}
                            className="h-8 text-right w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={editingTrade.estimatedHours}
                            onChange={(e) => setEditingTrade({ ...editingTrade, estimatedHours: Number(e.target.value) })}
                            className="h-8 text-right w-24"
                          />
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(editingTrade.estimatedHours * editingTrade.burdenedRate)}
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <div className="flex gap-1 justify-center">
                            <Button size="sm" variant="ghost" onClick={handleSave} className="h-8 w-8 p-0">
                              <Check className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingId(null);
                                setEditingTrade(null);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <X className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-semibold">{trade.name}</TableCell>
                        <TableCell className="text-right text-slate-600">
                          {formatCurrency(trade.hourlyRate2025)}/hr
                        </TableCell>
                        <TableCell className="text-right text-slate-600">
                          <div className="flex items-center justify-end gap-1">
                            {formatCurrency(trade.hourlyRate2026)}/hr
                            <TrendingUp className="w-3 h-3 text-green-600" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-blue-700">
                          {formatCurrency(trade.burdenedRate)}/hr
                        </TableCell>
                        <TableCell className="text-right text-slate-600">
                          {trade.efficiencyFactor.toFixed(3)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {trade.estimatedHours.toLocaleString()} hrs
                        </TableCell>
                        <TableCell className="text-right font-bold text-slate-900">
                          {formatCurrency(trade.totalCost)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {((trade.totalCost / totalCost) * 100).toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 justify-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(trade)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(trade.name)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}

                {trades.length === 0 && !isAdding && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                      No positions yet. Click "Add Position" to get started.
                    </TableCell>
                  </TableRow>
                )}

                {trades.length > 0 && (
                  <TableRow className="bg-slate-900 text-white font-bold">
                    <TableCell colSpan={5} className="text-right">
                      TOTAL LABOR COST
                    </TableCell>
                    <TableCell className="text-right">
                      {trades.reduce((sum, t) => sum + t.estimatedHours, 0).toLocaleString()} hrs
                    </TableCell>
                    <TableCell className="text-right text-xl">
                      {formatCurrency(totalCost)}
                    </TableCell>
                    <TableCell colSpan={2}></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Smart Intelligence Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Oklahoma Medical Labor Market Data</h3>
              <p className="text-sm text-blue-800 mb-2">
                Rates based on 2025-2026 Oklahoma healthcare market data. Burdened rates include employer costs:
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Malpractice insurance (varies by role: 10-40%)</li>
                <li>• Health benefits and retirement (~12-15%)</li>
                <li>• Payroll taxes (FICA, unemployment ~10%)</li>
                <li>• Continuing education and licensing (~2-5%)</li>
              </ul>
              <p className="text-xs text-blue-700 mt-3 italic">
                💡 Tip: For physicians, consider adding $20-40/hr for board certification premiums. For specialists, rates can range $150-250/hr base depending on specialty.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
