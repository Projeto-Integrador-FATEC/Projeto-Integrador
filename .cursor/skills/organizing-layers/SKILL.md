---
name: organizing-layers
description: Organiza o código do projeto Next.js nas camadas model, repository e service, com toda classe service implementando uma interface. Use ao criar ou refatorar services, repositories, models, tipos de domínio, acesso ao banco via Prisma ou ao Supabase Storage, api routes, ou quando o usuário pedir para organizar a arquitetura do projeto.
---

# Organização em Model, Repository e Service

## Estrutura de pastas

```
src/
├── models/                     # Tipos de domínio (entidades e dados de entrada)
│   └── course.model.ts
├── repositories/               # Acesso a dados: única camada que usa `prisma` e `getSupabase`
│   ├── interfaces/
│   │   └── course-repository.interface.ts
│   ├── mappers.ts              # Converte linhas do Prisma em models
│   └── course.repository.ts
└── services/                   # Regras de negócio; única camada consumida pelo resto do app
    ├── interfaces/
    │   └── course-service.interface.ts
    ├── course.service.ts
    └── modules.ts              # Container: instancia repositories e services em um só lugar
```

Um arquivo por entidade em cada camada (`course`, `user`, `comment`, `donation`, `category`...). Nomes de arquivo em kebab-case com sufixo da camada: `.model.ts`, `.repository.ts`, `.service.ts`, `-service.interface.ts`, `-repository.interface.ts`.

## Responsabilidade de cada camada

| Camada | Pode importar | Não pode |
|--------|---------------|----------|
| model | nada (só tipos) | ter lógica, importar prisma |
| repository | `@/lib/prisma`, `@/lib/supabase`, `@/generated/prisma`, models | ter regra de negócio, ser usado fora dos services |
| service | interfaces de repository, models, `@/lib/http-error` | importar `@/lib/prisma` ou `@/lib/supabase` diretamente |

- **Model**: `interface`/`type` puros da entidade e dos dados de entrada (`CreateCourseData`). Schemas Zod de validação de request continuam em `src/app/DTOs` e podem usar os models como referência.
- **Repository**: uma classe por tabela (ou por serviço externo, como o Storage). Cada método faz uma query Prisma (ou chamada ao Supabase) e retorna o model, convertendo a linha com os mappers de `mappers.ts`. Nunca vaza tipos do Prisma nem campos sensíveis (`password`) sem necessidade. Não faz `console.log` nem valida regra.
- **Service**: classe que **obrigatoriamente implementa uma interface** declarando todos os seus métodos públicos. Recebe o repository pelo construtor (tipado pela interface do repository), aplica validações/regras e lança `HttpError(mensagem, status)` com mensagem em português.
- **Api route**: lê o request, chama `modules.services.<entidade>` e devolve `NextResponse.json`; no `catch`, usa `toErrorResponse(error)`.

- **Modules** (`src/services/modules.ts`): único lugar onde se usa `new` em repositories e services. Cada repository é instanciado uma vez e compartilhado entre os services que dependem dele.

Quem consome services: api routes (`src/app/api/**/route.ts`), server components e server actions, sempre via `modules` (`import { modules } from "@/services/modules"`). Nunca importar a classe do service diretamente para instanciar. Páginas `"use client"` nunca importam `modules`; chamam api routes (regra do projeto).

## Templates

### Model

```ts
// src/models/course.model.ts
export type CourseLevel = "iniciante" | "intermediario" | "avancado";

export interface Course {
  id: number;
  nome: string;
  descricao: string;
  cargaHoraria: number;
  nivel: CourseLevel;
  imagemPath?: string;
  categoria_id: number | null;
}

export interface CreateCourseData {
  nome: string;
  descricao: string;
  cargaHoraria: number;
  nivel: CourseLevel;
  provider: string;
  url: string;
  categoria_id?: number | null;
  image?: File;
}

export interface SaveCourseData extends Omit<CreateCourseData, "image"> {
  imagemPath?: string | null;
}
```

### Interface do repository

```ts
// src/repositories/interfaces/course-repository.interface.ts
import { Course, SaveCourseData } from "@/models/course.model";

export interface ICourseRepository {
  findAll(): Promise<Course[]>;
  findById(id: number): Promise<Course | null>;
  create(data: SaveCourseData): Promise<Course>;
}
```

### Repository

```ts
// src/repositories/course.repository.ts
import { prisma } from "@/lib/prisma";
import { Course, SaveCourseData } from "@/models/course.model";
import { ICourseRepository } from "./interfaces/course-repository.interface";
import { courseInclude, toCourse } from "./mappers";

export class CourseRepository implements ICourseRepository {
  async findAll(): Promise<Course[]> {
    const rows = await prisma.curso.findMany({ include: courseInclude });
    return rows.map(toCourse);
  }

  async findById(id: number): Promise<Course | null> {
    const row = await prisma.curso.findUnique({ where: { id }, include: courseInclude });
    return row ? toCourse(row) : null;
  }

  async create({ categoria_id, ...data }: SaveCourseData): Promise<Course> {
    const row = await prisma.curso.create({
      data: { ...data, categoriaId: categoria_id ?? null },
      include: courseInclude,
    });
    return toCourse(row);
  }
}
```

