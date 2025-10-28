'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { checkUserSubscription, UserSubscription } from '@/lib/subscription'
import { redirectToPagSeguro, PAGSEGURO_PAYMENT_LINK } from '@/lib/stripe'
import { 
  Heart, 
  Book, 
  Music, 
  Circle, 
  Share2, 
  Star, 
  Play, 
  Pause, 
  User, 
  Settings, 
  Sun, 
  Moon,
  Plus,
  Check,
  Calendar,
  Crown,
  BookOpen,
  MessageCircle,
  Lock,
  CreditCard,
  X
} from 'lucide-react'

interface DevocionalData {
  dia: number
  devocional: {
    texto_biblico_ref: string
    texto_biblico_full: string
    reflexao: string
    oracao: string
  }
  versiculo: {
    referencia: string
    texto: string
  }
  hino: {
    titulo: string
    artista: string
    link_opcional: string
  }
  imagem_fundo: string
}

interface PedidoOracao {
  id?: number
  titulo: string
  descricao: string
  publico_boolean: boolean
  prioridade: 'baixa' | 'media' | 'alta'
  respondido_boolean: boolean
}

export default function MeuMomentoComDeus() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [darkMode, setDarkMode] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)
  const [currentDay, setCurrentDay] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null)
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false)
  const [devocionalData, setDevocionalData] = useState<DevocionalData | null>(null)
  const [pedidos, setPedidos] = useState<PedidoOracao[]>([])
  const [showPrayerModal, setShowPrayerModal] = useState(false)
  const [showAddPrayerModal, setShowAddPrayerModal] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [showPaymentPopup, setShowPaymentPopup] = useState(false)
  const [newPedido, setNewPedido] = useState<PedidoOracao>({
    titulo: '',
    descricao: '',
    publico_boolean: false,
    prioridade: 'media',
    respondido_boolean: false
  })
  const [fontSize, setFontSize] = useState('base')
  const [readDevocionais, setReadDevocionais] = useState<number[]>([])

  // Função para formatar data em português
  const formatDate = (date: Date) => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    
    const dayName = days[date.getDay()]
    const day = date.getDate()
    const month = months[date.getMonth()]
    
    return `${dayName}, ${day} de ${month}`
  }

  // Verificar se usuário tem acesso premium
  const hasAccess = () => {
    return userSubscription?.status === 'active'
  }

  // Dados mockados para demonstração
  const mockDevocionalData: DevocionalData = {
    dia: currentDay,
    devocional: {
      texto_biblico_ref: "Salmos 23:1",
      texto_biblico_full: "O Senhor é o meu pastor, nada me faltará.",
      reflexao: "Hoje, lembre-se de que Deus é seu pastor. Ele conhece suas necessidades e cuida de você com amor infinito. Confie em Sua provisão e orientação em cada passo do seu dia.",
      oracao: "Senhor, obrigado por ser meu pastor. Guia-me pelos caminhos da justiça e enche meu coração de paz. Que eu possa confiar em Ti em todos os momentos. Amém."
    },
    versiculo: {
      referencia: "Filipenses 4:13",
      texto: "Posso todas as coisas naquele que me fortalece."
    },
    hino: {
      titulo: "Grandioso És Tu",
      artista: "Tradicional",
      link_opcional: "https://youtu.be/dQw4w9WgXcQ"
    },
    imagem_fundo: "céu com luz suave"
  }

  useEffect(() => {
    setDevocionalData(mockDevocionalData)
    checkUser()
  }, [currentDay])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    
    if (user) {
      // Verificar assinatura do usuário
      const subscription = await checkUserSubscription(user.id)
      setUserSubscription(subscription)
    }
  }

  const handleSubscribe = async () => {
    setShowPaymentPopup(true)
  }

  const openPaymentLink = () => {
    window.open('https://pag.ae/81aj-zE2K', '_blank')
    setShowPaymentPopup(false)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const marcarComoLido = async () => {
    if (!readDevocionais.includes(currentDay)) {
      setReadDevocionais([...readDevocionais, currentDay])
      // Aqui salvaria no Supabase
    }
  }

  const adicionarPedido = async () => {
    if (newPedido.titulo && newPedido.descricao) {
      const novoPedido = { ...newPedido, id: Date.now() }
      setPedidos([...pedidos, novoPedido])
      setNewPedido({
        titulo: '',
        descricao: '',
        publico_boolean: false,
        prioridade: 'media',
        respondido_boolean: false
      })
      setShowAddPrayerModal(false)
    }
  }

  const compartilhar = async (tipo: string) => {
    const texto = `${devocionalData?.versiculo.texto} - ${devocionalData?.versiculo.referencia}`
    if (navigator.share) {
      await navigator.share({
        title: 'Meu Momento com Deus',
        text: texto,
        url: window.location.href
      })
    }
  }

  const PaymentPopup = () => {
    if (!showPaymentPopup) return null
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Finalizar Assinatura
            </h2>
            <button
              onClick={() => setShowPaymentPopup(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Premium - R$ 19,90/mês
            </h3>
            <p className="text-gray-600 mb-6">
              Você será redirecionado para o PagSeguro para finalizar sua assinatura de forma segura.
            </p>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-600">Devocionais exclusivos</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-600">Planos de leitura completos</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-600">Conteúdo sem anúncios</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setShowPaymentPopup(false)}
              className="flex-1 py-3 px-6 rounded-xl transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={openPaymentLink}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
            >
              Ir para PagSeguro
            </button>
          </div>
        </div>
      </div>
    )
  }

  const SubscriptionModal = () => {
    if (!showSubscriptionModal) return null
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Conteúdo Premium
            </h2>
            <p className="text-gray-600 mb-6">
              Para acessar este conteúdo, você precisa de uma assinatura Premium.
            </p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-600">Devocionais exclusivos</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-600">Planos de leitura completos</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-600">Conteúdo sem anúncios</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="flex-1 py-3 px-6 rounded-xl transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Fechar
            </button>
            <button
              onClick={() => {
                setShowSubscriptionModal(false)
                setCurrentView('premium')
              }}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
            >
              Assinar Agora
            </button>
          </div>
        </div>
      </div>
    )
  }

  const WelcomeModal = () => {
    if (!showWelcomeModal) return null
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Bem-vindo(a) ao Meu Momento com Deus
            </h2>
            <p className="leading-relaxed text-gray-600">
              Um espaço para fortalecer sua fé todos os dias.
            </p>
          </div>
          <button
            onClick={() => setShowWelcomeModal(false)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Começar Jornada
          </button>
        </div>
      </div>
    )
  }

  const Header = () => (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">
              Meu Momento com Deus
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {userSubscription?.status === 'active' && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm">
                <Crown className="w-4 h-4" />
                <span>Premium</span>
              </div>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100"
            >
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )

  const Dashboard = () => (
    <div className="bg-[#F9F5F0] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header com data */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold mb-2 text-[#2C3E50]">
            Bom dia! 🌅
          </h2>
          <p className="text-gray-600">
            {formatDate(new Date())}
          </p>
        </div>

        {/* Banner de Assinatura - Ícone Grande ESTÁTICO */}
        {!hasAccess() && (
          <div className="mb-8">
            <div 
              onClick={handleSubscribe}
              className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl p-8 shadow-2xl cursor-pointer transition-all duration-300 hover:shadow-3xl text-white text-center relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center backdrop-blur-sm">
                  <CreditCard className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl font-bold mb-4">
                  🔥 ASSINE AQUI 🔥
                </h2>
                <p className="text-xl mb-6 text-white/90">
                  Desbloqueie todo o conteúdo premium por apenas R$ 19,90/mês
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5" />
                    <span>Devocionais Exclusivos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5" />
                    <span>Sem Anúncios</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5" />
                    <span>Conteúdo Ilimitado</span>
                  </div>
                </div>
                <div className="mt-4 text-sm opacity-75">
                  👆 Clique aqui para assinar agora!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Layout em duas colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna Esquerda */}
          <div className="space-y-6">
            {/* Devocional do Dia */}
            <div 
              onClick={() => {
                if (!hasAccess()) {
                  setShowSubscriptionModal(true)
                } else {
                  setCurrentView('devocional')
                }
              }}
              className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-100 relative"
            >
              {!hasAccess() && (
                <div className="absolute top-4 right-4">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#2C3E50]">
                    Devocional do Dia
                  </h3>
                </div>
                {readDevocionais.includes(currentDay) && <Check className="w-6 h-6 text-green-500" />}
              </div>
              <p className="text-sm mb-4 text-gray-600 font-semibold">
                {devocionalData?.devocional.texto_biblico_ref}
              </p>
              <p className="text-gray-500 text-sm mb-4">
                "{hasAccess() ? devocionalData?.devocional.texto_biblico_full : 'Conteúdo disponível apenas para assinantes Premium...'}"
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Dia {currentDay} • 5 min de leitura
                </span>
                <button className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  hasAccess() 
                    ? 'bg-[#D4AF37] text-white hover:bg-[#B8941F]'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {hasAccess() ? 'Ler Agora' : 'Premium'}
                </button>
              </div>
            </div>

            {/* Plano de Leitura Bíblica */}
            <div 
              onClick={() => {
                if (!hasAccess()) {
                  setShowSubscriptionModal(true)
                } else {
                  setCurrentView('planos')
                }
              }}
              className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-100 relative"
            >
              {!hasAccess() && (
                <div className="absolute top-4 right-4">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
              )}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                  <Book className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#2C3E50]">
                  Plano de Leitura Bíblica
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {hasAccess() ? 'Gênesis 1-3 • Mateus 1-2' : 'Conteúdo Premium'}
              </p>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Progresso</span>
                  <span>{hasAccess() ? '25%' : '0%'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#D4AF37] h-2 rounded-full" style={{ width: hasAccess() ? '25%' : '0%' }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Bíblia em 1 ano
                </span>
                <button className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  hasAccess() 
                    ? 'bg-[#D4AF37] text-white hover:bg-[#B8941F]'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {hasAccess() ? 'Continuar' : 'Premium'}
                </button>
              </div>
            </div>
          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">
            {/* Versículo do Dia */}
            <div 
              onClick={() => setCurrentView('versiculo')}
              className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-100"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#2C3E50]">
                  Versículo do Dia
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4 italic">
                "{devocionalData?.versiculo.texto}"
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {devocionalData?.versiculo.referencia}
                </span>
                <button className="bg-[#D4AF37] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#B8941F] transition-colors">
                  Compartilhar
                </button>
              </div>
            </div>

            {/* Pedidos de Oração */}
            <div 
              onClick={() => {
                if (!hasAccess()) {
                  setShowSubscriptionModal(true)
                } else {
                  setCurrentView('oracao')
                }
              }}
              className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-100 relative"
            >
              {!hasAccess() && (
                <div className="absolute top-4 right-4">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
              )}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                  <Circle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#2C3E50]">
                  Pedidos de Oração
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {hasAccess() ? `${pedidos.length} pedidos ativos` : 'Funcionalidade Premium'}
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">{hasAccess() ? 'Saúde da família' : 'Conteúdo Premium'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">{hasAccess() ? 'Trabalho' : 'Conteúdo Premium'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">{hasAccess() ? 'Relacionamentos' : 'Conteúdo Premium'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {hasAccess() ? 'Compartilhe suas necessidades' : 'Apenas para Premium'}
                </span>
                <button className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  hasAccess() 
                    ? 'bg-[#D4AF37] text-white hover:bg-[#B8941F]'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {hasAccess() ? 'Adicionar' : 'Premium'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cards adicionais em linha */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {/* Músicas/Hinos */}
          <div 
            onClick={() => {
              if (!hasAccess()) {
                setShowSubscriptionModal(true)
              } else {
                setCurrentView('musicas')
              }
            }}
            className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-100 relative"
          >
            {!hasAccess() && (
              <div className="absolute top-4 right-4">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (hasAccess()) {
                    setIsPlaying(!isPlaying)
                  }
                }}
                className={`p-2 rounded-full transition-colors ${
                  hasAccess() 
                    ? 'bg-[#D4AF37] text-white hover:bg-[#B8941F]'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
            <h3 className="text-lg font-serif font-bold text-[#2C3E50] mb-2">
              Hino do Dia
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {hasAccess() ? devocionalData?.hino.titulo : 'Conteúdo Premium'}
            </p>
            <p className="text-xs text-gray-400">
              {hasAccess() ? devocionalData?.hino.artista : 'Apenas para assinantes'}
            </p>
          </div>

          {/* Assinatura Premium */}
          <div 
            onClick={handleSubscribe}
            className="bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl text-white hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <Crown className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-serif font-bold mb-2">
              {hasAccess() ? 'Premium Ativo' : 'Premium'}
            </h3>
            <p className="text-sm mb-2 text-yellow-100">
              {hasAccess() ? 'Obrigado por ser Premium!' : 'Desbloqueie conteúdo exclusivo'}
            </p>
            <p className="text-xs text-yellow-200">
              {hasAccess() ? 'Renovação automática' : 'R$ 19,90/mês'}
            </p>
          </div>

          {/* Estatísticas */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#2C3E50]">
                Progresso
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sequência</span>
                <span className="text-sm font-semibold text-[#2C3E50]">{hasAccess() ? '7 dias' : '0 dias'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Devocionais</span>
                <span className="text-sm font-semibold text-[#2C3E50]">{hasAccess() ? readDevocionais.length : 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Orações</span>
                <span className="text-sm font-semibold text-[#2C3E50]">{hasAccess() ? pedidos.length : 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const DevocionalView = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="mb-4 flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <span>← Voltar</span>
        </button>
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Devocional do Dia — Dia {currentDay}
        </h1>
        <p className="text-gray-600">
          {formatDate(new Date())}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        {/* Texto Bíblico */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Texto Bíblico
          </h2>
          <div className="rounded-xl p-6 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50">
            <p className="italic mb-2 text-lg text-gray-700">
              "{devocionalData?.devocional.texto_biblico_full}"
            </p>
            <p className="text-sm font-semibold text-blue-600">
              {devocionalData?.devocional.texto_biblico_ref}
            </p>
          </div>
        </div>

        {/* Reflexão */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Reflexão
          </h2>
          <p className="leading-relaxed text-base text-gray-600">
            {devocionalData?.devocional.reflexao}
          </p>
        </div>

        {/* Oração */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Oração
          </h2>
          <div className="rounded-xl p-6 border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50">
            <p className="italic text-base text-gray-700">
              {devocionalData?.devocional.oracao}
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setShowPrayerModal(true)}
            className="flex items-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-xl hover:bg-purple-600 transition-colors"
          >
            <Circle className="w-5 h-5" />
            <span>Rezar Agora</span>
          </button>
          
          <button
            onClick={marcarComoLido}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-colors ${
              readDevocionais.includes(currentDay)
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Check className="w-5 h-5" />
            <span>{readDevocionais.includes(currentDay) ? 'Lido' : 'Marcar como Lido'}</span>
          </button>

          <button
            onClick={() => compartilhar('devocional')}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            <Share2 className="w-5 h-5" />
            <span>Compartilhar</span>
          </button>

          <button
            className="flex items-center space-x-2 px-6 py-3 rounded-xl transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            <Star className="w-5 h-5" />
            <span>Favoritar</span>
          </button>
        </div>
      </div>
    </div>
  )

  const PremiumView = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="mb-4 flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <span>← Voltar</span>
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Crown className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Premium
        </h1>
        <p className="text-xl mb-8 text-gray-600">
          {hasAccess() 
            ? 'Obrigado por ser um assinante Premium!' 
            : 'Assine Premium e continue seu crescimento espiritual sem interrupções.'
          }
        </p>
      </div>

      {hasAccess() ? (
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            Assinatura Ativa
          </h3>
          <p className="text-gray-600 mb-6">
            Sua assinatura Premium está ativa e você tem acesso a todo o conteúdo exclusivo.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Status: <span className="text-green-600 font-semibold">Ativo</span></p>
            <p>Próxima cobrança: {new Date(userSubscription?.current_period_end || '').toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                Benefícios Premium
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Devocionais exclusivos</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Planos de leitura completos</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Playlists especiais</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Sem anúncios</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Suporte prioritário</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                Planos
              </h3>
              <div className="space-y-4">
                <div className="border-2 border-orange-500 rounded-xl p-6 bg-gradient-to-r from-orange-50 to-yellow-50">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-semibold text-gray-800">Mensal</h4>
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">Popular</span>
                  </div>
                  <p className="text-3xl font-bold mb-2 text-gray-800">R$ 19,90</p>
                  <p className="mb-4 text-gray-600">por mês</p>
                </div>
                
                <div className="border rounded-xl p-6 border-gray-200 bg-gray-50">
                  <h4 className="text-xl font-semibold mb-4 text-gray-800">Anual</h4>
                  <p className="text-3xl font-bold mb-2 text-gray-800">R$ 199,90</p>
                  <p className="mb-2 text-gray-600">por ano</p>
                  <p className="text-green-500 text-sm">Economize 2 meses!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleSubscribe}
              disabled={isLoadingSubscription}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Crown className="w-6 h-6" />
              <span>{isLoadingSubscription ? 'Abrindo PagSeguro...' : 'Assinar Agora'}</span>
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Pagamento seguro via PagSeguro • Cancele a qualquer momento
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Link de pagamento: {PAGSEGURO_PAYMENT_LINK}
            </p>
          </div>
        </>
      )}
    </div>
  )

  const PrayerModal = () => {
    if (!showPrayerModal) return null
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Momento de Oração
          </h3>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Circle className="w-8 h-8 text-white" />
            </div>
            <p className="italic text-gray-600">
              "{devocionalData?.devocional.oracao}"
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowPrayerModal(false)}
              className="flex-1 py-3 px-6 rounded-xl transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Fechar
            </button>
            <button
              onClick={() => {
                marcarComoLido()
                setShowPrayerModal(false)
              }}
              className="flex-1 bg-purple-500 text-white py-3 px-6 rounded-xl hover:bg-purple-600 transition-colors"
            >
              Amém
            </button>
          </div>
        </div>
      </div>
    )
  }

  const Footer = () => (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4 text-gray-800">
              Meu Momento com Deus
            </h3>
            <p className="text-sm text-gray-600">
              Um espaço para fortalecer sua fé todos os dias.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">
              Links Rápidos
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => setCurrentView('profile')}
                  className="transition-colors text-gray-600 hover:text-gray-800"
                >
                  Configurações
                </button>
              </li>
              <li>
                <span className="text-gray-600">FAQ</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">
              Contato
            </h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                WhatsApp: (37) 99836-7198
              </p>
              <p className="text-gray-600">
                Email: luisbelezapf@icloud.com
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2024 Meu Momento com Deus. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )

  const BottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around py-2">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center py-2 px-4 ${
            currentView === 'dashboard' 
              ? 'text-blue-500' 
              : 'text-gray-600'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-xs mt-1">Início</span>
        </button>
        <button
          onClick={() => {
            if (!hasAccess()) {
              setShowSubscriptionModal(true)
            } else {
              setCurrentView('devocional')
            }
          }}
          className={`flex flex-col items-center py-2 px-4 ${
            currentView === 'devocional' 
              ? 'text-blue-500' 
              : 'text-gray-600'
          }`}
        >
          <Book className="w-5 h-5" />
          <span className="text-xs mt-1">Devocional</span>
        </button>
        <button
          onClick={() => {
            if (!hasAccess()) {
              setShowSubscriptionModal(true)
            } else {
              setCurrentView('oracao')
            }
          }}
          className={`flex flex-col items-center py-2 px-4 ${
            currentView === 'oracao' 
              ? 'text-blue-500' 
              : 'text-gray-600'
          }`}
        >
          <Circle className="w-5 h-5" />
          <span className="text-xs mt-1">Oração</span>
        </button>
        <button
          onClick={() => {
            if (!hasAccess()) {
              setShowSubscriptionModal(true)
            } else {
              setCurrentView('musicas')
            }
          }}
          className={`flex flex-col items-center py-2 px-4 ${
            currentView === 'musicas' 
              ? 'text-blue-500' 
              : 'text-gray-600'
          }`}
        >
          <Music className="w-5 h-5" />
          <span className="text-xs mt-1">Música</span>
        </button>
        <button
          onClick={() => setCurrentView('profile')}
          className={`flex flex-col items-center py-2 px-4 ${
            currentView === 'profile' 
              ? 'text-blue-500' 
              : 'text-gray-600'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-xs mt-1">Perfil</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="pb-20 md:pb-8">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'devocional' && <DevocionalView />}
        {currentView === 'premium' && <PremiumView />}
        {currentView === 'profile' && (
          <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">
              Perfil & Configurações
            </h1>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="space-y-6">
                {hasAccess() && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <Crown className="w-6 h-6 text-yellow-600" />
                      <div>
                        <h4 className="font-semibold text-yellow-800">Assinatura Premium Ativa</h4>
                        <p className="text-sm text-yellow-600">
                          Renovação em: {new Date(userSubscription?.current_period_end || '').toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Tamanho da Fonte
                  </label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full p-3 rounded-lg border bg-white border-gray-300"
                  >
                    <option value="small">Pequena</option>
                    <option value="base">Normal</option>
                    <option value="large">Grande</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Modo Escuro</span>
                  <button
                    onClick={toggleDarkMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      darkMode ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Estatísticas
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-gray-50">
                      <p className="text-2xl font-bold text-gray-800">
                        {hasAccess() ? readDevocionais.length : 0}
                      </p>
                      <p className="text-sm text-gray-600">
                        Devocionais Lidos
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50">
                      <p className="text-2xl font-bold text-gray-800">
                        {hasAccess() ? pedidos.length : 0}
                      </p>
                      <p className="text-sm text-gray-600">
                        Pedidos de Oração
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <BottomNavigation />
      <WelcomeModal />
      <PrayerModal />
      <SubscriptionModal />
      <PaymentPopup />
    </div>
  )
}