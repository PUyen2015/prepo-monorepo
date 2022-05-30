import { CURRENCY_PRECISION } from '@prepo-io/constants'
import { format } from 'd3'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { ERC20_UNITS } from '../lib/constants'

/** It is common to use string type to maintain values with precision. If the output is undefined, this input cannot be converted to percent (e.g. invalid string) */
export function formatPercent(percent: number | string, precision = 1): string | undefined {
  const transformedPercent = +percent
  if (!transformedPercent || transformedPercent > 1 || transformedPercent < -1) {
    return undefined
  }
  return (transformedPercent * 100).toFixed(precision)
}

export const makeAddStep = (value: number): number => {
  if (value >= 1000000000) {
    return 1000000000
  }
  if (value >= 1000000) {
    return 1000000
  }
  if (value >= 1000) {
    return 1000
  }
  return 1
}

export const makeMinusStep = (value: number): number => {
  if (value > 1000000000) {
    return 1000000000
  }
  if (value > 1000000) {
    return 1000000
  }
  if (value > 1000) {
    return 1000
  }
  return 1
}

enum FormatterSettings {
  SIGNIFICANT_DIGITS = '.[digits]s',
  TRIMS_INSIGNIFICANT_TRAILING_ZEROS = '~s',
}

type NumFormatterSettings = {
  significantDigits?: number
}

/**
 * Replace d3.format assigning G as Giga
 * With B as Billion
 */
const replaceGigaToBillion = (value: string): string => value.replace(/G/, 'B')

/**
 * Returns a large number with a SI Prefix
 * 100k, 100M, 10B
 * @param amount - The amount to format
 * @param numFormatterSettings - The settings object
 * @param numFormatterSettings.significantDigits - The amount of significant digits that the output should have. Ex: 12.3k for 3 significantDigits
 * @param numFormatterSettings.precisionDigits - The amount of precision digits that the output should have. Ex: 12.32k for 2 precisionDigits
 */
export const numFormatter = (
  num: number | string,
  numFormatterSettings?: NumFormatterSettings
): string => {
  const numValue = typeof num === 'string' ? parseInt(num, 10) : num

  const rule = numFormatterSettings?.significantDigits
    ? FormatterSettings.SIGNIFICANT_DIGITS.replace(
        '[digits]',
        numFormatterSettings.significantDigits.toString()
      )
    : FormatterSettings.TRIMS_INSIGNIFICANT_TRAILING_ZEROS

  return replaceGigaToBillion(format(rule)(numValue))
}

export const balanceToNumber = (balanceOfSigner: BigNumber): number =>
  Number(formatUnits(balanceOfSigner.toString(), ERC20_UNITS))

export const validateNumber = (value: number | string | undefined = 0): number => {
  if (+value > 0) {
    return +value
  }
  return 0
}

export const bigAmountToShortPresentation = (number: number, digits = 2): string => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  const item = lookup
    .slice()
    .reverse()
    .find((itemLookup) => Math.abs(number) >= itemLookup.value)

  const newFormatValue = item
    ? Number(number / item.value)
        .toFixed(digits)
        .replace(rx, '$1')
    : Number(number).toFixed(digits)

  return item ? `${newFormatValue}${item?.symbol}` : newFormatValue
}

export const numberWithCommas = (numberValue: number | undefined): string => {
  if (!numberValue) return '0'
  return numberValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Makes sure to avoid getting large string numbers like
 * 14.999999999999999999 when converting from BigNumber to string
 * This will always return the amount of digits that are needed according to our currency precision
 * @returns string
 */
export const normalizeDecimalPrecision = (numberAsString: string | undefined): string => {
  if (!numberAsString) return '0'
  const decimalsPrecision = `^-?\\d+(?:\\.\\d{0,${CURRENCY_PRECISION}})?`
  const matchResult = numberAsString.match(decimalsPrecision)
  return matchResult ? matchResult[0] : numberAsString
}

/**
 * Uses javascript internationalization number format for USD
 * Returns the number with CURRENCY_PRECISION configured on the application
 * @param amount - The amount to format
 * @param [decimals=true] - If true, the amount will be formatted with decimals
 */
export function formatUsd(amount: number | string, decimals = true): string {
  const normalizeAmount = normalizeDecimalPrecision(`${amount}`)
  const usd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(+normalizeAmount)

  if (decimals) return usd

  return usd.split('.')[0]
}

export const formatPrice = (num: number, breakpoint: number): string => {
  if (num > breakpoint) {
    return `$${numFormatter(num)}`
  }
  return formatUsd(num)
}