import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

async function checkLogin(req, res, next) {
  try {
    // Obtém o cookie do email
    const email = req.cookies?.usuarioEmail;

    if (!email) {
      return res.redirect("/login");
    }

    // Busca o usuário no banco de dados
    const {data} = await axios.get(`http://localhost:8080/api/users/get-user-by-email/${email}`);

    if (!data.email) {
        return res.redirect("/login");
    }

    // Adiciona o usuário ao objeto de requisição para uso futuro
    req.user = data.email;
    next(); // Usuário autenticado, prosseguir para o próximo middleware
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  } finally {
    await prisma.$disconnect();
  }
}

export default checkLogin;
