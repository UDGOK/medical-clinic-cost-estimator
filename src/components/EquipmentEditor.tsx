'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { EquipmentItem } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { Truck, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

interface Props {
  items: EquipmentItem[];
  onItemsChange: (items: EquipmentItem[]) => void;
  totalCost: number;
}

export default function EquipmentEditor({ items, onItemsChange, totalCost }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<EquipmentItem>>({
    name: '',
    vendor: '',
    itemType: 'Equipment Rental',
    rateType: 'Daily',
    rate: 0,
    duration: 1,
    notes: '',
  });

  const handleAdd = () => {
    if (!newItem.name || !newItem.vendor || !newItem.rate) return;

    const item: EquipmentItem = {
      id: `eq-${Date.now()}`,
      name: newItem.name || '',
      vendor: newItem.vendor || '',
      itemType: newItem.itemType || 'Equipment Rental',
      rateType: newItem.rateType || 'Daily',
      rate: newItem.rate || 0,
      duration: newItem.duration || 1,
      totalCost: (newItem.rate || 0) * (newItem.duration || 1),
      notes: newItem.notes,
    };

    onItemsChange([...items, item]);
    setIsAdding(false);
    setNewItem({
      name: '',
      vendor: '',
      itemType: 'Equipment Rental',
      rateType: 'Daily',
      rate: 0,
      duration: 1,
      notes: '',
    });
  };

  const handleEdit = (item: EquipmentItem) => {
    setEditingId(item.id);
    setEditingItem({ ...item });
  };

  const handleSave = () => {
    if (!editingItem) return;

    const updated = items.map(item =>
      item.id === editingId
        ? { ...editingItem, totalCost: editingItem.rate * editingItem.duration }
        : item
    );

    onItemsChange(updated);
    setEditingId(null);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    onItemsChange(items.filter(item => item.id !== id));
  };

  const getItemTypeColor = (type: string) => {
    switch (type) {
      case 'Equipment Rental':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Subcontractor':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Equipment & Subcontractors
              </CardTitle>
              <CardDescription className="text-green-100">
                Manage equipment rentals and subcontractor costs
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-100 mb-1">Total Equipment Cost</p>
              <p className="text-3xl font-bold">{formatCurrency(totalCost)}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Items Table */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Equipment & Subcontractor Items</CardTitle>
              <CardDescription>Add, edit, or remove cost items</CardDescription>
            </div>
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-bold">Item Name</TableHead>
                  <TableHead className="font-bold">Vendor</TableHead>
                  <TableHead className="font-bold">Type</TableHead>
                  <TableHead className="font-bold">Rate Type</TableHead>
                  <TableHead className="font-bold text-right">Rate</TableHead>
                  <TableHead className="font-bold text-right">Duration</TableHead>
                  <TableHead className="font-bold text-right">Total Cost</TableHead>
                  <TableHead className="font-bold">Notes</TableHead>
                  <TableHead className="font-bold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Add New Item Row */}
                {isAdding && (
                  <TableRow className="bg-blue-50">
                    <TableCell>
                      <Input
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="Item name"
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={newItem.vendor}
                        onChange={(e) => setNewItem({ ...newItem, vendor: e.target.value })}
                        placeholder="Vendor"
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={newItem.itemType}
                        onValueChange={(value) => setNewItem({ ...newItem, itemType: value as EquipmentItem['itemType'] })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Equipment Rental">Equipment Rental</SelectItem>
                          <SelectItem value="Subcontractor">Subcontractor</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={newItem.rateType}
                        onValueChange={(value) => setNewItem({ ...newItem, rateType: value as EquipmentItem['rateType'] })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Daily">Daily</SelectItem>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Lump Sum">Lump Sum</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={newItem.rate}
                        onChange={(e) => setNewItem({ ...newItem, rate: Number(e.target.value) })}
                        className="h-8 text-right"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={newItem.duration}
                        onChange={(e) => setNewItem({ ...newItem, duration: Number(e.target.value) })}
                        className="h-8 text-right"
                      />
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatCurrency((newItem.rate || 0) * (newItem.duration || 1))}
                    </TableCell>
                    <TableCell>
                      <Input
                        value={newItem.notes}
                        onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                        placeholder="Notes"
                        className="h-8"
                      />
                    </TableCell>
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

                {/* Existing Items */}
                {items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50">
                    {editingId === item.id && editingItem ? (
                      <>
                        <TableCell>
                          <Input
                            value={editingItem.name}
                            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editingItem.vendor}
                            onChange={(e) => setEditingItem({ ...editingItem, vendor: e.target.value })}
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={editingItem.itemType}
                            onValueChange={(value) => setEditingItem({ ...editingItem, itemType: value as EquipmentItem['itemType'] })}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Equipment Rental">Equipment Rental</SelectItem>
                              <SelectItem value="Subcontractor">Subcontractor</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={editingItem.rateType}
                            onValueChange={(value) => setEditingItem({ ...editingItem, rateType: value as EquipmentItem['rateType'] })}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Daily">Daily</SelectItem>
                              <SelectItem value="Weekly">Weekly</SelectItem>
                              <SelectItem value="Monthly">Monthly</SelectItem>
                              <SelectItem value="Lump Sum">Lump Sum</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={editingItem.rate}
                            onChange={(e) => setEditingItem({ ...editingItem, rate: Number(e.target.value) })}
                            className="h-8 text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={editingItem.duration}
                            onChange={(e) => setEditingItem({ ...editingItem, duration: Number(e.target.value) })}
                            className="h-8 text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(editingItem.rate * editingItem.duration)}
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editingItem.notes || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                            className="h-8"
                          />
                        </TableCell>
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
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-slate-600">{item.vendor}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getItemTypeColor(item.itemType)}>
                            {item.itemType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">{item.rateType}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(item.rate)}
                        </TableCell>
                        <TableCell className="text-right">{item.duration}</TableCell>
                        <TableCell className="text-right font-bold text-blue-700">
                          {formatCurrency(item.totalCost)}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{item.notes}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 justify-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(item)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(item.id)}
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

                {items.length === 0 && !isAdding && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                      No items yet. Click "Add Item" to get started.
                    </TableCell>
                  </TableRow>
                )}

                {items.length > 0 && (
                  <TableRow className="bg-slate-900 text-white font-bold">
                    <TableCell colSpan={6} className="text-right">
                      TOTAL EQUIPMENT & SUBCONTRACTOR COST
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
    </div>
  );
}