### Interface do service

```ts
// src/services/interfaces/course-service.interface.ts
import { Course, CreateCourseData } from "@/models/course.model";

export interface ICourseService {
  getAll(): Promise<Course[]>;
  getById(id: number): Promise<Course>;
  create(data: CreateCourseData): Promise<Course>;
}
```

### Service

```ts
// src/services/course.service.ts
import { Course, CreateCourseData } from "@/models/course.model";
import { ICourseRepository } from "@/repositories/interfaces/course-repository.interface";
import { ICourseService } from "./interfaces/course-service.interface";

export class CourseService implements ICourseService {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async getAll(): Promise<Course[]> {
    return this.courseRepository.findAll();
  }

  async getById(id: number): Promise<Course> {
    const course = await this.courseRepository.findById(id);

    if (!course) {
      throw new Error("Curso não encontrado");
    }

    return course;
  }

  async create(data: CreateCourseData): Promise<Course> {
    return this.courseRepository.create(data);
  }
}
```

O arquivo do service exporta só a classe; a instância é criada em `modules.ts`.

### Modules (container central)

```ts
// src/services/modules.ts
import { CourseRepository } from "@/repositories/course.repository";
import { CommentRepository } from "@/repositories/comment.repository";
import { UserRepository } from "@/repositories/user.repository";
import { CourseService } from "./course.service";
import { CommentService } from "./comment.service";
import { UserService } from "./user.service";
import { ICourseService } from "./interfaces/course-service.interface";
import { ICommentService } from "./interfaces/comment-service.interface";
import { IUserService } from "./interfaces/user-service.interface";

const courseRepository = new CourseRepository();
const commentRepository = new CommentRepository();
const userRepository = new UserRepository();

interface Modules {
  services: {
    course: ICourseService;
    comment: ICommentService;
    user: IUserService;
  };
}

export const modules: Modules = {
  services: {
    course: new CourseService(courseRepository),
    comment: new CommentService(commentRepository, userRepository),
    user: new UserService(userRepository),
  },
};
```

- O tipo `Modules` usa só as interfaces, então quem consome nunca depende da classe concreta.
- Chaves em camelCase com o nome da entidade (`course`, `comment`, `donation`, `category`, `user`).
- Repositories são declarados uma vez no topo e reaproveitados; nunca criar `new XRepository()` inline dentro de `services`.
- Ao criar um service novo: adicionar o import, a chave no tipo `Modules` e a instância no objeto.

### Consumo em api route

```ts
// src/app/api/courses/route.ts
import { modules } from "@/services/modules";

export async function GET() {
  const courses = await modules.services.course.getAll();
  return NextResponse.json(courses);
}
```

## Fluxo para criar ou refatorar uma funcionalidade

```
- [ ] 1. Criar/atualizar o model em src/models/<entidade>.model.ts
- [ ] 2. Criar a interface do repository e a classe que a implementa
- [ ] 3. Criar a interface do service com todos os métodos públicos
- [ ] 4. Criar a classe service com `implements I<Entidade>Service` (sem exportar instância)
- [ ] 5. Registrar repository e service em src/services/modules.ts (tipo `Modules` + objeto)
- [ ] 6. Atualizar api routes / server actions / server components para usar `modules.services.<entidade>`
- [ ] 7. Remover funções antigas de src/services e tipos duplicados
- [ ] 8. Rodar `npx tsc --noEmit` e corrigir erros
```

Ao refatorar arquivos antigos (ex.: `get-courses-service.ts`, `create-course-service.ts`, `get-course-details-service.ts`), agrupe as funções da mesma entidade em um único repository + service (`course.repository.ts` / `course.service.ts`) e mova os tipos para o model.

## Regras de verificação

- Toda classe em `src/services` tem `implements I...Service` e a interface fica em `src/services/interfaces`.
- Métodos públicos do service existem na interface; métodos auxiliares são `private`.
- `new` de repositories e services só aparece em `src/services/modules.ts`; o resto do app usa `modules.services.<entidade>`.
- Nenhum arquivo fora de `src/repositories` importa `@/lib/prisma` ou `@/lib/supabase` (exceto `prisma/seed.ts`).
- Nenhum arquivo `"use client"` importa de `@/services` ou `@/repositories`.
- Tipos de entidade vivem apenas em `src/models` (sem `interface Course` duplicada em services ou componentes).
