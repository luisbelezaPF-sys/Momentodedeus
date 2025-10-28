import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ user_id: string }> }
) {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
      return NextResponse.json(
        { error: 'Supabase não configurado. Configure as variáveis de ambiente.' },
        { status: 503 }
      )
    }

    const params = await context.params
    const { data, error } = await supabase
      .from('assinaturas')
      .select('*')
      .eq('user_id', params.user_id)
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data) {
      return NextResponse.json({ 
        status: 'inativa',
        message: 'Nenhuma assinatura encontrada' 
      })
    }

    // Verificar se a assinatura ainda está válida
    const now = new Date()
    const validade = new Date(data.validade)
    
    if (now > validade) {
      // Atualizar status para inativa se expirou
      await supabase
        .from('assinaturas')
        .update({ status: 'inativa' })
        .eq('user_id', params.user_id)
      
      return NextResponse.json({
        ...data,
        status: 'inativa',
        expired: true
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ user_id: string }> }
) {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
      return NextResponse.json(
        { error: 'Supabase não configurado. Configure as variáveis de ambiente.' },
        { status: 503 }
      )
    }

    const params = await context.params
    const body = await request.json()
    
    const subscriptionData = {
      user_id: params.user_id,
      status: 'ativa',
      metodo_pagamento: body.metodo_pagamento || 'PagBank',
      inicio: new Date().toISOString(),
      validade: body.tipo === 'anual' 
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }

    const { data, error } = await supabase
      .from('assinaturas')
      .upsert([subscriptionData])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}