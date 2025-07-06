"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

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

interface PromotionsPageProps {
  bebidas: Bebida[]
}

export default function PromotionsPage({ bebidas }: PromotionsPageProps) {
  const promocoes = bebidas.filter((bebida) => bebida.precoOriginal && bebida.precoOriginal > bebida.preco)

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏷️</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Promoções Especiais</h1>
          <p className="text-gray-600 text-lg">
            Aproveite nossas ofertas imperdíveis! Economia garantida nas melhores bebidas.
          </p>
        </div>

        {promocoes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">😔</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nenhuma promoção ativa</h2>
            <p className="text-gray-600">
              No momento não temos promoções disponíveis, mas fique ligado! Sempre temos ofertas especiais.
            </p>
          </div>
        ) : (
          <>
            {/* Stats das Promoções */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <p className="text-3xl font-bold text-red-600 mb-2">{promocoes.length}</p>
                  <p className="text-gray-600">Produtos em Promoção</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💰</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600 mb-2">
                    {Math.max(...promocoes.map((p) => p.desconto || 0))}%
                  </p>
                  <p className="text-gray-600">Maior Desconto</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💸</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-600 mb-2">
                    R${" "}
                    {promocoes
                      .reduce((acc, p) => acc + ((p.precoOriginal || 0) - p.preco), 0)
                      .toFixed(2)
                      .replace(".", ",")}
                  </p>
                  <p className="text-gray-600">Economia Total</p>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Promoções */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promocoes.map((bebida) => (
                <Card key={bebida.id} className="hover:shadow-lg transition-shadow overflow-hidden produto-card-3d">
                  <div className="relative">
                    {/* Badge de Desconto */}
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-red-500 text-white font-bold text-lg px-3 py-1">
                        -{bebida.desconto}% OFF
                      </Badge>
                    </div>

                    {/* Imagem com Animação */}
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                      <div className="garrafa-flutuante">
                        <Image
                          src={bebida.imagem || "/placeholder.svg"}
                          alt={bebida.nome}
                          width={150}
                          height={150}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      {bebida.categoria && (
                        <Badge variant="secondary" className="mb-2">
                          {bebida.categoria}
                        </Badge>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{bebida.nome}</h3>
                      {bebida.observacao && (
                        <p className="text-sm text-orange-600 font-medium uppercase">{bebida.observacao}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-green-600">
                          R$ {bebida.preco.toFixed(2).replace(".", ",")}
                        </p>
                        <p className="text-lg text-gray-500 line-through">
                          R$ {bebida.precoOriginal?.toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Você economiza</p>
                        <p className="text-xl font-bold text-red-600">
                          R$ {((bebida.precoOriginal || 0) - bebida.preco).toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Não Perca Essas Ofertas!</h2>
          <p className="text-xl mb-6">Entre em contato agora e garante sua bebida com desconto especial.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              📱 WhatsApp: (11) 99999-9999
            </button>
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              📞 Ligar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
