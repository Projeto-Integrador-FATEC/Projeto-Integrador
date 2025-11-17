export interface Category {
  id: number;
  nome: string;
}

export const CATEGORIAS: Category[] = [
  { id: 1, nome: "Tecnologia & Programação" },
  { id: 2, nome: "Negócios & Empreendedorismo" },
  { id: 3, nome: "Criatividade & Design" },
  { id: 4, nome: "Carreira & Desenvolvimento Pessoal" },
  { id: 5, nome: "Bem-estar & Lifestyle" },
];

export function getCategories(): Category[] {
  return CATEGORIAS;
}

export function getCategoryById(id: number): Category | undefined {
  return CATEGORIAS.find((cat) => cat.id === id);
}

export function getCategoryByName(nome: string): Category | undefined {
  return CATEGORIAS.find((cat) => cat.nome === nome);
}

