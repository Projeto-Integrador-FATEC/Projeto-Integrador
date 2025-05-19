import api from "@/lib/axios";

export interface CreateCourseData {
  name: string;
  description: string;
  workload: number;
  level: "iniciante" | "intermediario" | "avancado";
  image?: File;
}

export async function createCourseService(data: CreateCourseData) {
  const formData = new FormData();
  
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("workload", data.workload.toString());
  formData.append("level", data.level);
  
  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await api.post("/courses", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
} 