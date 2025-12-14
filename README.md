# Medical Clinic Cost Estimation System

An enterprise-grade web application for comprehensive medical facility cost estimation, financial modeling, and professional proposal generation.

![Medical Clinic Cost Estimator](https://img.shields.io/badge/Next.js-15.3.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)

## ✨ Features

### 🏥 Medical-Specific Cost Analysis
- **Oklahoma Medical Labor Rates (2025-2026)**: Fully burdened rates including malpractice insurance, benefits, payroll taxes, and continuing education
- **Medical Equipment Database**: MRI machines, X-ray systems, ultrasounds, medical gas systems, EHR software, and specialized medical furniture
- **Detailed Cost Categories**: Site work, structure, interiors, MEP systems, and medical-specific installations

### 🤖 AI-Powered Intelligence
- **Smart Staffing Recommendations**: AI predictions for optimal medical staff FTEs based on facility size
- **Budget Health Analysis**: Real-time alerts for cost overruns and optimization opportunities
- **Timeline Predictions**: Project phase scheduling with critical path analysis
- **Risk Assessment**: Multi-factor risk scoring with mitigation strategies
- **Equipment ROI Analysis**: Break-even calculations and 5-year revenue projections
- **Market Comparison**: Benchmark your project against national medical facility averages
- **Cost Optimization**: Automated suggestions for potential savings

### 📊 Financial Modeling
- **Scenario Planning**: Optimistic, Realistic, and Pessimistic scenarios with dynamic factors
- **Contingency Management**: Complexity-based contingency calculations
- **Soft Cost Analysis**: Permits, insurance, professional fees, financing, and project management
- **Profit Margin Modeling**: Industry-standard margin projections (12-25%)
- **Real-time Calculations**: Instant cost updates as inputs change

### 📄 Professional PDF Generation
- **Multi-page Client Proposals**: 6-page professional PDFs with company branding
- **Executive Summary**: Project overview and KPIs
- **Detailed Breakdowns**: Labor, equipment, construction, and financial summaries
- **Custom Branding**: Upscale Development Group corporate identity

### ✏️ Fully Editable Data
- **Labor Management**: Add, edit, delete medical staff positions with custom rates
- **Equipment Editor**: Manage rentals, subcontractors, and purchases
- **Cost Categories**: Edit detailed line items across all construction categories
- **Project Parameters**: Adjust square footage, dates, complexity, and scenarios

## 🚀 Tech Stack

- **Framework**: Next.js 15.3.2 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts
- **PDF Generation**: jsPDF with autoTable
- **Package Manager**: Bun
- **Deployment**: Netlify-ready

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/UDGOK/medical-clinic-cost-estimator.git
cd medical-clinic-cost-estimator

# Install dependencies
bun install

# Run development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
construction-cost-estimator/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── AIInsights.tsx         # Predictive analytics dashboard
│   │   ├── DetailedCostEstimation.tsx
│   │   ├── EquipmentEditor.tsx
│   │   ├── ExecutiveDashboard.tsx
│   │   ├── FinancialModeling.tsx
│   │   ├── LaborIntelligence.tsx
│   │   └── MaterialDatabase.tsx
│   └── lib/
│       ├── calculations.ts        # Cost calculation utilities
│       ├── data.ts                # Medical data and defaults
│       ├── intelligence.ts        # AI prediction algorithms
│       ├── pdf-generator.ts       # PDF creation logic
│       ├── types.ts               # TypeScript interfaces
│       └── utils.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 📊 Data Sources

- **Labor Rates**: Oklahoma healthcare market data (2025-2026)
- **Equipment Costs**: Industry-standard pricing from major medical equipment vendors
- **Construction Costs**: National averages adjusted for medical facility requirements ($250-400/sq ft)
- **Burden Rates**: ~55% employer burden (malpractice, benefits, taxes, licensing)

## 🔑 Key Metrics

The system calculates comprehensive project KPIs:

- **Total Project Cost**: All-in cost including materials, labor, equipment, soft costs, contingency, and profit
- **Cost per Square Foot**: Benchmarked against $310/sq ft national average
- **Labor Percentage**: Typically 3-7% of total project cost
- **Equipment Percentage**: 45-55% for medical facilities (higher than standard construction)
- **Contingency**: 5-18% based on scenario and complexity
- **Profit Margin**: 12-25% based on market conditions

## 🎯 Use Cases

- **Healthcare Developers**: Plan and budget new medical facilities
- **Medical Practices**: Estimate costs for clinic expansions or new locations
- **General Contractors**: Create professional proposals for medical construction
- **Financial Analysts**: Model healthcare real estate investments
- **Cost Estimators**: Benchmark and validate medical facility estimates

## 🛠️ Customization

### Adding Medical Staff Positions
Navigate to the **Labor** tab and click "Add Position" to create custom medical roles with:
- Base hourly rates (2025 and 2026)
- Burdened rates (including all employer costs)
- Efficiency factors (hours per square foot)
- Estimated annual hours

### Adjusting Equipment
The **Equipment** tab allows you to:
- Add new medical equipment or systems
- Choose between rental, purchase, or subcontractor
- Set custom rates and durations
- Track total investment costs

### Modifying Cost Categories
The **Detailed Costs** tab provides granular control over:
- Site work and foundation
- Shell and structure
- Interior finishes
- MEP systems
- Medical-specific installations

## 📈 Scenario Planning

Three built-in scenarios adjust all calculations:

| Scenario | Contingency | Waste Factor | Labor Efficiency | Material Inflation | Profit Margin |
|----------|-------------|--------------|------------------|--------------------|---------------|
| **Optimistic** | 5% | 0.05x | 110% | 2% | 25% |
| **Realistic** | 10% | 0.10x | 100% | 4.5% | 18% |
| **Pessimistic** | 18% | 0.15x | 85% | 8% | 12% |

## 🤝 Contributing

Contributions are welcome! This project is designed to be extensible and can be adapted for:
- Other geographic markets (update labor rates in `src/lib/data.ts`)
- Different facility types (adapt equipment and cost categories)
- Additional AI insights (extend `src/lib/intelligence.ts`)
- Custom PDF templates (modify `src/lib/pdf-generator.ts`)

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Same](https://same.new) - AI-powered development platform
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Charts powered by [Recharts](https://recharts.org)
- PDF generation via [jsPDF](https://github.com/parallax/jsPDF)

## 📧 Contact

For questions, suggestions, or collaboration opportunities, please open an issue on GitHub.

---

**Note**: This is a cost estimation tool for planning purposes. Actual project costs may vary based on final design, material selections, market conditions, and unforeseen circumstances. Always consult with licensed professionals for final cost estimates and construction planning.
