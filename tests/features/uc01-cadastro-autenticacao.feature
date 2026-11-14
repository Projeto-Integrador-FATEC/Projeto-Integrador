# language: pt
Funcionalidade: Cadastro de usuário e autenticação
  Cenário: UC01CT01 registrar estudante e autenticar
    Dado que o e-mail "estudante.novo@fatec.sp.gov.br" não está cadastrado
    Quando o estudante "Maria Silva" se cadastra com o e-mail "estudante.novo@fatec.sp.gov.br" e a senha "senha1234"
    Então a API responde 200 com o perfil "ALUNO"
    E um e-mail de verificação é enviado para "estudante.novo@fatec.sp.gov.br"
    Quando o estudante faz login com o e-mail "estudante.novo@fatec.sp.gov.br" e a senha "senha1234"
    Então a API responde 200 com os dados do usuário e o token de sessão
