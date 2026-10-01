import Decimal from 'decimal.js'

/**
 * Valores em ETH trafegam como strings decimais ("1.19"), nunca como number,
 * para não perder precisão (0.1 + 0.2 !== 0.3 em ponto flutuante).
 */
export type EthString = string

Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_UP })

export const eth = {
  add: (a: EthString, b: EthString): EthString => new Decimal(a).plus(b).toString(),
  sub: (a: EthString, b: EthString): EthString => new Decimal(a).minus(b).toString(),
  mul: (a: EthString, qty: number): EthString => new Decimal(a).times(qty).toString(),
  eq: (a: EthString, b: EthString): boolean => new Decimal(a).equals(b),
  /** Formata para exibição, preservando as casas necessárias (mín. 2). */
  format(value: EthString, minDecimals = 2): string {
    const d = new Decimal(value)
    const decimals = Math.max(d.decimalPlaces(), minDecimals)
    return d.toFixed(decimals)
  },
}
