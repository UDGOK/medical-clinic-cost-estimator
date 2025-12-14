'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { CostCategory, DetailedCostItem, Scenario } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { scenarioFactors } from '@/lib/data';
import { Calculator, Plus, Trash2, Edit2, Check, X, ChevronDown, ChevronRight } from 'lucide-react';

interface Props {
  categories: CostCategory[];
  onCategoriesChange: (categories: CostCategory[]) => void;
  scenario: Scenario;
  totalCost: number;
}

export default function DetailedCostEstimation({ categories, onCategoriesChange, scenario, totalCost }: Props) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<DetailedCostItem | null>(null);
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<DetailedCostItem>>({
    description: '',
    quantity: 0,
    unit: 'SF',
    unitCost: 0,
    wasteFactor: 0.10,
  });

  const inflationFactor = scenarioFactors[scenario].materialInflation;

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'Site Work & Foundation':
        return '🏗️';
      case 'Shell & Structure':
        return '🏢';
      case 'Interiors & Finishes':
        return '🎨';
      case 'MEP':
        return '⚡';
      case 'Medical-Specific Systems':
        return '💊';
      case 'Other':
        return '📦';
      default:
        return '📋';
    }
  };

  const calculateItemCost = (quantity: number, unitCost: number, wasteFactor: number) => {
    return quantity * unitCost * (1 + wasteFactor) * (1 + inflationFactor);
  };

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const handleAddItem = (categoryId: string) => {
    if (!newItem.description || !newItem.quantity || !newItem.unitCost) return;

    const item: DetailedCostItem = {
      id: `item-${Date.now()}`,
      description: newItem.description || '',
      quantity: newItem.quantity || 0,
      unit: newItem.unit || 'SF',
      unitCost: newItem.unitCost || 0,
      wasteFactor: newItem.wasteFactor || 0.10,
      totalCost: calculateItemCost(
        newItem.quantity || 0,
        newItem.unitCost || 0,
        newItem.wasteFactor || 0.10
      ),
    };

    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        const updatedItems = [...cat.items, item];
        const subtotal = updatedItems.reduce((sum, i) => sum + i.totalCost, 0);
        return { ...cat, items: updatedItems, subtotal };
      }
      return cat;
    });

    onCategoriesChange(updatedCategories);
    setAddingToCategory(null);
    setNewItem({
      description: '',
      quantity: 0,
      unit: 'SF',
      unitCost: 0,
      wasteFactor: 0.10,
    });
  };

  const handleEditItem = (categoryId: string, item: DetailedCostItem) => {
    setEditingId(item.id);
    setEditingItem({ ...item });
  };

  const handleSaveItem = (categoryId: string) => {
    if (!editingItem) return;

    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        const updatedItems = cat.items.map(item =>
          item.id === editingId
            ? {
                ...editingItem,
                totalCost: calculateItemCost(
                  editingItem.quantity,
                  editingItem.unitCost,
                  editingItem.wasteFactor
                ),
              }
            : item
        );
        const subtotal = updatedItems.reduce((sum, i) => sum + i.totalCost, 0);
        return { ...cat, items: updatedItems, subtotal };
      }
      return cat;
    });

    onCategoriesChange(updatedCategories);
    setEditingId(null);
    setEditingItem(null);
  };

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        const updatedItems = cat.items.filter(item => item.id !== itemId);
        const subtotal = updatedItems.reduce((sum, i) => sum + i.totalCost, 0);
        return { ...cat, items: updatedItems, subtotal };
      }
      return cat;
    });

    onCategoriesChange(updatedCategories);
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Detailed Cost Estimation
              </CardTitle>
              <CardDescription className="text-purple-100">
                Category-based cost breakdown with {scenario} scenario factors
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-100 mb-1">Total Estimated Cost</p>
              <p className="text-3xl font-bold">{formatCurrency(totalCost)}</p>
              <p className="text-xs text-purple-200 mt-1">
                Inflation Factor: {((inflationFactor) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Categories */}
      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id} className="border-slate-200 shadow-lg">
            <Collapsible
              open={openCategories[category.id] ?? true}
              onOpenChange={() => toggleCategory(category.id)}
            >
              <CardHeader className="bg-slate-50 border-b border-slate-200">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      {openCategories[category.id] ?? true ? (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-500" />
                      )}
                      <span className="text-2xl">{getCategoryIcon(category.name)}</span>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <CardDescription>{category.items.length} items</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Category Subtotal</p>
                        <p className="text-2xl font-bold text-purple-700">
                          {formatCurrency(category.subtotal)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddingToCategory(category.id);
                          if (!openCategories[category.id]) {
                            toggleCategory(category.id);
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Item
                      </Button>
                    </div>
                  </div>
                </CollapsibleTrigger>
              </CardHeader>

              <CollapsibleContent>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead className="font-bold">Description</TableHead>
                          <TableHead className="font-bold text-right">Quantity</TableHead>
                          <TableHead className="font-bold">Unit</TableHead>
                          <TableHead className="font-bold text-right">Unit Cost</TableHead>
                          <TableHead className="font-bold text-right">Waste %</TableHead>
                          <TableHead className="font-bold text-right">Total Cost</TableHead>
                          <TableHead className="font-bold text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Add New Item Row */}
                        {addingToCategory === category.id && (
                          <TableRow className="bg-blue-50">
                            <TableCell>
                              <Input
                                value={newItem.description}
                                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                placeholder="Item description"
                                className="h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={newItem.quantity}
                                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                                className="h-8 text-right"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={newItem.unit}
                                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                placeholder="Unit"
                                className="h-8 w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                value={newItem.unitCost}
                                onChange={(e) => setNewItem({ ...newItem, unitCost: Number(e.target.value) })}
                                className="h-8 text-right"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                value={newItem.wasteFactor}
                                onChange={(e) => setNewItem({ ...newItem, wasteFactor: Number(e.target.value) })}
                                className="h-8 text-right"
                              />
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              {formatCurrency(
                                calculateItemCost(
                                  newItem.quantity || 0,
                                  newItem.unitCost || 0,
                                  newItem.wasteFactor || 0.10
                                )
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1 justify-center">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleAddItem(category.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Check className="w-4 h-4 text-green-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setAddingToCategory(null)}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="w-4 h-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Existing Items */}
                        {category.items.map((item) => (
                          <TableRow key={item.id} className="hover:bg-slate-50">
                            {editingId === item.id && editingItem ? (
                              <>
                                <TableCell>
                                  <Input
                                    value={editingItem.description}
                                    onChange={(e) =>
                                      setEditingItem({ ...editingItem, description: e.target.value })
                                    }
                                    className="h-8"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    value={editingItem.quantity}
                                    onChange={(e) =>
                                      setEditingItem({ ...editingItem, quantity: Number(e.target.value) })
                                    }
                                    className="h-8 text-right"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={editingItem.unit}
                                    onChange={(e) => setEditingItem({ ...editingItem, unit: e.target.value })}
                                    className="h-8 w-20"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={editingItem.unitCost}
                                    onChange={(e) =>
                                      setEditingItem({ ...editingItem, unitCost: Number(e.target.value) })
                                    }
                                    className="h-8 text-right"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={editingItem.wasteFactor}
                                    onChange={(e) =>
                                      setEditingItem({ ...editingItem, wasteFactor: Number(e.target.value) })
                                    }
                                    className="h-8 text-right"
                                  />
                                </TableCell>
                                <TableCell className="text-right font-bold">
                                  {formatCurrency(
                                    calculateItemCost(
                                      editingItem.quantity,
                                      editingItem.unitCost,
                                      editingItem.wasteFactor
                                    )
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1 justify-center">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleSaveItem(category.id)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Check className="w-4 h-4 text-green-600" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setEditingId(null);
                                        setEditingItem(null);
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
                                <TableCell className="font-medium">{item.description}</TableCell>
                                <TableCell className="text-right">{item.quantity.toLocaleString()}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="bg-slate-100 text-slate-700">
                                    {item.unit}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                  {formatCurrency(item.unitCost)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {(item.wasteFactor * 100).toFixed(0)}%
                                </TableCell>
                                <TableCell className="text-right font-bold text-purple-700">
                                  {formatCurrency(item.totalCost)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1 justify-center">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleEditItem(category.id, item)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Edit2 className="w-4 h-4 text-blue-600" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDeleteItem(category.id, item.id)}
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

                        {category.items.length === 0 && addingToCategory !== category.id && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                              No items in this category. Click "Add Item" to get started.
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Category Subtotal */}
                        {category.items.length > 0 && (
                          <TableRow className="bg-slate-100 font-bold">
                            <TableCell colSpan={5} className="text-right">
                              {category.name} Subtotal
                            </TableCell>
                            <TableCell className="text-right text-lg text-purple-700">
                              {formatCurrency(category.subtotal)}
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* Grand Total Card */}
      <Card className="border-slate-200 shadow-lg">
        <CardContent className="p-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100">Grand Total - All Categories</p>
              <p className="text-xs text-purple-200 mt-1">
                Includes {((inflationFactor) * 100).toFixed(1)}% inflation factor ({scenario} scenario)
              </p>
            </div>
            <p className="text-4xl font-bold">{formatCurrency(totalCost)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
