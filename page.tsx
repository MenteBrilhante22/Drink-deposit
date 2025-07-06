"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Search,
  MapPin,
  Clock,
  Star,
  MessageCircle,
  Instagram,
  Facebook,
  Info,
  Share,
  Menu,
  X,
  Copy,
  Check,
} from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AdminPanel from "@/components/admin-panel"
import PromotionsPage from "@/components/promotions-page"
import CategoriesPage from "@/components/categories-page"

interface Bebida {
  id: string
  nome: string
  preco: number
  imagem: string
  categoria?: string
  precoOriginal?: number
  desconto?: number
  observacao?: string
  categoriaFiltro?: string
}

interface ItemCarrinho {
  id: string
  bebida: Bebida
  quantidade: number
}

interface DadosCliente {
  nome: string
  rua: string
  numero: string
  bairro: string
  cidade: string
  telefone: string
  pagamento: string
}

const categoriesMenu = [
  { name: "PROMOÇÕES", active: true, filtro: "promocoes" },
  { name: "Gelo de Coco ❄️", active: false, filtro: "gelo" },
  { name: "Cigarros & Isqueiro & Sedas", active: false, filtro: "cigarros" },
  { name: "Preservativos", active: false, filtro: "preservativos" },
  { name: "Cerveja 600ml RETORNAVEL", active: false, filtro: "cerveja" },
  { name: "Caixa GELADA", active: false, filtro: "caixa" },
]

const configMenu = [{ name: "Configurações", icon: "⚙️", hasSubmenu: true }]

