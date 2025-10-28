import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
      return NextResponse.json(
        { error: 'Supabase não configurado. Configure as variáveis de ambiente.' },
        { status: 503 }
      )
    }

    const { data, error } = await supabase
      .from('devocionais')
      .select('*')
      .eq('dia_num', parseInt(params.id))
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
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
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
      return NextResponse.json(
        { error: 'Supabase não configurado. Configure as variáveis de ambiente.' },
        { status: 503 }
      )
    }

    const { user_id } = await request.json()
    
    const { data, error } = await supabase
      .from('devocionais_status')
      .upsert({
        user_id,
        devocional_id: parseInt(params.id),
        lido_boolean: true,
        lido_at: new Date().toISOString()
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}