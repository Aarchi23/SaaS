/**
 * mockData.js
 * -----------
 * Client-side seed utility for FinDash.
 * Generates 10,000+ realistic transaction records and dense chart data.
 *
 * Install dependency before use:
 *   npm install @faker-js/faker
 *
 * Usage:
 *   import { generateTransactions, generateChartData, generateOverviewStats } from '@/lib/mockData';
 *
 *   const transactions = generateTransactions(10000);  // or any count
 *   const charts       = generateChartData();
 *   const stats        = generateOverviewStats();
 */

import { faker } from '@faker-js/faker';

// ─────────────────────────────────────────────
// CONSTANTS — realistic finance domain values
// ─────────────────────────────────────────────

const CATEGORIES = [
  'Infrastructure',
  'SaaS Subscriptions',
  'Payroll',
  'Marketing',
  'Legal & Compliance',
  'R&D',
  'Office & Facilities',
  'Travel & Expenses',
  'Consulting',
  'Vendor Payments',
  'Tax Payments',
  'Insurance',
  'Utilities',
  'Uncategorized',
];

const MERCHANTS = [
  'Amazon Web Services',
  'Google Cloud Platform',
  'Microsoft Azure',
  'Salesforce',
  'Stripe',
  'Slack Technologies',
  'Notion Labs',
  'Figma Inc.',
  'Atlassian',
  'Zoom Video Communications',
  'WeWork',
  'Regus Offices',
  'ADP Payroll Services',
  'Deloitte Consulting',
  'PricewaterhouseCoopers',
  'KPMG Advisory',
  'Hubspot Inc.',
  'Intercom',
  'Twilio',
  'Datadog',
  'Cloudflare',
  'Vercel',
  'GitHub',
  'Linear',
  'Segment',
  'Mixpanel',
  'Amplitude',
  'Brex Corporate',
  'Ramp Financial',
  'American Express',
  'Chase Business',
  'DHL Express',
  'FedEx Business',
  'Dell Technologies',
  'Apple Business',
  'Lenovo Enterprise',
  'HP Inc.',
  'HK_PAY_001',       // intentionally suspicious
  'PAY_ANON_4421',    // intentionally suspicious
  'WIRE_INTL_882',    // intentionally suspicious
];

const CURRENCIES = ['USD', 'USD', 'USD', 'USD', 'EUR', 'GBP', 'SGD', 'AED'];

const STATUSES = ['CLEARED', 'CLEARED', 'CLEARED', 'PENDING', 'FLAGGED'];
// CLEARED is weighted 3x to reflect realistic distribution