export default function HomePage() {
  const [bebidas, setBebidas] = useState<Bebida[]>([])
  const [bebidasFiltradas, setBebidasFiltradas] = useState<Bebida[]>([])
  const [activeCategory, setActiveCategory] = useState("PROMOÇÕES")
  const [currentPage, setCurrentPage] = useState("home")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [loginForm, setLoginForm] = useState({ usuario: "", senha: "" })
  const [showConfigSubmenu, setShowConfigSubmenu] = useState(false)

  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([])
  const [showProductModal, setShowProductModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Bebida | null>(null)
  const [showCartModal, setShowCartModal] = useState(false)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [dadosCliente, setDadosCliente] = useState<DadosCliente>({
    nome: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    telefone: "",
    pagamento: "",
  })

  const [notificacoesPendentes, setNotificacoesPendentes] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  const [horariosFuncionamento, setHorariosFuncionamento] = useState({
    segunda: { ativo: true, abertura: "08:00", fechamento: "22:00" },
    terca: { ativo: true, abertura: "08:00", fechamento: "22:00" },
    quarta: { ativo: true, abertura: "08:00", fechamento: "22:00" },
    quinta: { ativo: true, abertura: "08:00", fechamento: "22:00" },
    sexta: { ativo: true, abertura: "08:00", fechamento: "22:00" },
    sabado: { ativo: true, abertura: "08:00", fechamento: "22:00" },
    domingo: { ativo: true, abertura: "08:00", fechamento: "18:00" },
  })

  // Carregar configurações bancárias
  const [configBancarias, setConfigBancarias] = useState({
    nomeBanco: "",
    agencia: "",
    conta: "",
    tipoConta: "",
    chavePix: "",
    qrCodePix: "",
    nomeCompleto: "",
    cpfCnpj: "",
  })

  const [showPixPayment, setShowPixPayment] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [pixKeyCopied, setPixKeyCopied] = useState(false)

  useEffect(() => {
    // Carregar configurações bancárias
    const configSalvas = localStorage.getItem("configBancarias")
    if (configSalvas) {
      setConfigBancarias(JSON.parse(configSalvas))
    }

    // Carregar horários de funcionamento
    const horariosSalvos = localStorage.getItem("horariosFuncionamento")
    if (horariosSalvos) {
      setHorariosFuncionamento(JSON.parse(horariosSalvos))
    }
  }, [])

  useEffect(() => {
    // Verifica se já está autenticado no sessionStorage
    const loggedIn = sessionStorage.getItem("logadoAdmin") === "true"
    setIsAuthenticated(loggedIn)
  }, [])

  useEffect(() => {
    const bebidasSalvas = localStorage.getItem("bebidas")
    if (bebidasSalvas) {
      const bebidasCarregadas = JSON.parse(bebidasSalvas)
      setBebidas(bebidasCarregadas)
      setBebidasFiltradas(bebidasCarregadas)
    } else {
      // Dados iniciais de exemplo com categorias de filtro
      const bebidasIniciais = [
        {
          id: "1",
          nome: "Beats GT 269ml - LATA",
          preco: 6.0,
          precoOriginal: 7.0,
          desconto: 14,
          imagem: "/placeholder.svg?height=120&width=120",
          categoria: "Energéticos",
          categoriaFiltro: "promocoes",
        },
        {
          id: "2",
          nome: "Beats SENSES 269ml - LATA",
          preco: 6.0,
          precoOriginal: 7.0,
          desconto: 14,
          imagem: "/placeholder.svg?height=120&width=120",
          categoria: "Energéticos",
          categoriaFiltro: "promocoes",
        },
        {
          id: "3",
          nome: "Gelo de Coco Premium 2kg",
          preco: 8.0,
          imagem: "/placeholder.svg?height=120&width=120",
          categoria: "Gelo",
          categoriaFiltro: "gelo",
        },
        {
          id: "4",
          nome: "Gelo de Coco Tradicional 1kg",
          preco: 5.0,
          imagem: "/placeholder.svg?height=120&width=120",
          categoria: "Gelo",
          categoriaFiltro: "gelo",
        },
        {
          id: "5",
          nome: "Marlboro Red",
          preco: 12.0,
          imagem: "/placeholder.svg?height=120&width=120",
          categoria: "Cigarros",
          categoriaFiltro: "cigarros",
        },
        {
          id: "6",
          nome: "Isqueiro BIC",
          preco: 3.5,
          imagem: "/placeholder.svg?height=120&width=120",
          categoria: "Acessórios",
          categoriaFiltro: "cigarros",
        },
        {
          id: "7",
          nome: "Seda OCB",
          preco: 2.0,
          imagem: "/placeholder.svg?height=120&width=120",
          categoria: "Acessórios",
          categoriaFiltro: "cigarros",
        },
        {
          id: "8",
          nome: "Preservativo Jontex",
          preco: 4.5,
          imagem: "/placeholder.svg?height=120&width=120",
          categoria: "Preservativos",
          categoriaFiltro: "preservativos",
        },
        {
          id: "9",
          nome: "Preservativo Prudence",
          preco: 5.0,
          imagem: "/placeholder.svg?height=120&width=120",
          categoria: "Preservativos",
          categoriaFiltro: "preservativos",
        },
        {
          id: "10",
          nome: "Cerveja Skol 600ml Retornável",
          preco: 4.5,
          imagem: "/placeholder.svg?height=120&width=120",
          categoria: "Cervejas",
          categoriaFiltro: "cerveja",
        },
        {
          id: "11",
          nome: "Cerveja Brahma 600ml Retornável",
          preco: 4.5,
          imagem: "/placeholder.svg?height=120&width=120",
          categoria: "Cervejas",
          categoriaFiltro: "cerveja",
        },
        {
          id: "12",
          nome: "Caixa Térmica 12L",
          preco: 35.0,
          imagem: "/placeholder.svg?height=120&width=120",
          categoria: "Acessórios",
          categoriaFiltro: "caixa",
        },
        {
          id: "13",
          nome: "Caixa Térmica 24L",
          preco: 55.0,
          imagem: "/placeholder.svg?height=120&width=120",
          categoria: "Acessórios",
          categoriaFiltro: "caixa",
        },
      ]
      setBebidas(bebidasIniciais)
      setBebidasFiltradas(bebidasIniciais.filter((b) => b.categoriaFiltro === "promocoes"))
      localStorage.setItem("bebidas", JSON.stringify(bebidasIniciais))
    }
  }, [])

  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem("carrinho")
    if (carrinhoSalvo) {
      setCarrinho(JSON.parse(carrinhoSalvo))
    }
  }, [])

  // Verificar notificações de entrega
  useEffect(() => {
    const verificarNotificacoes = () => {
      const pedidosDetalhados = JSON.parse(localStorage.getItem("pedidosDetalhados") || "[]")
      const notificacoes = pedidosDetalhados.filter((pedido: any) => pedido.entregue && !pedido.confirmadoPeloCliente)
      setNotificacoesPendentes(notificacoes)
    }

    verificarNotificacoes()

    // Verificar a cada 5 segundos se há novas notificações
    const interval = setInterval(verificarNotificacoes, 5000)

    return () => clearInterval(interval)
  }, [])

  const updateBebidas = (novasBebidas: Bebida[]) => {
    setBebidas(novasBebidas)
    localStorage.setItem("bebidas", JSON.stringify(novasBebidas))
    // Reaplica o filtro atual
    filtrarCategoria(activeCategory)
  }

  const salvarCarrinho = (novoCarrinho: ItemCarrinho[]) => {
    setCarrinho(novoCarrinho)
    localStorage.setItem("carrinho", JSON.stringify(novoCarrinho))
  }

  const adicionarAoCarrinho = (bebida: Bebida) => {
    const itemExistente = carrinho.find((item) => item.id === bebida.id)

    if (itemExistente) {
      const novoCarrinho = carrinho.map((item) =>
        item.id === bebida.id ? { ...item, quantidade: item.quantidade + 1 } : item,
      )
      salvarCarrinho(novoCarrinho)
    } else {
      const novoItem: ItemCarrinho = {
        id: bebida.id,
        bebida,
        quantidade: 1,
      }
      salvarCarrinho([...carrinho, novoItem])
    }

    setShowProductModal(false)
  }

  const removerDoCarrinho = (id: string) => {
    const novoCarrinho = carrinho.filter((item) => item.id !== id)
    salvarCarrinho(novoCarrinho)
  }

  const atualizarQuantidade = (id: string, quantidade: number) => {
    if (quantidade <= 0) {
      removerDoCarrinho(id)
      return
    }

    const novoCarrinho = carrinho.map((item) => (item.id === id ? { ...item, quantidade } : item))
    salvarCarrinho(novoCarrinho)
  }

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + item.bebida.preco * item.quantidade, 0)
  }

  const finalizarPedido = async () => {
    if (
      !dadosCliente.nome ||
      !dadosCliente.rua ||
      !dadosCliente.numero ||
      !dadosCliente.bairro ||
      !dadosCliente.cidade ||
      !dadosCliente.pagamento
    ) {
      alert("Por favor, preencha todos os campos obrigatórios, incluindo a forma de pagamento.")
      return
    }

    // Mostrar carregamento
    setIsProcessingPayment(true)

    // Simular processamento (2 segundos)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Sempre mostrar a tela de pagamento PIX após finalizar o pedido
    setIsProcessingPayment(false)
    setShowPixPayment(true)
  }

  const processarPedido = () => {
    const enderecoCompleto = `${dadosCliente.rua}, ${dadosCliente.numero} - ${dadosCliente.bairro}, ${dadosCliente.cidade}`

    // Criar pedido detalhado para o localStorage
    const pedidoDetalhado = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      nomeCliente: dadosCliente.nome,
      endereco: enderecoCompleto,
      telefone: dadosCliente.telefone,
      bebidas: carrinho.map((item) => ({
        nome: item.bebida.nome,
        preco: item.bebida.preco,
        quantidade: item.quantidade,
      })),
      pagamento: dadosCliente.pagamento,
      total: calcularTotal(),
      dataHora: new Date().toISOString(),
      status: "pendente",
    }

    // Criar pedido para cada item do carrinho (formato antigo para compatibilidade)
    const pedidosExistentes = JSON.parse(localStorage.getItem("pedidos") || "[]")
    const novosPedidos = carrinho.map((item) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      bebidaNome: `${item.bebida.nome} (${item.quantidade}x)`,
      endereco: `${enderecoCompleto} - Cliente: ${dadosCliente.nome} - Tel: ${dadosCliente.telefone} - Pagamento: ${dadosCliente.pagamento}`,
      dataHora: new Date().toISOString(),
      status: "pendente",
    }))

    localStorage.setItem("pedidos", JSON.stringify([...pedidosExistentes, ...novosPedidos]))

    // Salvar pedido detalhado separadamente
    const pedidosDetalhados = JSON.parse(localStorage.getItem("pedidosDetalhados") || "[]")
    localStorage.setItem("pedidosDetalhados", JSON.stringify([...pedidosDetalhados, pedidoDetalhado]))

    // Limpar carrinho e formulário
    salvarCarrinho([])
    setDadosCliente({ nome: "", rua: "", numero: "", bairro: "", cidade: "", telefone: "", pagamento: "" })
    setShowCheckoutForm(false)
    setShowCartModal(false)
    setShowPixPayment(false)

    alert("Pedido realizado com sucesso! Entraremos em contato em breve.")
  }

  const copiarChavePix = async () => {
    try {
      await navigator.clipboard.writeText(configBancarias.chavePix)
      setPixKeyCopied(true)

      // Resetar o estado após 3 segundos
      setTimeout(() => {
        setPixKeyCopied(false)
      }, 3000)
    } catch (err) {
      // Fallback para navegadores mais antigos
      const textArea = document.createElement("textarea")
      textArea.value = configBancarias.chavePix
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)

      setPixKeyCopied(true)
      setTimeout(() => {
        setPixKeyCopied(false)
      }, 3000)
    }
  }

  const confirmarEntrega = (pedidoId: string) => {
    const pedidosDetalhados = JSON.parse(localStorage.getItem("pedidosDetalhados") || "[]")
    const pedidosAtualizados = pedidosDetalhados.map((pedido: any) =>
      pedido.id === pedidoId ? { ...pedido, confirmadoPeloCliente: true } : pedido,
    )

    localStorage.setItem("pedidosDetalhados", JSON.stringify(pedidosAtualizados))

    // Atualizar notificações
    setNotificacoesPendentes((prev) => prev.filter((p) => p.id !== pedidoId))
    setShowNotifications(false)
  }

  const handleProductClick = (bebida: Bebida) => {
    setSelectedProduct(bebida)
    setShowProductModal(true)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (loginForm.usuario === "bardoleo3455" && loginForm.senha === "4627leo") {
      sessionStorage.setItem("logadoAdmin", "true")
      setIsAuthenticated(true)
      setShowLoginForm(false)
      setLoginError("")
      setLoginForm({ usuario: "", senha: "" })
      setCurrentPage("admin")
    } else {
      setLoginError("Usuário ou senha incorretos.")
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("logadoAdmin")
    setIsAuthenticated(false)
    setCurrentPage("home")
  }

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setCurrentPage("admin")
    } else {
      setShowLoginForm(true)
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
    setShowConfigSubmenu(false)
  }

  const filtrarCategoria = (categoria: string) => {
    setActiveCategory(categoria)
    setBebidasFiltradas(bebidas.filter((b) => b.categoriaFiltro === categoria.toLowerCase()))
  }

  const renderContent = () => {
    if (currentPage === "admin" && !isAuthenticated) {
      setCurrentPage("home")
      return renderHomePage()
    }

    switch (currentPage) {
      case "admin":
        return (
          <>
            <AdminPanel bebidas={bebidas} updateBebidas={updateBebidas} onLogout={handleLogout} />
            <Button onClick={handleLogout}>Logout</Button>
          </>
        )
      case "promotions":
        return <PromotionsPage bebidas={bebidas} />
      case "categories":
        return <CategoriesPage bebidas={bebidas} />
      default:
        return renderHomePage()
    }
  }

  const renderHomePage = () => (
    <div className="min-h-screen bg-white">
      {/* Header com Banner */}
      <div className="relative">
        {/* Banner de Fundo */}
        <div className="h-40 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="w-full h-full bg-gradient-to-r from-red-900/20 via-transparent to-red-900/20"></div>
          </div>

          {/* Garrafas Decorativas Animadas */}
          <div className="garrafas-decorativas">
            <div className="garrafa-decorativa">
              <img src="/placeholder.svg?height=80&width=30" alt="Garrafa" className="w-8 h-20" />
            </div>
            <div className="garrafa-decorativa">
              <img src="/placeholder.svg?height=80&width=30" alt="Garrafa" className="w-8 h-20" />
            </div>
            <div className="garrafa-decorativa">
              <img src="/placeholder.svg?height=80&width=30" alt="Garrafa" className="w-8 h-20" />
            </div>
            <div className="garrafa-decorativa">
              <img src="/placeholder.svg?height=80&width=30" alt="Garrafa" className="w-8 h-20" />
            </div>
          </div>

          {/* Elementos decorativos existentes */}
          <div className="absolute top-4 left-8 w-8 h-8 bg-yellow-500 transform rotate-45"></div>
          <div className="absolute top-8 right-12 w-6 h-6 bg-yellow-500 transform rotate-45"></div>
          <div className="absolute bottom-6 left-16 w-4 h-4 bg-yellow-500 transform rotate-45"></div>
          <div className="absolute bottom-4 right-8 w-8 h-8 bg-yellow-500 transform rotate-45"></div>

          {/* Título BAR DO LÉO */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="texto-centralizado">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 tracking-wider">
                ◆ BAR DO LÉO ◆
              </h1>
              <p className="text-white text-base md:text-lg mt-2 tracking-widest">DEPÓSITO DE BEBIDAS</p>
            </div>
          </div>

          {/* Status Fechado */}
          <div className="absolute top-4 right-4">
            <div className="bg-white/95 backdrop-blur rounded-full px-3 py-1 flex items-center gap-2 shadow-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Fechado</span>
            </div>
          </div>
        </div>

        {/* Logo e Informações */}
        <div className="container-centralizado relative -mt-16">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 justify-center">
            {/* Logo Circular */}
            <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg border-4 border-white relative flex-shrink-0">
              <div className="absolute inset-2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-2xl icone-bebida-animado">🍺</span>
              </div>
            </div>

            {/* Informações da Empresa */}
            <div className="flex-1 bg-white rounded-lg shadow-lg p-4 mt-0 md:mt-8 w-full max-w-4xl">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-2">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">Bar do Léo Depósito de Bebidas</h1>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" className="w-6 h-6 text-gray-400">
                        <Info className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="w-6 h-6 text-gray-400">
                        <Share className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>20 - 60min.</span>
                    </div>
                    <button className="flex items-center gap-1 text-blue-600 hover:underline">
                      <MapPin className="w-4 h-4" />
                      <span>Ver mapa</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center md:justify-start gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">4.6</span>
                  </div>
                </div>

                {/* Redes Sociais */}
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" className="w-8 h-8 rounded-full bg-transparent">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                  </Button>
                  <Button size="icon" variant="outline" className="w-8 h-8 rounded-full bg-transparent">
                    <Instagram className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="w-8 h-8 rounded-full bg-transparent">
                    <Facebook className="w-4 h-4 text-blue-600" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Categorias */}
      <div className="container-centralizado py-4">
        <div className="flex items-center gap-2 justify-center">
          <Button size="icon" variant="outline" className="flex-shrink-0 bg-transparent">
            <Search className="w-4 h-4" />
          </Button>
          <div className="flex-1 overflow-x-auto max-w-4xl">
            <nav className="categorias-menu">
              <div className="flex gap-1 min-w-max justify-center">
                {categoriesMenu.map((category, index) => (
                  <Button
                    key={index}
                    variant={activeCategory === category.name ? "default" : "outline"}
                    size="sm"
                    className={`whitespace-nowrap cursor-pointer transition-all duration-200 ${
                      activeCategory === category.name
                        ? "bg-red-600 hover:bg-red-700 text-white categoria-ativa"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => filtrarCategoria(category.name)}
                    data-categoria={category.filtro}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Seção de Produtos */}
      <div className="secao-centralizada">
        <div className="container-centralizado">
          <h2 className="text-xl font-bold text-gray-900 mb-6 texto-centralizado">
            {activeCategory === "PROMOÇÕES" ? "PROMOÇÕES" : activeCategory}
          </h2>

          {bebidasFiltradas.length === 0 ? (
            <div className="altura-minima-responsiva py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-600">Não há produtos disponíveis na categoria "{activeCategory}" no momento.</p>
            </div>
          ) : (
            <div className="grid-responsivo grid-produtos">
              {bebidasFiltradas.map((bebida) => (
                <Card
                  key={bebida.id}
                  className="hover:shadow-md transition-shadow cursor-pointer produto card-centralizado produto-card-3d"
                  data-categoria={bebida.categoriaFiltro}
                  onClick={() => handleProductClick(bebida)}
                >
                  <CardContent className="p-4 flex flex-col h-full">
                    <div className="flex flex-col items-center text-center flex-grow">
                      {/* Imagem do Produto */}
                      <div className="w-20 h-20 flex-shrink-0 mb-4">
                        <Image
                          src={bebida.imagem || "/placeholder.svg"}
                          alt={bebida.nome}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover rounded garrafa-animada"
                        />
                      </div>

                      {/* Informações do Produto */}
                      <div className="flex-grow flex flex-col justify-between w-full">
                        <div>
                          <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                            {bebida.nome}
                          </h3>

                          {bebida.observacao && (
                            <p className="text-xs text-gray-500 mb-3 uppercase bg-orange-50 px-2 py-1 rounded">
                              {bebida.observacao}
                            </p>
                          )}
                        </div>

                        <div className="mt-auto">
                          <div className="flex flex-col items-center gap-2">
                            <span className="font-bold text-lg text-green-600">
                              R$ {bebida.preco.toFixed(2).replace(".", ",")}
                            </span>

                            {bebida.precoOriginal && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 line-through">
                                  R$ {bebida.precoOriginal.toFixed(2).replace(".", ",")}
                                </span>
                                {bebida.desconto && (
                                  <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                                    -{bebida.desconto}%
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const handleConfigClick = () => {
    setShowConfigSubmenu(!showConfigSubmenu)
  }

  const handleAdminClickFromSidebar = () => {
    if (isAuthenticated) {
      setCurrentPage("admin")
      setSidebarOpen(false)
    } else {
      setShowLoginForm(true)
      setSidebarOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Menu Hambúrguer Fixo */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          id="menu-hamburguer"
        >
          {sidebarOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
        </button>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" onClick={closeSidebar}></div>
      )}

      {/* Sidebar Lateral */}
      <nav
        id="sidebar-categorias"
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Header do Sidebar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                <span className="text-lg">🍺</span>
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Bar do Léo</h2>
                <p className="text-xs text-gray-600">CATEGORIAS</p>
              </div>
            </div>
            <button
              onClick={closeSidebar}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Lista de Categorias */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Filtrar por Categoria</h3>
            <ul className="space-y-1">
              {categoriesMenu.map((category, index) => (
                <li key={index}>
                  <button
                    onClick={() => filtrarCategoria(category.name)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                      activeCategory === category.name
                        ? "bg-red-50 text-red-600 border-l-4 border-red-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    data-categoria={category.filtro}
                  >
                    <span className="text-lg">
                      {category.name.includes("❄️") && "❄️"}
                      {category.name.includes("Cigarros") && "🚬"}
                      {category.name.includes("Preservativos") && "🛡️"}
                      {category.name.includes("Cerveja") && "🍺"}
                      {category.name.includes("Caixa") && "📦"}
                      {category.name.includes("PROMOÇÕES") && "🏷️"}
                    </span>
                    <span className="font-medium">{category.name.replace(/[❄️🚬🛡️🍺📦🏷️]/g, "").trim()}</span>
                    {activeCategory === category.name && (
                      <span className="ml-auto text-red-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Seção de Configurações */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Sistema</h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={handleConfigClick}
                  className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 text-gray-700 hover:bg-gray-50"
                >
                  <span className="text-lg">⚙️</span>
                  <span className="font-medium">Configurações</span>
                  <span
                    className={`ml-auto transition-transform duration-200 ${showConfigSubmenu ? "rotate-180" : ""}`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </button>

                {/* Submenu de Configurações */}
                {showConfigSubmenu && (
                  <div className="ml-4 mt-2 space-y-1">
                    <button
                      onClick={handleAdminClickFromSidebar}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                        currentPage === "admin" && isAuthenticated
                          ? "bg-red-50 text-red-600 border-l-4 border-red-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-lg">🛠️</span>
                      <span className="font-medium">Admin</span>
                      {isAuthenticated && (
                        <span className="ml-auto text-green-600">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </div>

          {/* Informações Adicionais */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Horário de Funcionamento</h4>
              <div className="text-sm text-gray-600 space-y-1">
                {Object.entries(horariosFuncionamento).map(([dia, config]) => {
                  const nomesDias = {
                    segunda: "Seg",
                    terca: "Ter",
                    quarta: "Qua",
                    quinta: "Qui",
                    sexta: "Sex",
                    sabado: "Sáb",
                    domingo: "Dom",
                  }

                  if (!config.ativo) return null

                  return (
                    <div key={dia} className="flex justify-between">
                      <span>{nomesDias[dia as keyof typeof nomesDias]}:</span>
                      <span className="font-medium">
                        {config.abertura} às {config.fechamento}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="mt-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Faça seu Pedido</h4>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                📱 WhatsApp: (11) 99999-9999
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Barra de Menu Fixa */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-30 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 ml-16">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                <span className="text-lg">🍺</span>
              </div>
              <div>
                <span className="font-bold text-gray-900">Bar do Léo</span>
                <p className="text-xs text-gray-600">DEPÓSITO DE BEBIDAS</p>
              </div>
            </div>

            {/* Menu de Navegação */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setCurrentPage("home")}
                className={`text-sm font-medium transition-colors hover:text-red-600 ${
                  currentPage === "home" ? "text-red-600 border-b-2 border-red-600 pb-1" : "text-gray-700"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage("promotions")}
                className={`text-sm font-medium transition-colors hover:text-red-600 ${
                  currentPage === "promotions" ? "text-red-600 border-b-2 border-red-600 pb-1" : "text-gray-700"
                }`}
              >
                Promoções
              </button>
              <button
                onClick={() => setCurrentPage("categories")}
                className={`text-sm font-medium transition-colors hover:text-red-600 ${
                  currentPage === "categories" ? "text-red-600 border-b-2 border-red-600 pb-1" : "text-gray-700"
                }`}
              >
                Categorias
              </button>
            </nav>

            {/* Menu Mobile */}
            <div className="md:hidden">
              <Button size="icon" variant="outline">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Menu Mobile Expandido */}
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-2">
              <button
                onClick={() => setCurrentPage("home")}
                className={`text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                  currentPage === "home" ? "bg-red-50 text-red-600" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage("promotions")}
                className={`text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                  currentPage === "promotions" ? "bg-red-50 text-red-600" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Promoções
              </button>
              <button
                onClick={() => setCurrentPage("categories")}
                className={`text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                  currentPage === "categories" ? "bg-red-50 text-red-600" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Categorias
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="pt-16">{renderContent()}</div>

      {/* Formulário de Login */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Login Administrativo</h2>
              <p className="text-gray-600 mt-2">Acesso restrito ao painel de administração</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">
                  Usuário
                </label>
                <input
                  type="text"
                  id="usuario"
                  value={loginForm.usuario}
                  onChange={(e) => setLoginForm({ ...loginForm, usuario: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Digite seu usuário"
                  required
                />
              </div>

              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  id="senha"
                  value={loginForm.senha}
                  onChange={(e) => setLoginForm({ ...loginForm, senha: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Digite sua senha"
                  required
                />
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{loginError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginForm(false)
                    setLoginError("")
                    setLoginForm({ usuario: "", senha: "" })
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Produto */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">Detalhes do Produto</h2>
                <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4">
                  <Image
                    src={selectedProduct.imagem || "/placeholder.svg"}
                    alt={selectedProduct.nome}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedProduct.nome}</h3>

                {selectedProduct.observacao && (
                  <p className="text-sm text-orange-600 font-medium mb-2 uppercase">{selectedProduct.observacao}</p>
                )}

                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    R$ {selectedProduct.preco.toFixed(2).replace(".", ",")}
                  </span>
                  {selectedProduct.precoOriginal && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        R$ {selectedProduct.precoOriginal.toFixed(2).replace(".", ",")}
                      </span>
                      {selectedProduct.desconto && (
                        <Badge className="bg-red-500 text-xs">-{selectedProduct.desconto}%</Badge>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => adicionarAoCarrinho(selectedProduct)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  🛒 Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal do Carrinho */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">🛒 Meu Carrinho</h2>
                <button onClick={() => setShowCartModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              {carrinho.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🛒</span>
                  </div>
                  <p className="text-gray-500 text-lg">Seu carrinho está vazio</p>
                  <p className="text-gray-400">Adicione produtos para continuar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {carrinho.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-16 h-16">
                        <Image
                          src={item.bebida.imagem || "/placeholder.svg"}
                          alt={item.bebida.nome}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.bebida.nome}</h4>
                        <p className="text-green-600 font-semibold">
                          R$ {item.bebida.preco.toFixed(2).replace(".", ",")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantidade}</span>
                        <button
                          onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          R$ {(item.bebida.preco * item.quantidade).toFixed(2).replace(".", ",")}
                        </p>
                        <button
                          onClick={() => removerDoCarrinho(item.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {carrinho.length > 0 && (
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    R$ {calcularTotal().toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCartModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Continuar Comprando
                  </button>
                  <button
                    onClick={() => {
                      setShowCartModal(false)
                      setShowCheckoutForm(true)
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    🧾 Finalizar Pedido
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Finalização do Pedido */}
      {showCheckoutForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg max-w-sm w-full shadow-2xl max-h-[95vh] overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">🧾 Finalizar Pedido</h2>
                <button onClick={() => setShowCheckoutForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Resumo Compacto */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Resumo:</h3>
                <div className="bg-gray-50 rounded-lg p-2 text-xs">
                  <div className="max-h-20 overflow-y-auto space-y-1">
                    {carrinho.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span className="truncate mr-2">
                          {item.bebida.nome.length > 20 ? `${item.bebida.nome.substring(0, 20)}...` : item.bebida.nome}{" "}
                          ({item.quantidade}x)
                        </span>
                        <span className="font-medium">R$ {(item.bebida.preco * item.quantidade).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-1 mt-1 flex justify-between font-semibold text-sm">
                    <span>Total:</span>
                    <span className="text-green-600">R$ {calcularTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Forma de Pagamento Compacta */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pagamento *</label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => setDadosCliente({ ...dadosCliente, pagamento: "PIX" })}
                    className={`p-3 border-2 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                      dadosCliente.pagamento === "PIX"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <span className="text-xl">💳</span>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">PIX - Instantâneo</p>
                      <p className="text-xs">
                        {configBancarias.chavePix
                          ? `${configBancarias.chavePix.substring(0, 15)}...`
                          : "QR Code disponível"}
                      </p>
                    </div>
                    {configBancarias.qrCodePix && (
                      <div className="w-8 h-8 relative border rounded">
                        <Image
                          src={configBancarias.qrCodePix || "/placeholder.svg"}
                          alt="QR Code"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDadosCliente({ ...dadosCliente, pagamento: "Dinheiro" })}
                    className={`p-3 border-2 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                      dadosCliente.pagamento === "Dinheiro"
                        ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <span className="text-xl">💵</span>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">Dinheiro na Entrega</p>
                      <p className="text-xs">Tenha o valor exato</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Formulário Compacto */}
              <div className="max-h-60 overflow-y-auto">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    finalizarPedido()
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      value={dadosCliente.nome}
                      onChange={(e) => setDadosCliente({ ...dadosCliente, nome: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label htmlFor="rua" className="block text-sm font-medium text-gray-700 mb-1">
                        Rua/Avenida *
                      </label>
                      <input
                        type="text"
                        id="rua"
                        value={dadosCliente.rua}
                        onChange={(e) => setDadosCliente({ ...dadosCliente, rua: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                        placeholder="Rua das Flores"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
                        Nº *
                      </label>
                      <input
                        type="text"
                        id="numero"
                        value={dadosCliente.numero}
                        onChange={(e) => setDadosCliente({ ...dadosCliente, numero: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">
                        Bairro *
                      </label>
                      <input
                        type="text"
                        id="bairro"
                        value={dadosCliente.bairro}
                        onChange={(e) => setDadosCliente({ ...dadosCliente, bairro: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                        placeholder="Centro"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        id="cidade"
                        value={dadosCliente.cidade}
                        onChange={(e) => setDadosCliente({ ...dadosCliente, cidade: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                        placeholder="São Paulo"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      value={dadosCliente.telefone}
                      onChange={(e) => setDadosCliente({ ...dadosCliente, telefone: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </form>
              </div>

              {/* Botões Fixos na Parte Inferior */}
              <div className="mt-4 pt-3 border-t bg-white">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutForm(false)}
                    className="flex-1 px-3 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={finalizarPedido}
                    disabled={isProcessingPayment}
                    className="flex-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm min-h-[44px]"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processando...
                      </>
                    ) : (
                      <>✅ Confirmar Pedido</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pagamento PIX */}
      {showPixPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300 max-h-[95vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">💳 Pagamento</h2>
                <button onClick={() => setShowPixPayment(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="bg-green-50 rounded-lg p-4 mb-6 animate-pulse">
                  <h3 className="font-semibold text-green-800 mb-2">Total a Pagar</h3>
                  <p className="text-3xl font-bold text-green-600">R$ {calcularTotal().toFixed(2).replace(".", ",")}</p>
                </div>

                {/* Seção PIX da Empresa */}
                <div className="mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-blue-800 mb-2 flex items-center justify-center gap-2">
                      🏪 PIX da Empresa - Bar do Léo
                    </h3>
                    <p className="text-sm text-blue-700">Faça o pagamento usando os dados abaixo:</p>
                  </div>

                  {/* QR Code da Empresa */}
                  {configBancarias.qrCodePix ? (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-3 font-medium">📱 Escaneie o QR Code:</p>
                      <div className="w-56 h-56 relative mx-auto border-2 border-blue-200 rounded-lg overflow-hidden shadow-lg animate-in zoom-in-50 duration-500 bg-white p-2">
                        <Image
                          src={configBancarias.qrCodePix || "/placeholder.svg"}
                          alt="QR Code PIX - Bar do Léo"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <p className="text-xs text-green-600 mt-2 font-medium">✅ QR Code do Bar do Léo</p>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="w-56 h-56 relative mx-auto border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-4xl mb-2 block">📱</span>
                          <p className="text-gray-500 text-sm">QR Code não configurado</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Chave PIX da Empresa - SEMPRE MOSTRAR ABAIXO DO QR CODE */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-3 font-medium">🔑 Chave PIX para Pagamento:</p>
                    <div className="bg-gray-50 rounded-lg p-4 border-2 border-blue-200">
                      {configBancarias.chavePix ? (
                        <>
                          <div className="bg-white p-3 rounded border mb-3">
                            <p className="font-mono text-lg text-gray-900 break-all font-semibold">
                              {configBancarias.chavePix}
                            </p>
                          </div>
                          <button
                            onClick={copiarChavePix}
                            className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                              pixKeyCopied
                                ? "bg-green-100 text-green-700 border-2 border-green-300"
                                : "bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-600"
                            }`}
                          >
                            {pixKeyCopied ? (
                              <>
                                <Check className="w-5 h-5" />
                                Chave Copiada com Sucesso!
                              </>
                            ) : (
                              <>
                                <Copy className="w-5 h-5" />
                                Copiar Chave PIX
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <span className="text-2xl mb-2 block">🔑</span>
                          <p className="text-gray-500 text-sm">Chave PIX não configurada</p>
                          <p className="text-xs text-gray-400 mt-1">Configure no painel administrativo</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dados do Recebedor */}
                  <div className="mb-6 text-left">
                    <p className="text-sm text-gray-600 mb-2 font-medium text-center">🏪 Dados do Recebedor:</p>
                    <div className="bg-gray-50 rounded-lg p-4 text-sm border-2 border-gray-200">
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">Empresa:</span>
                          <span className="text-gray-900">Bar do Léo</span>
                        </div>
                        {configBancarias.nomeCompleto && (
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Titular:</span>
                            <span className="text-gray-900">{configBancarias.nomeCompleto}</span>
                          </div>
                        )}
                        {configBancarias.cpfCnpj && (
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">CPF/CNPJ:</span>
                            <span className="text-gray-900">{configBancarias.cpfCnpj}</span>
                          </div>
                        )}
                        {configBancarias.chavePix && (
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Chave PIX:</span>
                            <span className="text-gray-900 font-mono text-xs">
                              {configBancarias.chavePix.length > 20
                                ? `${configBancarias.chavePix.substring(0, 20)}...`
                                : configBancarias.chavePix}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between border-t pt-2 mt-2">
                          <span className="font-medium text-green-700">Valor:</span>
                          <span className="text-green-900 font-bold">
                            R$ {calcularTotal().toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800 border border-blue-200">
                  <p className="font-medium mb-2 flex items-center gap-2">📝 Instruções de Pagamento:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Abra o app do seu banco</li>
                    <li>• Escaneie o QR Code ou copie a chave PIX acima</li>
                    <li>• Confirme o valor: R$ {calcularTotal().toFixed(2).replace(".", ",")}</li>
                    <li>• Realize o pagamento</li>
                    <li>• Guarde o comprovante</li>
                    <li>• Entraremos em contato para confirmar a entrega</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-4 text-sm text-green-800 border border-green-200">
                  <p className="font-medium mb-1 flex items-center gap-2">✅ Após o pagamento:</p>
                  <p className="text-xs">
                    Seu pedido será processado automaticamente e entraremos em contato via WhatsApp para confirmar a
                    entrega.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPixPayment(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={processarPedido}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium border-2 border-green-600"
                  >
                    ✅ Confirmar Pedido
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ícone do Carrinho Fixo */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowCartModal(true)}
          className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <div className="relative">
            <span className="text-2xl">🛒</span>
            {carrinho.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 text-black text-xs font-bold rounded-full flex items-center justify-center">
                {carrinho.reduce((total, item) => total + item.quantidade, 0)}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Ícone de Notificações Fixo */}
      <div className="fixed bottom-6 right-24 z-40">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 relative"
        >
          <span className="text-xl">🔔</span>
          {notificacoesPendentes.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {notificacoesPendentes.length}
            </span>
          )}
        </button>
      </div>

      {/* Modal de Notificações */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">🔔 Notificações</h2>
                <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {notificacoesPendentes.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔔</span>
                  </div>
                  <p className="text-gray-500 text-lg">Nenhuma notificação</p>
                  <p className="text-gray-400">Você será notificado quando seus pedidos forem entregues</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notificacoesPendentes.map((pedido) => (
                    <div key={pedido.id} className="border rounded-lg p-4 bg-green-50 border-green-200">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">✅</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-800 mb-2">Pedido Entregue!</h4>
                          <p className="text-green-700 text-sm mb-3">
                            Seu pedido com {pedido.bebidas?.map((b: any) => b.nome).join(", ")} foi entregue com
                            sucesso!
                          </p>
                          <div className="text-xs text-green-600 mb-3">
                            <p>📍 {pedido.endereco}</p>
                            <p>💳 Pagamento: {pedido.pagamento}</p>
                          </div>
                          <button
                            onClick={() => confirmarEntrega(pedido.id)}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                          >
                            ✅ Confirmar Recebimento
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
