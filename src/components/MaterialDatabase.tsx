'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Material, Scenario } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { scenarioFactors } from '@/lib/data';
import { Package, ExternalLink } from 'lucide-react';

interface Props {
  materials: Material[];
  scenario: Scenario;
}

export default function MaterialDatabase({ materials, scenario }: Props) {
  const factors = scenarioFactors[scenario];

  const calculateExtendedCost = (material: Material) => {
    const discountedPrice = material.unitPrice * (1 - material.bulkDiscount / 100);
    const wasteAdjusted = material.wasteFactor * factors.wasteFactor;
    const inflationAdjusted = 1 + factors.materialInflation;

    return material.quantity * discountedPrice * (1 + wasteAdjusted) * inflationAdjusted;
  };

  const getVendorColor = (vendor: string) => {
    switch (vendor) {
      case 'Lowes':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Home Depot':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Build.com':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const totalMaterialCost = materials.reduce((sum, m) => sum + calculateExtendedCost(m), 0);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Package className="w-5 h-5" />
                Material Database
              </CardTitle>
              <CardDescription className="text-blue-100">
                API-ready pricing with bulk discounts and waste factors
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100 mb-1">Total Material Cost</p>
              <p className="text-3xl font-bold">{formatCurrency(totalMaterialCost)}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Materials Table */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle>Material Line Items</CardTitle>
          <CardDescription>
            Pricing includes bulk discounts, waste factors, and {(factors.materialInflation * 100).toFixed(1)}% inflation ({scenario} scenario)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-bold">SKU</TableHead>
                  <TableHead className="font-bold">Item Name</TableHead>
                  <TableHead className="font-bold">Category</TableHead>
                  <TableHead className="font-bold">Vendor</TableHead>
                  <TableHead className="font-bold text-right">Unit Price</TableHead>
                  <TableHead className="font-bold text-right">Quantity</TableHead>
                  <TableHead className="font-bold text-right">Unit</TableHead>
                  <TableHead className="font-bold text-right">Discount</TableHead>
                  <TableHead className="font-bold text-right">Lead Time</TableHead>
                  <TableHead className="font-bold text-right">Extended Cost</TableHead>
                  <TableHead className="font-bold text-center">API</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material, index) => (
                  <TableRow key={index} className="hover:bg-slate-50">
                    <TableCell className="font-mono text-xs">{material.sku}</TableCell>
                    <TableCell className="font-medium">{material.itemName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-50">
                        {material.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getVendorColor(material.vendor)}>
                        {material.vendor}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(material.unitPrice)}</TableCell>
                    <TableCell className="text-right font-semibold">{material.quantity.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-slate-600">{material.unit}</TableCell>
                    <TableCell className="text-right text-green-700 font-semibold">
                      {material.bulkDiscount}%
                    </TableCell>
                    <TableCell className="text-right text-slate-600">{material.leadTime}d</TableCell>
                    <TableCell className="text-right font-bold text-blue-700">
                      {formatCurrency(calculateExtendedCost(material))}
                    </TableCell>
                    <TableCell className="text-center">
                      {material.liveApiLink && (
                        <a
                          href={material.liveApiLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                          title="API Endpoint"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-slate-900 text-white font-bold">
                  <TableCell colSpan={9} className="text-right">
                    TOTAL MATERIAL COST
                  </TableCell>
                  <TableCell className="text-right text-xl">
                    {formatCurrency(totalMaterialCost)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Factors */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle>Active Pricing Factors ({scenario} scenario)</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-slate-600 mb-1">Material Inflation</p>
              <p className="text-2xl font-bold text-blue-700">
                {(factors.materialInflation * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-slate-600 mb-1">Waste Factor Multiplier</p>
              <p className="text-2xl font-bold text-amber-700">
                {factors.wasteFactor.toFixed(2)}x
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-slate-600 mb-1">Contingency Rate</p>
              <p className="text-2xl font-bold text-green-700">
                {(factors.contingency * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
