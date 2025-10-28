import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Verificar se é o usuário admin
    if (email === 'admin' && password === 'forever24') {
      // Criar/buscar usuário admin
      const { data: adminUser, error: adminError } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'admin@sistema.com')
        .single()

      let userId = adminUser?.id

      if (!adminUser) {
        // Criar usuário admin
        const { data: newAdmin, error: createError } = await supabase
          .from('users')
          .insert([{
            nome: 'Administrador',
            email: 'admin@sistema.com'
          }])
          .select()
          .single()

        if (createError) {
          console.error('Erro ao criar admin:', createError)
          return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
          )
        }

        userId = newAdmin.id
      }

      // Verificar/criar assinatura premium para admin
      const { data: assinatura } = await supabase
        .from('assinaturas')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (!assinatura) {
        // Criar assinatura premium para admin
        const dataFim = new Date()
        dataFim.setFullYear(dataFim.getFullYear() + 10) // 10 anos de premium

        await supabase
          .from('assinaturas')
          .insert([{
            user_id: userId,
            status: 'ativa',
            metodo_pagamento: 'admin',
            inicio: new Date().toISOString(),
            validade: dataFim.toISOString()
          }])
      }

      return NextResponse.json({
        success: true,
        user: {
          id: userId,
          email: 'admin@sistema.com',
          nome: 'Administrador',
          status_assinatura: 'active'
        }
      })
    }

    // Login normal para outros usuários
    const { data: usuario, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !usuario) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Para usuários normais, verificar se tem assinatura
    const { data: assinatura } = await supabase
      .from('assinaturas')
      .select('*')
      .eq('user_id', usuario.id)
      .single()

    let assinaturaAtiva = false
    if (assinatura) {
      const agora = new Date()
      const dataFim = new Date(assinatura.validade)
      assinaturaAtiva = assinatura.status === 'ativa' && dataFim > agora
    }

    return NextResponse.json({
      success: true,
      user: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        status_assinatura: assinaturaAtiva ? 'active' : 'inactive',
        data_fim_assinatura: assinatura?.validade
      }
    })

  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}