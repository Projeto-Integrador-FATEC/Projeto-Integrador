import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { ArrowLeft, CreditCard, Banknote, Wallet } from "lucide-react";
import Link from "next/link";

export default function DoacaoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/curso-details/1" className="text-violet-500 hover:text-violet-600">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900">Realizar Doação</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Informações do curso */}
          <div>
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Image src="/bradesco_img.svg" alt="Fundação Bradesco" width={60} height={60} className="object-contain" />
                <div>
                  <h2 className="text-xl font-semibold">Curso de Informática</h2>
                  <p className="text-zinc-600">Fundação Bradesco</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-zinc-600">
                  <span>Total arrecadado:</span>
                  <span className="font-semibold">R$ 3.500,00</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Meta de arrecadação:</span>
                  <span className="font-semibold">R$ 10.000,00</span>
                </div>
                <div className="w-full bg-zinc-200 rounded-full h-2.5 mt-4">
                  <div className="bg-violet-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Por que doar?</h3>
              <p className="text-zinc-600 mb-4">
                Sua doação ajuda a manter este curso gratuito e de qualidade, permitindo que mais pessoas tenham acesso à educação.
              </p>
              <ul className="space-y-2 text-zinc-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                  Manutenção da plataforma
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                  Atualização do conteúdo
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                  Suporte aos alunos
                </li>
              </ul>
            </Card>
          </div>

          {/* Formulário de doação */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Escolha o valor da doação</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Button variant="outline" className="h-12 border-violet-500 text-violet-500 hover:bg-violet-50">
                R$ 10
              </Button>
              <Button variant="outline" className="h-12 border-violet-500 text-violet-500 hover:bg-violet-50">
                R$ 25
              </Button>
              <Button variant="outline" className="h-12 border-violet-500 text-violet-500 hover:bg-violet-50">
                R$ 50
              </Button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Outro valor
              </label>
              <Input 
                type="number" 
                placeholder="R$ 0,00" 
                className="bg-cyan-200 shadow-md focus:ring-2 focus:ring-violet-400"
              />
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="font-semibold">Forma de pagamento</h4>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3 h-12 border-violet-500 text-violet-500 hover:bg-violet-50">
                  <CreditCard className="w-5 h-5" />
                  Cartão de Crédito
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12 border-violet-500 text-violet-500 hover:bg-violet-50">
                  <Banknote className="w-5 h-5" />
                  Boleto Bancário
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12 border-violet-500 text-violet-500 hover:bg-violet-50">
                  <Wallet className="w-5 h-5" />
                  PIX
                </Button>
              </div>
            </div>

            <Button className="w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold shadow-md h-12">
              Confirmar Doação
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
} 