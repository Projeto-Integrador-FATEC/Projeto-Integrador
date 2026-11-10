# language: pt
Funcionalidade: Busca e filtragem por categoria
  Cenário: UC03CT01 filtrar cursos por categoria e por nome
    Dado que existem cursos nas categorias "Tecnologia" e "Gestão"
    Quando a aplicação consulta GET /api/categorias
    E o filtro da categoria "Tecnologia" é aplicado
    Então a lista contém somente cursos dessa categoria
    Quando o termo "gest" é digitado na busca
    Então a lista fica restrita aos cursos cujo nome contém o termo
    E o tempo de resposta do endpoint de cursos é inferior a 1 segundo
