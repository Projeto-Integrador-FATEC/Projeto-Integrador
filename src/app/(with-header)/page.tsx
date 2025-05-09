"use client";

import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mb-4">
      {/* Cards principais */}
      <section className="flex flex-col md:flex-row gap-4 max-w-6xl w-full mx-auto justify-center mt-10 px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex-1 max-w-sm">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Procure pelos melhores cursos</CardTitle>
              <CardDescription>
                O StudyLovers conta com diversas empresas, ONGs e organizações para lhe oferecer educação de qualidade
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full flex items-end">
              <Link href="/cursos" className="text-violet-600 hover:underline">Procurar Curso</Link>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex-1 max-w-sm">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Faça parte dos doadores e incentive a educação equitativa!</CardTitle>
              <CardDescription>
                No StudyLovers você pode se tornar um doador e ajudar sua instituição de ensino a fornecer mais cursos gratuitos
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full flex items-end">
              <Link href="/doacoes" className="text-violet-600 hover:underline">Fazer Doação</Link>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex-1 max-w-sm">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Cadastre seus próprios cursos</CardTitle>
              <CardDescription>
                Se você é uma ONG ou empresa e deseja fornecer cursos gratuitos, podemos ajudá-los !!
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full flex items-end">
              <Link href="/cadastro" className="text-violet-600 hover:underline">Cadastrar Curso</Link>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Colaboradores */}
      <section className="max-w-6xl w-full mx-auto mt-16 px-4">
        <h2 className="text-2xl font-bold mb-8">Conheça Alguns de Nossos Colaboradores</h2>
        <div className="flex flex-col gap-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <Card className="flex-row flex items-center gap-8 p-8">
              <Image src="/bradesco_img.svg" alt="Fundação Bradesco" width={100} height={100} className="object-contain" />
              <div>
                <div className="font-semibold mb-2">Fundação Bradesco</div>
                <div className="text-muted-foreground text-sm">
                  Fundação Bradesco é uma instituição sem fins lucrativos criada em 1956 pelo Bradesco, um dos maiores bancos do Brasil. Sua missão é oferecer educação gratuita de qualidade e promover inclusão social para crianças, jovens e adultos em situação de vulnerabilidade social.
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <Card className="flex-row flex items-center gap-8 p-8">
              <Image src="/fgv_img.svg" alt="FGV Cursos Gratuitos" width={100} height={100} className="object-contain" />
              <div>
                <div className="font-semibold mb-2">FGV Cursos Gratuitos</div>
                <div className="text-muted-foreground text-sm">
                  A FGV possui uma variedade de cursos gratuitos em diversas áreas de atuação por conta da parceria com OEG – Open Education Global. Membro desde 2008, a Fundação foi a primeira instituição de ensino brasileira a integrar o consórcio de países que oferecem conteúdos e materiais didáticos gratuitos online.
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 