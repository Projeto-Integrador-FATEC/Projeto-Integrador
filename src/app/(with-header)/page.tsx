"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="mb-4">
      {/* Cards principais */}
      <section className="flex flex-col lg:flex-row gap-6 max-w-6xl w-full mx-auto justify-center mt-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex-1 max-w-sm"
        >
          <Card className="h-full justify-between bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 border-blue-200 dark:border-blue-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>

              <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-100 group-hover:text-blue-700 dark:group-hover:text-blue-200">
                🎓 Encontre Cursos Incríveis
              </CardTitle>

              <CardDescription className="text-blue-700 dark:text-blue-300 leading-relaxed">
                Descubra milhares de cursos gratuitos oferecidos por empresas,
                ONGs e instituições renomadas. Educação de qualidade ao seu
                alcance!
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <Link href="/cursos">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors group-hover:shadow-md">
                  Explorar Cursos →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 max-w-sm"
        >
          <Card className="h-full justify-between bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-900 border-emerald-200 dark:border-emerald-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>

              <CardTitle className="text-xl font-bold text-emerald-900 dark:text-emerald-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-200">
                💚 Apoie a Educação
              </CardTitle>

              <CardDescription className="text-emerald-700 dark:text-emerald-300 leading-relaxed">
                Faça a diferença! Torne-se um doador e ajude a democratizar o
                acesso à educação de qualidade para todos.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <Link href="/doacao">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors group-hover:shadow-md">
                  Fazer Doação →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-1 max-w-sm"
          >
            <Card className="h-full justify-between bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900 border-purple-200 dark:border-purple-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>

                <CardTitle className="text-xl font-bold text-purple-900 dark:text-purple-100 group-hover:text-purple-700 dark:group-hover:text-purple-200">
                  🚀 Compartilhe Conhecimento
                </CardTitle>

                <CardDescription className="text-purple-700 dark:text-purple-300 leading-relaxed">
                  É uma organização ou empresa? Cadastre seus cursos e ajude a
                  transformar vidas através da educação gratuita!
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <Link href="/cadastrar-curso">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors group-hover:shadow-md">
                    Cadastrar Curso →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </section>

      {/* Colaboradores */}
      <section className="max-w-6xl w-full mx-auto mt-16 px-4">
        <h2 className="text-2xl font-bold mb-8 text-zinc-900 dark:text-white">
          Conheça Alguns de Nossos Colaboradores
        </h2>

        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Card className="flex-row flex items-center gap-8 p-8 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
              <img
                src="/bradesco_img.svg"
                alt="Fundação Bradesco"
                className="w-24 h-24 object-contain"
              />

              <div>
                <div className="font-semibold mb-2 text-zinc-900 dark:text-white">
                  Fundação Bradesco
                </div>

                <div className="text-zinc-600 dark:text-zinc-400 text-sm">
                  Fundação Bradesco é uma instituição sem fins lucrativos criada
                  em 1956 pelo Bradesco, um dos maiores bancos do Brasil. Sua
                  missão é oferecer educação gratuita de qualidade e promover
                  inclusão social para crianças, jovens e adultos em situação de
                  vulnerabilidade social.
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="flex-row flex items-center gap-8 p-8 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
              <img
                src="/fgv_img.svg"
                alt="FGV Cursos Gratuitos"
                className="w-24 h-24 object-contain"
              />

              <div>
                <div className="font-semibold mb-2 text-zinc-900 dark:text-white">
                  FGV Cursos Gratuitos
                </div>

                <div className="text-zinc-600 dark:text-zinc-400 text-sm">
                  A FGV possui uma variedade de cursos gratuitos em diversas
                  áreas de atuação por conta da parceria com OEG – Open
                  Education Global. Membro desde 2008, a Fundação foi a primeira
                  instituição de ensino brasileira a integrar o consórcio de
                  países que oferecem conteúdos e materiais didáticos gratuitos
                  online.
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}