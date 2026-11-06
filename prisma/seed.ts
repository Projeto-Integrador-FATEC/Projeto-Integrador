import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL }),
});

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "cursos";
const imagesDir = path.join(process.cwd(), "prisma", "seed", "imagens");

const users = [
  { name: "Daniel", email: "daniel@gmail.com", password: "Daniel@Admin27!", role: "ADMIN" },
  { name: "Ruan", email: "ruan@gmail.com", password: "Ruan@Admin58!", role: "ADMIN" },
  { name: "Dornelas", email: "dornelas@gmail.com", password: "Dornelas@Admin41!", role: "ADMIN" },
  { name: "Gustavo", email: "gustavo@gmail.com", password: "Gustavo@Admin73!", role: "ADMIN" },
  { name: "Alexandre", email: "alexandre@gmail.com", password: "Alexandre@Admin36!", role: "ADMIN" },
  { name: "Felipe", email: "felipe@gmail.com", password: "Felipe@Admin92!", role: "ADMIN" },
  { name: "AlunoTeste", email: "aluno@gmail.com", password: "Aluno@aluno2!", role: "ALUNO" },
];

const categories = [
  { id: 1, nome: "Tecnologia & Programação" },
  { id: 2, nome: "Negócios & Empreendedorismo" },
  { id: 3, nome: "Criatividade & Design" },
  { id: 4, nome: "Carreira & Desenvolvimento Pessoal" },
  { id: 5, nome: "Bem-estar & Lifestyle" },
];

const courses = [
  {
    nome: "Curso de Java Básico",
    descricao:
      "Este curso ensina os fundamentos da linguagem Java, cobrindo sintaxe, estruturas de controle e introdução à orientação a objetos.",
    cargaHoraria: 40,
    nivel: "Iniciante",
    provider: "Alura",
    url: "https://www.alura.com.br/curso-java-basico",
    categoriaId: 1,
    imagemPath: "curso-de-programacao.webp",
  },
  {
    nome: "Empreendedorismo na Prática",
    descricao: "Aprenda conceitos fundamentais para criar, validar e gerenciar seu próprio negócio.",
    cargaHoraria: 30,
    nivel: "Intermediário",
    provider: "Sebrae",
    url: "https://sebrae.com.br/empreendedorismo-na-pratica",
    categoriaId: 2,
    imagemPath: "empreendedorismo.jpeg",
  },
  {
    nome: "Design Gráfico para Iniciantes",
    descricao:
      "Introdução a conceitos visuais, tipografia, cores e criação de layouts utilizando ferramentas de design.",
    cargaHoraria: 25,
    nivel: "Iniciante",
    provider: "Domestika",
    url: "https://domestika.org/design-grafico-basico",
    categoriaId: 3,
    imagemPath: "design-grafico.jpg",
  },
  {
    nome: "Comunicação Profissional e Oratória",
    descricao: "Aprenda a falar com clareza, confiança e assertividade em ambientes profissionais.",
    cargaHoraria: 15,
    nivel: "Iniciante",
    provider: "Udemy",
    url: "https://udemy.com/comunicacao-oratoria",
    categoriaId: 4,
    imagemPath: "comunicacao.webp",
  },
];

const contentTypes: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

async function ensureBucket() {
  const { data } = await supabase.storage.getBucket(bucket);

  if (data) {
    return;
  }

  const { error } = await supabase.storage.createBucket(bucket, { public: true });

  if (error) {
    throw error;
  }
}

async function uploadImage(fileName: string) {
  const body = await readFile(path.join(imagesDir, fileName));
  const { error } = await supabase.storage.from(bucket).upload(fileName, body, {
    contentType: contentTypes[path.extname(fileName)] ?? "application/octet-stream",
    upsert: true,
  });

  if (error) {
    throw error;
  }
}

async function main() {
  await ensureBucket();

  for (const user of users) {
    const password = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...user, password },
    });
  }

  for (const category of categories) {
    await prisma.categoria.upsert({ where: { id: category.id }, update: {}, create: category });
  }

  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('categorias', 'id'), (SELECT MAX(id) FROM categorias))`;

  for (const course of courses) {
    await uploadImage(course.imagemPath);

    const existing = await prisma.curso.findFirst({ where: { nome: course.nome } });

    if (!existing) {
      await prisma.curso.create({ data: course });
    }
  }

  console.log("Seed concluído.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
