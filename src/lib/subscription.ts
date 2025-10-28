import { supabase } from './supabase'

export interface UserSubscription {
  id: string
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  current_period_start: string
  current_period_end: string
  created_at: string
  updated_at: string
}

export async function checkUserSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error) {
      console.error('Erro ao verificar assinatura:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error)
    return null
  }
}

export async function createSubscription(userId: string, subscriptionData: any) {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        stripe_customer_id: subscriptionData.customer,
        stripe_subscription_id: subscriptionData.id,
        status: subscriptionData.status,
        current_period_start: new Date(subscriptionData.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscriptionData.current_period_end * 1000).toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar assinatura:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Erro ao criar assinatura:', error)
    return null
  }
}

export async function updateSubscriptionStatus(subscriptionId: string, status: string) {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscriptionId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar status da assinatura:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Erro ao atualizar status da assinatura:', error)
    return null
  }
}