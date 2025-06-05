import api from "@/lib/axios";

interface DonationData {
  nome: string;
  email: string;
  valor: number;
  cursoId: number;
  mensagem?: string;
}

export const donationService = {
  create: async (data: DonationData) => {
    const response = await api.post("/donations", data);
    return response.data;
  },
}; 