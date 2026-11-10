# language: pt
Funcionalidade: Publicação de comentário em curso
  Cenário: UC02CT01 incluir comentário em curso existente e rejeitar curso ausente
    Dado que existe o usuário "estudante@fatec.sp.gov.br" e o curso 10
    Quando é enviado POST /api/comentarios com o texto "Conteúdo excelente" para o curso 10 e o e-mail "estudante@fatec.sp.gov.br"
    Então o comentário é persistido com a data atual
    Quando é enviado GET /api/comentarios/curso/10
    Então a API responde 200 com a lista contendo "Conteúdo excelente"
    Quando é enviado POST /api/comentarios com o texto "Não gravar" para o curso 9999 e o e-mail "estudante@fatec.sp.gov.br"
    Então a API responde 404 com a mensagem "Curso não encontrado"
    E o comentário do curso inexistente não é persistido
