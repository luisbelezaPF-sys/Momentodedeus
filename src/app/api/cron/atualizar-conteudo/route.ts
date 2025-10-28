import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Verificar se a requisição tem a chave de autorização correta
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'meu-momento-com-deus-cron';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Chamar a API de geração de conteúdo
    const baseUrl = request.nextUrl.origin;
    const response = await fetch(`${baseUrl}/api/gerar-conteudo-diario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Conteúdo diário gerado automaticamente:', result);
      return NextResponse.json({ 
        success: true, 
        message: 'Conteúdo diário atualizado com sucesso',
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('Erro ao gerar conteúdo:', result);
      return NextResponse.json({ 
        success: false, 
        error: result.error || 'Erro desconhecido' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erro no cron job:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Também permitir POST para testes manuais
export async function POST(request: NextRequest) {
  return GET(request);
}