const REPORT_TYPES = [
  'Internal Audit',
  'External Audit',
  'Expense Report',
  'Payroll Run',
  'Tax Filing',
  'Vendor Invoice',
  'Wire Transfer',
  'ACH Transfer',
  'Credit Card',
  'Reimbursement',
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/**
 * Weighted random pick from an array.
 * Items with higher frequency in the array are picked more often.
 */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Format a number as a USD currency string with comma separators.
 */
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Generate a realistic transaction amount.
 * Uses weighted buckets to simulate real-world spend distribution:
 * many small transactions, fewer large ones.
 */
const generateAmount = () => {
  const bucket = Math.random();
  if (bucket < 0.45) return faker.number.float({ min: 50,    max: 2000,   fractionDigits: 2 });
  if (bucket < 0.75) return faker.number.float({ min: 2000,  max: 15000,  fractionDigits: 2 });
  if (bucket < 0.92) return faker.number.float({ min: 15000, max: 80000,  fractionDigits: 2 });
  return faker.number.float({ min: 80000, max: 500000, fractionDigits: 2 });
};

// ─────────────────────────────────────────────
// TRANSACTION GENERATOR
// ─────────────────────────────────────────────

/**
 * Generates `count` realistic transaction records.
 *
 * Each record shape:
 * {
 *   id         : string   — unique UUID
 *   ref        : string   — e.g. "TXN-94621"
 *   date       : string   — ISO date "YYYY-MM-DD"
 *   timestamp  : string   — ISO datetime
 *   merchant   : string   — merchant / payee name
 *   category   : string   — spend category
 *   type       : string   — payment type
 *   currency   : string   — ISO currency code
 *   amount     : number   — raw numeric value
 *   amountFmt  : string   — formatted e.g. "$42,801.12"
 *   status     : string   — CLEARED | PENDING | FLAGGED
 *   initiatedBy: string   — person who initiated
 *   approvedBy : string   — approver name (null if pending)
 *   notes      : string   — short memo
 * }
 *
 * @param {number} count — number of records to generate (default 10000)
 * @returns {Array<Object>}
 */
export const generateTransactions = (count = 10000) => {
  // Seed faker for reproducible results across page refreshes
  faker.seed(42);

  return Array.from({ length: count }, (_, i) => {
    const status   = pick(STATUSES);
    const currency = pick(CURRENCIES);
    const amount   = generateAmount();
    const merchant = pick(MERCHANTS);
    const date     = faker.date.between({
      from: '2024-01-01',
      to:   '2026-04-08',
    });

    // Suspicious merchants always get FLAGGED regardless of weighted pick
    const isSuspicious = ['HK_PAY_001', 'PAY_ANON_4421', 'WIRE_INTL_882'].includes(merchant);
    const finalStatus  = isSuspicious ? 'FLAGGED' : status;

    const approvedBy = finalStatus === 'CLEARED'
      ? faker.person.fullName()
      : null;

    return {
      id:          faker.string.uuid(),
      ref:         `TXN-${faker.string.numeric(5)}`,
      date:        date.toISOString().split('T')[0],
      timestamp:   date.toISOString(),
      merchant,
      category:    pick(CATEGORIES),
      type:        pick(REPORT_TYPES),
      currency,
      amount,
      amountFmt:   formatCurrency(amount, currency),
      status:      finalStatus,
      initiatedBy: faker.person.fullName(),
      approvedBy,
      notes:       faker.finance.transactionDescription(),
    };
  });
};

// ─────────────────────────────────────────────
// CHART DATA GENERATORS
// ─────────────────────────────────────────────

/**
 * Generates monthly ARR data for the past N months.
 * Returns an array of { label, value } objects suitable for bar charts.
 *
 * @param {number} months
 * @returns {Array<{ label: string, value: number }>}
 */
export const generateARRData = (months = 24) => {
  faker.seed(99);
  let base = faker.number.float({ min: 18, max: 25 }); // starting ARR in $M

  return Array.from({ length: months }, (_, i) => {
    const date  = new Date(2024, i, 1);
    const label = date.toLocaleString('en-US', { month: 'short', year: '2-digit' }).toUpperCase();

    // Simulate organic growth with slight variance
    const growthRate = faker.number.float({ min: 0.01, max: 0.04 });
    const dip        = Math.random() < 0.1 ? faker.number.float({ min: -0.02, max: 0 }) : 0;
    base *= (1 + growthRate + dip);

    return {
      label,
      value: parseFloat(base.toFixed(2)), // ARR in $M
    };
  });
};

/**
 * Generates weekly cash flow data (inflow vs outflow) for the past N weeks.
 *
 * @param {number} weeks
 * @returns {Array<{ week: string, inflow: number, outflow: number, net: number }>}
 */
export const generateCashFlowData = (weeks = 52) => {
  faker.seed(77);

  return Array.from({ length: weeks }, (_, i) => {
    const date    = new Date(2025, 0, 1 + i * 7);
    const week    = `W${String(i + 1).padStart(2, '0')}`;
    const inflow  = faker.number.float({ min: 800000,  max: 3500000,  fractionDigits: 0 });
    const outflow = faker.number.float({ min: 600000,  max: 2800000,  fractionDigits: 0 });

    return {
      week,
      date:    date.toISOString().split('T')[0],
      inflow,
      outflow,
      net:     inflow - outflow,
      inflowFmt:  formatCurrency(inflow),
      outflowFmt: formatCurrency(outflow),
      netFmt:     formatCurrency(inflow - outflow),
    };
  });
};

/**
 * Generates spend breakdown by category for pie/donut charts.
 *
 * @returns {Array<{ category: string, amount: number, percentage: number }>}
 */
export const generateCategoryBreakdown = () => {
  faker.seed(55);

  const rawData = CATEGORIES.map((category) => ({
    category,
    amount: faker.number.float({ min: 50000, max: 4000000, fractionDigits: 0 }),
  }));

  const total = rawData.reduce((sum, d) => sum + d.amount, 0);

  return rawData
    .map((d) => ({
      ...d,
      amountFmt:  formatCurrency(d.amount),
      percentage: parseFloat(((d.amount / total) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.amount - a.amount);
};

/**
 * Generates daily transaction volume count for the past N days.
 * Useful for sparkline / area charts.
 *
 * @param {number} days
 * @returns {Array<{ date: string, count: number, volume: number }>}
 */
export const generateDailyVolume = (days = 365) => {
  faker.seed(33);

  return Array.from({ length: days }, (_, i) => {
    const date   = new Date(2025, 0, 1 + i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const count  = isWeekend
      ? faker.number.int({ min: 5,  max: 40 })
      : faker.number.int({ min: 40, max: 180 });
    const volume = faker.number.float({ min: count * 1000, max: count * 15000, fractionDigits: 0 });

    return {
      date:      date.toISOString().split('T')[0],
      count,
      volume,
      volumeFmt: formatCurrency(volume),
    };
  });
};

// ─────────────────────────────────────────────
// OVERVIEW STATS
// ─────────────────────────────────────────────

/**
 * Generates high-level KPI stats for the Overview page StatCards.
 *
 * @returns {Object}
 */
export const generateOverviewStats = () => {
  faker.seed(11);

  return {
    totalAssets:        formatCurrency(faker.number.float({ min: 1.1e9,  max: 1.5e9,  fractionDigits: 0 })),
    liquidity:          `${faker.number.float({ min: 3.8, max: 5.2, fractionDigits: 1 })}x`,
    operatingMargin:    `${faker.number.int({ min: 68, max: 78 })}%`,
    arr:                formatCurrency(faker.number.float({ min: 38e6,   max: 50e6,   fractionDigits: 0 })),
    burnRate:           formatCurrency(faker.number.float({ min: 1.2e6,  max: 2.5e6,  fractionDigits: 0 })),
    flaggedCount:       faker.number.int({ min: 38, max: 65 }),
    pendingApprovals:   faker.number.int({ min: 12, max: 30 }),
    avgTicketSize:      formatCurrency(faker.number.float({ min: 2000, max: 4500, fractionDigits: 0 })),
    yoyGrowth:          `${faker.number.float({ min: 18, max: 26, fractionDigits: 1 })}%`,
    totalTransactions:  faker.number.int({ min: 9800, max: 10200 }),
  };
};

// ─────────────────────────────────────────────
// CONVENIENCE — generate everything at once
// ─────────────────────────────────────────────

/**
 * Generates the full mock dataset in one call.
 * Cache this at the module level or in a Zustand store to avoid re-generating on every render.
 *
 * @param {number} transactionCount
 * @returns {{
 *   transactions   : Array,
 *   arrData        : Array,
 *   cashFlowData   : Array,
 *   categoryData   : Array,
 *   dailyVolume    : Array,
 *   overviewStats  : Object,
 * }}
 */
export const generateAllMockData = (transactionCount = 10000) => ({
  transactions:  generateTransactions(transactionCount),
  arrData:       generateARRData(24),
  cashFlowData:  generateCashFlowData(52),
  categoryData:  generateCategoryBreakdown(),
  dailyVolume:   generateDailyVolume(365),
  overviewStats: generateOverviewStats(),
});
