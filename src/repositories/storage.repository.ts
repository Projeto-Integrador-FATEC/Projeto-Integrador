import { COURSE_IMAGES_BUCKET, getSupabase } from "@/lib/supabase";
import { CourseImage } from "@/models/course.model";
import { IStorageRepository } from "./interfaces/storage-repository.interface";

export class StorageRepository implements IStorageRepository {
  async upload(path: string, file: File): Promise<void> {
    const { error } = await getSupabase()
      .storage.from(COURSE_IMAGES_BUCKET)
      .upload(path, file, { contentType: file.type || undefined, upsert: false });

    if (error) {
      throw error;
    }
  }

  async download(path: string): Promise<CourseImage | null> {
    const { data, error } = await getSupabase().storage.from(COURSE_IMAGES_BUCKET).download(path);

    if (error || !data) {
      return null;
    }

    return {
      body: await data.arrayBuffer(),
      contentType: data.type || "application/octet-stream",
    };
  }
}
