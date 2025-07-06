"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Bebida {
  id: string
  nome: string
  preco: number
  imagem: string
  categoria?: string
  precoOriginal?: number
  desconto?: number
  observacao?: string
}

interface CategoriesPageProps {
  bebidas: Bebida[]
}

export default function CategoriesPage({ bebidas }: CategoriesPageProps) {
  // Agrupar bebidas por categoria
  const categorias = bebidas.reduce(
    (acc, bebida) => {
      const categoria = bebida.categoria || "Outros"
      if (!acc[categoria]) {
        acc[categoria] = []
      }
      acc[categoria].push(bebida)
      return acc
    },
    {} as Record<string, Bebida[]>,
  )

  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case "Cervejas":
        return "🍺"
      case "Destilados":
        return "🥃"
      case "Refrigerantes":
        return "🥤"
      case "Energéticos":
        return "⚡"
      case "Vinhos":
        return "🍷"
      case "Águas":
        return "💧"
      default:
        return "📦"
    }
  }

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case "Cervejas":
        return "from-amber-500 to-amber-600"
      case "Destilados":
        return "from-purple-500 to-purple-600"
      case "Refrigerantes":
        return "from-blue-500 to-blue-600"
      case "Energéticos":
        return "from-yellow-500 to-yellow-600"
      case "Vinhos":
        return "from-red-500 to-red-600"
      case "Águas":
        return "from-cyan-500 to-cyan-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📂</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Categorias de Bebidas</h1>
          <p className="text-gray-600 text-lg">
            Explore nossa variedade de bebidas organizadas por categoria. Encontre exatamente o que procura!
          </p>
        </div>

        {Object.keys(categorias).length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📦</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nenhuma categoria disponível</h2>
            <p className="text-gray-600">Adicione bebidas no painel administrativo para ver as categorias aqui.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(categorias).map(([nomeCategoria, produtosDaCategoria]) => (
              <div key={nomeCategoria}>
                {/* Header da Categoria */}
                <Card className="mb-8">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${getCategoryColor(
                          nomeCategoria,
                        )} rounded-full flex items-center justify-center`}
                      >
                        <span className="text-3xl">{getCategoryIcon(nomeCategoria)}</span>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-3xl text-gray-900">{nomeCategoria}</CardTitle>
                        <p className="text-gray-600 mt-2">
                          {produtosDaCategoria.length} produto{produtosDaCategoria.length !== 1 ? "s" : ""} disponível
                          {produtosDaCategoria.length !== 1 ? "is" : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Preço médio</p>
                        <p className="text-2xl font-bold text-green-600">
                          R${" "}
                          {(
                            produtosDaCategoria.reduce((acc, p) => acc + p.preco, 0) / produtosDaCategoria.length
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Produtos da Categoria */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {produtosDaCategoria.map((bebida) => (
                    <Card key={bebida.id} className="hover:shadow-lg transition-shadow produto-card-3d">
                      <CardContent className="p-4">
                        <div className="text-center">
                          {/* Imagem com Animação */}
                          <div className="w-20 h-20 mx-auto mb-4 garrafa-girando">
                            <Image
                              src={bebida.imagem || "/placeholder.svg"}
                              alt={bebida.nome}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>

                          {/* Nome */}
                          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{bebida.nome}</h3>

                          {/* Observação */}
                          {bebida.observacao && (
                            <p className="text-xs text-orange-600 font-medium mb-2 uppercase">{bebida.observacao}</p>
                          )}

                          {/* Preços */}
                          <div className="mb-3">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-2xl font-bold text-green-600">
                                R$ {bebida.preco.toFixed(2).replace(".", ",")}
                              </span>
                              {bebida.precoOriginal && (
                                <>
                                  <span className="text-sm text-gray-500 line-through">
                                    R$ {bebida.precoOriginal.toFixed(2).replace(".", ",")}
                                  </span>
                                  {bebida.desconto && <Badge className="bg-red-500 text-xs">-{bebida.desconto}%</Badge>}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Encontrou o que procurava?</h2>
          <p className="text-gray-600 text-lg mb-6">
            Entre em contato conosco para fazer seu pedido ou tirar dúvidas sobre nossos produtos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              📱 WhatsApp: (11) 99999-9999
            </button>
            <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              📞 Telefone: (11) 99999-9999
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
