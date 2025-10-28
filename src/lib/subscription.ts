import { supabase } from './supabase'

export interface UserSubscription {
  status: 'active' | 'inactive' | 'pending'
  current_period_end?: string
  transaction_id?: string
}

export async function checkUserSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    const response = await fetch('/api/subscription/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error)
    return null
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Erro no login')
    }

    return data
  } catch (error) {
    console.error('Erro no login:', error)
    throw error
  }
}

// Função para redirecionar para o PagSeguro
export const PAGSEGURO_PAYMENT_LINK = 'https://pag.ae/81aj-zE2K'

export function redirectToPagSeguro() {
  window.open(PAGSEGURO_PAYMENT_LINK, '_blank')
}

// Função para simular verificação de pagamento (para desenvolvimento)
export async function simulatePaymentVerification(email: string) {
  try {
    // Simular webhook do PagSeguro
    const response = await fetch('/api/webhook/pagseguro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction: {
          id: `sim_${Date.now()}`,
          status: 'paid',
          customer: {
            email: email
          },
          amount: 19.90
        }
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Erro ao simular pagamento:', error)
    return false
  }
}