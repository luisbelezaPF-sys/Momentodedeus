// Sistema de pagamento com PagSeguro
export const PAGSEGURO_PAYMENT_LINK = 'https://pag.ae/81aj-zE2K'

export const redirectToPagSeguro = () => {
  window.open(PAGSEGURO_PAYMENT_LINK, '_blank')
}

// Configurações de assinatura
export const SUBSCRIPTION_PRICE = 'R$ 19,90'
export const SUBSCRIPTION_PERIOD = 'mensal'