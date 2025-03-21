export function formatMoney(amount: number, currency = "$"): string {
    // Format with dots for thousands and comma for decimals
    const formatter = new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  
    return `${currency} ${formatter.format(amount)}`
  }
  
  