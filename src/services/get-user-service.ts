import api from "@/lib/axios";

export default function LoginService(email: string, password: string) {
  return api.post(`/api/users/login`, {
    email,
    password,
    name: "teste"
  });
}


