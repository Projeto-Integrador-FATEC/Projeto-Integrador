import api from "@/lib/axios";

export default function CreateUserService(email: string, password: string, name: string ) {
  return api.post(`/api/users`, {
    email,
    password,
    name
  });
}


