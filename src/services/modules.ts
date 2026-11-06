import { CategoryRepository } from "@/repositories/category.repository";
import { CommentRepository } from "@/repositories/comment.repository";
import { CourseRepository } from "@/repositories/course.repository";
import { RatingRepository } from "@/repositories/rating.repository";
import { StorageRepository } from "@/repositories/storage.repository";
import { UserRepository } from "@/repositories/user.repository";
import { CategoryService } from "./category.service";
import { CommentService } from "./comment.service";
import { CourseService } from "./course.service";
import { RatingService } from "./rating.service";
import { TokenService } from "./token.service";
import { UserService } from "./user.service";
import { ICategoryService } from "./interfaces/category-service.interface";
import { ICommentService } from "./interfaces/comment-service.interface";
import { ICourseService } from "./interfaces/course-service.interface";
import { IRatingService } from "./interfaces/rating-service.interface";
import { ITokenService } from "./interfaces/token-service.interface";
import { IUserService } from "./interfaces/user-service.interface";

const userRepository = new UserRepository();
const categoryRepository = new CategoryRepository();
const courseRepository = new CourseRepository();
const commentRepository = new CommentRepository();
const ratingRepository = new RatingRepository();
const storageRepository = new StorageRepository();

interface Modules {
  services: {
    user: IUserService;
    token: ITokenService;
    category: ICategoryService;
    course: ICourseService;
    comment: ICommentService;
    rating: IRatingService;
  };
}

export const modules: Modules = {
  services: {
    user: new UserService(userRepository),
    token: new TokenService(),
    category: new CategoryService(categoryRepository, courseRepository),
    course: new CourseService(courseRepository, categoryRepository, storageRepository),
    comment: new CommentService(commentRepository, courseRepository, userRepository),
    rating: new RatingService(ratingRepository, courseRepository, userRepository),
  },
};
