"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Save, X, Upload, Eye } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

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

interface Pedido {
  id: string
  bebidaNome: string
  endereco: string
  dataHora: string
  status: "pendente" | "entregue"
}

interface AdminPanelProps {
  bebidas: Bebida[]
  updateBebidas: (bebidas: Bebida[]) => void
  onLogout?: () => void
}

const categorias = [
  "Cervejas",
  "Destilados",
  "Refrigerantes",
  "Energéticos",
  "Vinhos",
  "Águas",
  "Gelo",
  "Cigarros",
  "Preservativos",
  "Acessórios",
  "Outros",
]

const categoriasFiltro = [
  { label: "Promoções", value: "promocoes" },
  { label: "Gelo de Coco", value: "gelo" },
  { label: "Cigarros & Isqueiro & Sedas", value: "cigarros" },
  { label: "Preservativos", value: "preservativos" },
  { label: "Cerveja 600ml RETORNAVEL", value: "cerveja" },
  { label: "Caixa GELADA", value: "caixa" },
]

export default function AdminPanel({ bebidas, updateBebidas, onLogout }: AdminPanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBebida, setEditingBebida] = useState<Bebida | null>(null)
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    precoOriginal: "",
    imagem: "",
    categoria: "",
    categoriaFiltro: "",
    observacao: "",
  })

  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [activeTab, setActiveTab] = useState<"bebidas" | "pedidos" | "configuracoes" | "horarios">("bebidas")

  const [pedidosDetalhados, setPedidosDetalhados] = useState<any[]>([])

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

  const [horariosFuncionamento, setHorariosFuncionamento] = useState({
    segunda: { ativo: true, abertura: "08:00", fechamento: "22:00" },
    terca: { ativo: true, abertura: "08:00", fechamento: "22:00" },
    quarta: { ativo: true, abertura: "08:00", fechamento: "22:00" },
    quinta: { ativo: true, abertura: "08:00", fechamento: "22:00" },
    sexta: { ativo: true, abertura: "08:00", fechamento: "22:00" },
    sabado: { ativo: true, abertura: "08:00", fechamento: "22:00" },
    domingo: { ativo: true, abertura: "08:00", fechamento: "18:00" },
  })

  useEffect(() => {
    const pedidosSalvos = localStorage.getItem("pedidos")
    const pedidosDetalhadosSalvos = localStorage.getItem("pedidosDetalhados")

    if (pedidosSalvos) {
      setPedidos(JSON.parse(pedidosSalvos))
    } else {
      // Dados de exemplo para demonstração
      const pedidosExemplo = [
        {
          id: "1",
          bebidaNome: "Cerveja Skol Lata 350ml",
          endereco: "Rua das Flores, 123 - Centro, São Paulo/SP",
          dataHora: "2024-01-15 14:30",
          status: "pendente" as const,
        },
        {
          id: "2",
          bebidaNome: "Whisky Red Label 1L",
          endereco: "Av. Paulista, 456 - Bela Vista, São Paulo/SP",
          dataHora: "2024-01-15 15:45",
          status: "entregue" as const,
        },
        {
          id: "3",
          bebidaNome: "Gelo de Coco Premium 2kg",
          endereco: "Rua Augusta, 789 - Consolação, São Paulo/SP",
          dataHora: "2024-01-15 16:20",
          status: "pendente" as const,
        },
      ]
      setPedidos(pedidosExemplo)
      localStorage.setItem("pedidos", JSON.stringify(pedidosExemplo))
    }

    if (pedidosDetalhadosSalvos) {
      setPedidosDetalhados(JSON.parse(pedidosDetalhadosSalvos))
    }

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

  const calcularDesconto = (preco: number, precoOriginal: number) => {
    return Math.round(((precoOriginal - preco) / precoOriginal) * 100)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.preco) {
      alert("Nome e preço são obrigatórios!")
      return
    }

    const preco = Number.parseFloat(formData.preco)
    const precoOriginal = formData.precoOriginal ? Number.parseFloat(formData.precoOriginal) : undefined
    const desconto = precoOriginal && precoOriginal > preco ? calcularDesconto(preco, precoOriginal) : undefined

    const novaBebida: Bebida = {
      id: editingBebida ? editingBebida.id : Date.now().toString(),
      nome: formData.nome,
      preco,
      precoOriginal,
      desconto,
      imagem: formData.imagem || "/placeholder.svg?height=200&width=200",
      categoria: formData.categoria || undefined,
      categoriaFiltro: formData.categoriaFiltro || undefined,
      observacao: formData.observacao || undefined,
    }

    if (editingBebida) {
      const bebidasAtualizadas = bebidas.map((b) => (b.id === editingBebida.id ? novaBebida : b))
      updateBebidas(bebidasAtualizadas)
    } else {
      updateBebidas([...bebidas, novaBebida])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      nome: "",
      preco: "",
      precoOriginal: "",
      imagem: "",
      categoria: "",
      categoriaFiltro: "",
      observacao: "",
    })
    setEditingBebida(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (bebida: Bebida) => {
    setEditingBebida(bebida)
    setFormData({
      nome: bebida.nome,
      preco: bebida.preco.toString(),
      precoOriginal: bebida.precoOriginal?.toString() || "",
      imagem: bebida.imagem,
      categoria: bebida.categoria || "",
      categoriaFiltro: bebida.categoriaFiltro || "",
      observacao: bebida.observacao || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta bebida?")) {
      const bebidasFiltradas = bebidas.filter((b) => b.id !== id)
      updateBebidas(bebidasFiltradas)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData({ ...formData, imagem: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const marcarComoEntregue = (pedidoId: string) => {
    // Atualizar pedidos simples
    const pedidosAtualizados = pedidos.map((p) => (p.id === pedidoId ? { ...p, status: "entregue" as const } : p))
    setPedidos(pedidosAtualizados)
    localStorage.setItem("pedidos", JSON.stringify(pedidosAtualizados))

    // Atualizar pedidos detalhados
    const pedidosDetalhadosAtualizados = pedidosDetalhados.map((p) =>
      p.id === pedidoId ? { ...p, entregue: true, confirmadoPeloCliente: false } : p,
    )
    setPedidosDetalhados(pedidosDetalhadosAtualizados)
    localStorage.setItem("pedidosDetalhados", JSON.stringify(pedidosDetalhadosAtualizados))
  }

  const salvarConfigBancarias = () => {
    localStorage.setItem("configBancarias", JSON.stringify(configBancarias))
    alert("Configurações bancárias salvas com sucesso!")
  }

  const handleImageUploadQR = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setConfigBancarias({ ...configBancarias, qrCodePix: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const salvarHorarios = () => {
    localStorage.setItem("horariosFuncionamento", JSON.stringify(horariosFuncionamento))
    alert("Horários de funcionamento salvos com sucesso!")
  }

  const atualizarHorario = (dia: string, campo: string, valor: string | boolean) => {
    setHorariosFuncionamento((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia as keyof typeof prev],
        [campo]: valor,
      },
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header do Admin */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                <span className="text-2xl">🛠️</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-gray-600">Gerencie as bebidas do Bar do Léo</p>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <span className="text-sm">🚪</span>
                Sair
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Bebidas</p>
                  <p className="text-3xl font-bold text-red-600">{bebidas.length}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🍺</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Médio</p>
                  <p className="text-3xl font-bold text-green-600">
                    R${" "}
                    {bebidas.length > 0
                      ? (bebidas.reduce((acc, b) => acc + b.preco, 0) / bebidas.length).toFixed(2)
                      : "0,00"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Promoção</p>
                  <p className="text-3xl font-bold text-orange-600">{bebidas.filter((b) => b.precoOriginal).length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏷️</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                  <p className="text-3xl font-bold text-blue-600">{pedidos.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controles */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-2xl">Painel de Gerenciamento</CardTitle>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <span className="text-sm">🚪</span>
                  Sair
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b">
              <button
                onClick={() => setActiveTab("bebidas")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "bebidas"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                🍺 Gerenciar Bebidas
              </button>
              <button
                onClick={() => setActiveTab("pedidos")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "pedidos"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                📋 Pedidos dos Clientes
              </button>
              <button
                onClick={() => setActiveTab("configuracoes")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "configuracoes"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                🏦 Configurações Bancárias
              </button>
              <button
                onClick={() => setActiveTab("horarios")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "horarios"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                🕒 Horários de Funcionamento
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === "bebidas" ? (
              // Todo o conteúdo existente de gerenciamento de bebidas
              <>
                {activeTab === "bebidas" && (
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === "cards" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("cards")}
                        className={viewMode === "cards" ? "bg-red-600 hover:bg-red-700" : ""}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Cards
                      </Button>
                      <Button
                        variant={viewMode === "table" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("table")}
                        className={viewMode === "table" ? "bg-red-600 hover:bg-red-700" : ""}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Tabela
                      </Button>
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)} className="bg-red-600 hover:bg-red-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Bebida
                    </Button>
                  </div>
                )}
                {bebidas.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">🍺</span>
                    </div>
                    <p className="text-gray-500 text-lg mb-2">Nenhuma bebida cadastrada ainda.</p>
                    <p className="text-gray-400 mb-6">Clique em "Nova Bebida" para começar.</p>
                    <Button onClick={() => setIsDialogOpen(true)} className="bg-red-600 hover:bg-red-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Cadastrar Primeira Bebida
                    </Button>
                  </div>
                ) : viewMode === "cards" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bebidas.map((bebida) => (
                      <Card key={bebida.id} className="hover:shadow-lg transition-shadow produto-card-3d">
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 mb-4 garrafa-animada">
                              <Image
                                src={bebida.imagem || "/placeholder.svg"}
                                alt={bebida.nome}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{bebida.nome}</h3>
                            <div className="flex gap-2 mb-2">
                              {bebida.categoria && (
                                <Badge variant="secondary" className="text-xs">
                                  {bebida.categoria}
                                </Badge>
                              )}
                              {bebida.categoriaFiltro && (
                                <Badge variant="outline" className="text-xs">
                                  {categoriasFiltro.find((c) => c.value === bebida.categoriaFiltro)?.label ||
                                    bebida.categoriaFiltro}
                                </Badge>
                              )}
                            </div>
                            <div className="mb-3">
                              <p className="text-2xl font-bold text-green-600">R$ {bebida.preco.toFixed(2)}</p>
                              {bebida.precoOriginal && (
                                <div className="flex items-center justify-center gap-2">
                                  <p className="text-sm text-gray-500 line-through">
                                    R$ {bebida.precoOriginal.toFixed(2)}
                                  </p>
                                  <Badge className="bg-red-500 text-xs">-{bebida.desconto}%</Badge>
                                </div>
                              )}
                            </div>
                            {bebida.observacao && <p className="text-xs text-orange-600 mb-3">{bebida.observacao}</p>}
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(bebida)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(bebida.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Imagem</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Filtro</TableHead>
                          <TableHead>Preço</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bebidas.map((bebida) => (
                          <TableRow key={bebida.id}>
                            <TableCell>
                              <div className="w-12 h-12 relative">
                                <Image
                                  src={bebida.imagem || "/placeholder.svg"}
                                  alt={bebida.nome}
                                  fill
                                  className="object-cover rounded"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{bebida.nome}</p>
                                {bebida.observacao && <p className="text-xs text-gray-500">{bebida.observacao}</p>}
                              </div>
                            </TableCell>
                            <TableCell>
                              {bebida.categoria ? (
                                <Badge variant="secondary">{bebida.categoria}</Badge>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {bebida.categoriaFiltro ? (
                                <Badge variant="outline" className="text-xs">
                                  {categoriasFiltro.find((c) => c.value === bebida.categoriaFiltro)?.label ||
                                    bebida.categoriaFiltro}
                                </Badge>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-semibold text-green-600">R$ {bebida.preco.toFixed(2)}</p>
                                {bebida.precoOriginal && (
                                  <p className="text-sm text-gray-500 line-through">
                                    R$ {bebida.precoOriginal.toFixed(2)}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {bebida.precoOriginal && <Badge className="bg-red-500">-{bebida.desconto}%</Badge>}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(bebida)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(bebida.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            ) : activeTab === "pedidos" ? (
              // Seção de Pedidos dos Clientes
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Lista de Pedidos</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                      <span>Pendente</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full ml-4"></span>
                      <span>Entregue</span>
                    </div>

                    {pedidos.length > 0 && (
                      <button
                        onClick={() => {
                          if (
                            confirm("Tem certeza que deseja excluir TODOS os pedidos? Esta ação não pode ser desfeita.")
                          ) {
                            setPedidos([])
                            localStorage.setItem("pedidos", JSON.stringify([]))
                            // Também limpar pedidos detalhados se existir
                            localStorage.setItem("pedidosDetalhados", JSON.stringify([]))
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Limpar Todos
                      </button>
                    )}
                  </div>
                </div>

                {pedidos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">📋</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
                    <p className="text-gray-600">Os pedidos dos clientes aparecerão aqui quando forem realizados.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {pedidos.map((pedido) => (
                      <Card key={pedido.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-lg">🍺</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-lg text-gray-900">{pedido.bebidaNome}</h4>
                                  <p className="text-sm text-gray-500">Pedido #{pedido.id}</p>
                                </div>
                              </div>

                              <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">📍</span>
                                  <p className="text-sm text-gray-700">{pedido.endereco}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">🕒</span>
                                  <p className="text-sm text-gray-700">
                                    {new Date(pedido.dataHora).toLocaleString("pt-BR")}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <Badge
                                className={`${
                                  pedido.status === "pendente"
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                    : "bg-green-100 text-green-800 border-green-200"
                                }`}
                                variant="outline"
                              >
                                {pedido.status === "pendente" ? "⏳ Pendente" : "✅ Entregue"}
                              </Badge>

                              {/* Status de Confirmação do Cliente */}
                              {pedido.status === "entregue" && (
                                <div className="text-xs">
                                  {(() => {
                                    const pedidoDetalhado = pedidosDetalhados.find((p) => p.id === pedido.id)
                                    if (pedidoDetalhado?.confirmadoPeloCliente) {
                                      return (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                          ✅ Confirmado pelo Cliente
                                        </span>
                                      )
                                    } else if (pedidoDetalhado?.entregue) {
                                      return (
                                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                                          ⏳ Aguardando Confirmação
                                        </span>
                                      )
                                    }
                                    return null
                                  })()}
                                </div>
                              )}
                            </div>

                            {/* Botões de Ação */}
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => {
                                  if (confirm("Tem certeza que deseja excluir este pedido?")) {
                                    const pedidosAtualizados = pedidos.filter((p) => p.id !== pedido.id)
                                    setPedidos(pedidosAtualizados)
                                    localStorage.setItem("pedidos", JSON.stringify(pedidosAtualizados))
                                  }
                                }}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Excluir
                              </button>

                              <button
                                onClick={() => marcarComoEntregue(pedido.id)}
                                className={`px-3 py-1 rounded-md transition-colors text-sm font-medium flex items-center gap-1 ${
                                  pedido.status === "pendente"
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                }`}
                              >
                                {pedido.status === "pendente" ? (
                                  <>
                                    <span className="w-3 h-3">✅</span>
                                    Marcar Entregue
                                  </>
                                ) : (
                                  <>
                                    <span className="w-3 h-3">⏳</span>
                                    Marcar Pendente
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === "configuracoes" ? (
              // Seção de Configurações Bancárias
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Configurações Bancárias</h3>
                  <Button onClick={salvarConfigBancarias} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Configurações
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Informações Bancárias */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">🏦</span>
                        Dados Bancários
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="nomeCompleto">Nome Completo do Titular</Label>
                        <Input
                          id="nomeCompleto"
                          value={configBancarias.nomeCompleto}
                          onChange={(e) => setConfigBancarias({ ...configBancarias, nomeCompleto: e.target.value })}
                          placeholder="Leonardo Silva"
                        />
                      </div>

                      <div>
                        <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                        <Input
                          id="cpfCnpj"
                          value={configBancarias.cpfCnpj}
                          onChange={(e) => setConfigBancarias({ ...configBancarias, cpfCnpj: e.target.value })}
                          placeholder="000.000.000-00"
                        />
                      </div>

                      <div>
                        <Label htmlFor="nomeBanco">Nome do Banco</Label>
                        <Input
                          id="nomeBanco"
                          value={configBancarias.nomeBanco}
                          onChange={(e) => setConfigBancarias({ ...configBancarias, nomeBanco: e.target.value })}
                          placeholder="Ex: Banco do Brasil, Itaú, Bradesco"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="agencia">Agência</Label>
                          <Input
                            id="agencia"
                            value={configBancarias.agencia}
                            onChange={(e) => setConfigBancarias({ ...configBancarias, agencia: e.target.value })}
                            placeholder="0000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="conta">Conta</Label>
                          <Input
                            id="conta"
                            value={configBancarias.conta}
                            onChange={(e) => setConfigBancarias({ ...configBancarias, conta: e.target.value })}
                            placeholder="00000-0"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="tipoConta">Tipo de Conta</Label>
                        <Select
                          value={configBancarias.tipoConta}
                          onValueChange={(value) => setConfigBancarias({ ...configBancarias, tipoConta: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de conta" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="corrente">Conta Corrente</SelectItem>
                            <SelectItem value="poupanca">Conta Poupança</SelectItem>
                            <SelectItem value="pagamento">Conta de Pagamento</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Configurações PIX */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">💳</span>
                        Configurações PIX
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="chavePix">Chave PIX</Label>
                        <Input
                          id="chavePix"
                          value={configBancarias.chavePix}
                          onChange={(e) => setConfigBancarias({ ...configBancarias, chavePix: e.target.value })}
                          placeholder="CPF, e-mail, telefone ou chave aleatória"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Digite sua chave PIX (CPF, e-mail, telefone ou chave aleatória)
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="qrCodePix">QR Code PIX</Label>
                        <div className="space-y-4">
                          <Input
                            id="qrCodePix"
                            value={configBancarias.qrCodePix}
                            onChange={(e) => setConfigBancarias({ ...configBancarias, qrCodePix: e.target.value })}
                            placeholder="URL da imagem do QR Code ou faça upload"
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">ou</span>
                            <label className="cursor-pointer">
                              <input type="file" accept="image/*" onChange={handleImageUploadQR} className="hidden" />
                              <Button type="button" variant="outline" size="sm" asChild>
                                <span>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload QR Code
                                </span>
                              </Button>
                            </label>
                          </div>
                          {configBancarias.qrCodePix && (
                            <div className="mt-4">
                              <p className="text-sm text-gray-600 mb-2">Preview do QR Code:</p>
                              <div className="w-48 h-48 relative border rounded-lg overflow-hidden mx-auto">
                                <Image
                                  src={configBancarias.qrCodePix || "/placeholder.svg"}
                                  alt="QR Code PIX"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Preview das Informações */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">👁️</span>
                      Preview - Como os Clientes Verão
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Dados para Pagamento</h4>

                      {configBancarias.chavePix && (
                        <div className="mb-6">
                          <h5 className="font-medium text-gray-800 mb-2">💳 PIX</h5>
                          <div className="bg-white rounded-lg p-4 border">
                            <p className="text-sm text-gray-600 mb-1">Chave PIX:</p>
                            <p className="font-mono text-lg text-gray-900 mb-3">{configBancarias.chavePix}</p>
                            {configBancarias.qrCodePix && (
                              <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">Ou escaneie o QR Code:</p>
                                <div className="w-32 h-32 relative mx-auto border rounded">
                                  <Image
                                    src={configBancarias.qrCodePix || "/placeholder.svg"}
                                    alt="QR Code PIX"
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {configBancarias.nomeBanco && (
                        <div>
                          <h5 className="font-medium text-gray-800 mb-2">🏦 Transferência Bancária</h5>
                          <div className="bg-white rounded-lg p-4 border">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Titular:</p>
                                <p className="font-medium">{configBancarias.nomeCompleto || "Não informado"}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">CPF/CNPJ:</p>
                                <p className="font-medium">{configBancarias.cpfCnpj || "Não informado"}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Banco:</p>
                                <p className="font-medium">{configBancarias.nomeBanco}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Tipo:</p>
                                <p className="font-medium">{configBancarias.tipoConta || "Não informado"}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Agência:</p>
                                <p className="font-medium">{configBancarias.agencia || "Não informado"}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Conta:</p>
                                <p className="font-medium">{configBancarias.conta || "Não informado"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {!configBancarias.chavePix && !configBancarias.nomeBanco && (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">💳</span>
                          </div>
                          <p className="text-gray-500">Preencha as informações bancárias para ver o preview</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : activeTab === "horarios" ? (
              // Seção de Horários de Funcionamento
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Horários de Funcionamento</h3>
                  <Button onClick={salvarHorarios} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Horários
                  </Button>
                </div>

                <div className="grid gap-6">
                  {Object.entries(horariosFuncionamento).map(([dia, config]) => {
                    const nomesDias = {
                      segunda: "Segunda-feira",
                      terca: "Terça-feira",
                      quarta: "Quarta-feira",
                      quinta: "Quinta-feira",
                      sexta: "Sexta-feira",
                      sabado: "Sábado",
                      domingo: "Domingo",
                    }

                    return (
                      <Card key={dia}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">
                                {dia === "domingo" ? "🌅" : dia === "sabado" ? "🎉" : "📅"}
                              </span>
                              <h4 className="text-lg font-semibold text-gray-900">
                                {nomesDias[dia as keyof typeof nomesDias]}
                              </h4>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Funcionando:</span>
                              <button
                                onClick={() => atualizarHorario(dia, "ativo", !config.ativo)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  config.ativo ? "bg-green-600" : "bg-gray-300"
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    config.ativo ? "translate-x-6" : "translate-x-1"
                                  }`}
                                />
                              </button>
                            </div>
                          </div>

                          {config.ativo && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`${dia}-abertura`}>Horário de Abertura</Label>
                                <Input
                                  id={`${dia}-abertura`}
                                  type="time"
                                  value={config.abertura}
                                  onChange={(e) => atualizarHorario(dia, "abertura", e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`${dia}-fechamento`}>Horário de Fechamento</Label>
                                <Input
                                  id={`${dia}-fechamento`}
                                  type="time"
                                  value={config.fechamento}
                                  onChange={(e) => atualizarHorario(dia, "fechamento", e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          )}

                          {!config.ativo && (
                            <div className="text-center py-4">
                              <span className="text-gray-500 font-medium">🚫 Fechado neste dia</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Preview dos Horários */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">👁️</span>
                      Preview - Como os Clientes Verão
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4 text-center">🕒 Horário de Funcionamento</h4>
                      <div className="space-y-2">
                        {Object.entries(horariosFuncionamento).map(([dia, config]) => {
                          const nomesDias = {
                            segunda: "Segunda-feira",
                            terca: "Terça-feira",
                            quarta: "Quarta-feira",
                            quinta: "Quinta-feira",
                            sexta: "Sexta-feira",
                            sabado: "Sábado",
                            domingo: "Domingo",
                          }

                          return (
                            <div key={dia} className="flex justify-between items-center py-1">
                              <span className="font-medium text-gray-700">
                                {nomesDias[dia as keyof typeof nomesDias]}:
                              </span>
                              <span className={`font-semibold ${config.ativo ? "text-green-600" : "text-red-600"}`}>
                                {config.ativo ? `${config.abertura} às ${config.fechamento}` : "Fechado"}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Seção de Pedidos dos Clientes
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Lista de Pedidos</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                      <span>Pendente</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full ml-4"></span>
                      <span>Entregue</span>
                    </div>

                    {pedidos.length > 0 && (
                      <button
                        onClick={() => {
                          if (
                            confirm("Tem certeza que deseja excluir TODOS os pedidos? Esta ação não pode ser desfeita.")
                          ) {
                            setPedidos([])
                            localStorage.setItem("pedidos", JSON.stringify([]))
                            // Também limpar pedidos detalhados se existir
                            localStorage.setItem("pedidosDetalhados", JSON.stringify([]))
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Limpar Todos
                      </button>
                    )}
                  </div>
                </div>

                {pedidos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">📋</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
                    <p className="text-gray-600">Os pedidos dos clientes aparecerão aqui quando forem realizados.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {pedidos.map((pedido) => (
                      <Card key={pedido.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-lg">🍺</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-lg text-gray-900">{pedido.bebidaNome}</h4>
                                  <p className="text-sm text-gray-500">Pedido #{pedido.id}</p>
                                </div>
                              </div>

                              <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">📍</span>
                                  <p className="text-sm text-gray-700">{pedido.endereco}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">🕒</span>
                                  <p className="text-sm text-gray-700">
                                    {new Date(pedido.dataHora).toLocaleString("pt-BR")}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <Badge
                                className={`${
                                  pedido.status === "pendente"
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                    : "bg-green-100 text-green-800 border-green-200"
                                }`}
                                variant="outline"
                              >
                                {pedido.status === "pendente" ? "⏳ Pendente" : "✅ Entregue"}
                              </Badge>

                              {/* Status de Confirmação do Cliente */}
                              {pedido.status === "entregue" && (
                                <div className="text-xs">
                                  {(() => {
                                    const pedidoDetalhado = pedidosDetalhados.find((p) => p.id === pedido.id)
                                    if (pedidoDetalhado?.confirmadoPeloCliente) {
                                      return (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                          ✅ Confirmado pelo Cliente
                                        </span>
                                      )
                                    } else if (pedidoDetalhado?.entregue) {
                                      return (
                                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                                          ⏳ Aguardando Confirmação
                                        </span>
                                      )
                                    }
                                    return null
                                  })()}
                                </div>
                              )}
                            </div>

                            {/* Botões de Ação */}
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => {
                                  if (confirm("Tem certeza que deseja excluir este pedido?")) {
                                    const pedidosAtualizados = pedidos.filter((p) => p.id !== pedido.id)
                                    setPedidos(pedidosAtualizados)
                                    localStorage.setItem("pedidos", JSON.stringify(pedidosAtualizados))
                                  }
                                }}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Excluir
                              </button>

                              <button
                                onClick={() => marcarComoEntregue(pedido.id)}
                                className={`px-3 py-1 rounded-md transition-colors text-sm font-medium flex items-center gap-1 ${
                                  pedido.status === "pendente"
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                }`}
                              >
                                {pedido.status === "pendente" ? (
                                  <>
                                    <span className="w-3 h-3">✅</span>
                                    Marcar Entregue
                                  </>
                                ) : (
                                  <>
                                    <span className="w-3 h-3">⏳</span>
                                    Marcar Pendente
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog para Adicionar/Editar */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{editingBebida ? "Editar Bebida" : "Nova Bebida"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="nome">Nome da Bebida *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Beats GT 269ml - LATA"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="categoriaFiltro">Categoria de Filtro</Label>
                  <Select
                    value={formData.categoriaFiltro}
                    onValueChange={(value) => setFormData({ ...formData, categoriaFiltro: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um filtro" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriasFiltro.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="preco">Preço Atual (R$) *</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    placeholder="Ex: 6.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="precoOriginal">Preço Original (R$) - Para Promoção</Label>
                  <Input
                    id="precoOriginal"
                    type="number"
                    step="0.01"
                    value={formData.precoOriginal}
                    onChange={(e) => setFormData({ ...formData, precoOriginal: e.target.value })}
                    placeholder="Ex: 7.00 (deixe vazio se não for promoção)"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="observacao">Observação</Label>
                  <Textarea
                    id="observacao"
                    value={formData.observacao}
                    onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                    placeholder="Ex: PAGAMENTO PIX OU ESPÉCIE, CASCOS"
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="imagem">Imagem da Bebida</Label>
                  <div className="space-y-4">
                    <Input
                      id="imagem"
                      value={formData.imagem}
                      onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
                      placeholder="URL da imagem ou faça upload abaixo"
                    />
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">ou</span>
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload de Imagem
                          </span>
                        </Button>
                      </label>
                    </div>
                    {formData.imagem && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <div className="w-32 h-32 relative border rounded-lg overflow-hidden">
                          <Image
                            src={formData.imagem || "/placeholder.svg"}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  <Save className="w-4 h-4 mr-2" />
                  {editingBebida ? "Atualizar Bebida" : "Salvar Bebida"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
