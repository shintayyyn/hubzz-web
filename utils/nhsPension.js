// NHS pension contribution rates (2026/27 scheme year)
// Source: NHSBSA — update these values each April when NHSBSA publishes the new year's rates

export const TIERS = [
  { max: 13259,    rate: 5.2,  label: '5.2% (Up to £13,259)' },
  { max: 28854,    rate: 6.5,  label: '6.5% (£13,260 – £28,854)' },
  { max: 35155,    rate: 8.3,  label: '8.3% (£28,855 – £35,155)' },
  { max: 52778,    rate: 9.8,  label: '9.8% (£35,156 – £52,778)' },
  { max: 67668,    rate: 10.7, label: '10.7% (£52,779 – £67,668)' },
  { max: Infinity, rate: 12.5, label: '12.5% (£67,669 and above)' },
]

// NHS employer contribution rate (2026/27)
export const EMPLOYER_CONTRIBUTION_RATE = 14.38

/**
 * Returns the NHS pension tiered contribution rate (%) for a given
 * annualised pensionable income (rounded down to nearest pound).
 */
export function getTieredRate(annualisedIncome) {
  const income = Math.floor(annualisedIncome)
  for (const tier of TIERS) {
    if (income <= tier.max) return tier.rate
  }
  return 12.5
}

/**
 * Annualises a pensionable pay amount over a given number of days,
 * then looks up and returns the contribution rate.
 *
 * NOTE: For Solo Forms, pensionable pay = A − B (no 90% rule).
 *       The 90% rule applies only to freelance GP locum Forms A/B.
 *
 * @param {number} pensionablePay  - actual NHS pensionable pay for the period
 * @param {string|Date} dateStart  - period start date
 * @param {string|Date} dateEnd    - period end date (inclusive)
 */
export function getTieredRateForPeriod(pensionablePay, dateStart, dateEnd) {
  const start = new Date(dateStart)
  const end = new Date(dateEnd)
  const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1 || 1
  const annualised = (pensionablePay / (days || 1)) * 365
  return getTieredRate(annualised)
}
