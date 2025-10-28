import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar assinatura do usuário
    const { data: assinatura, error } = await supabase
      .from('assinaturas')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar assinatura:', error)
      return NextResponse.json(
        { status: 'inactive' },
        { status: 200 }
      )
    }

    if (!assinatura) {
      return NextResponse.json({
        status: 'inactive'
      })
    }

    // Verificar se assinatura está ativa
    const agora = new Date()
    const dataFim = new Date(assinatura.validade)
    const assinaturaAtiva = assinatura.status === 'ativa' && dataFim > agora

    return NextResponse.json({
      status: assinaturaAtiva ? 'active' : 'inactive',
      current_period_end: assinatura.validade,
      transaction_id: assinatura.metodo_pagamento
    })

  } catch (error) {
    console.error('Erro ao verificar assinatura:', error)
    return NextResponse.json(
      { status: 'inactive' },
      { status: 200 }
    )
  }
}