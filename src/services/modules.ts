import { AuthRepository } from "@/repositories/auth.repository";
import { CategoryRepository } from "@/repositories/category.repository";
import { ChatRepository } from "@/repositories/chat.repository";
import { CommentRepository } from "@/repositories/comment.repository";
import { ConversationRepository } from "@/repositories/conversation.repository";
import { CourseRepository } from "@/repositories/course.repository";
import { EmailRepository } from "@/repositories/email.repository";
import { IConversationRepository } from "@/repositories/interfaces/conversation-repository.interface";
import { RatingRepository } from "@/repositories/rating.repository";
import { StorageRepository } from "@/repositories/storage.repository";
import { UserRepository } from "@/repositories/user.repository";
import { CategoryService } from "./category.service";
import { ChatService } from "./chat.service";
import { CommentService } from "./comment.service";
import { CourseService } from "./course.service";
import { EmailService } from "./email.service";
import { ICategoryService } from "./interfaces/category-service.interface";
import { IChatService } from "./interfaces/chat-service.interface";
import { ICommentService } from "./interfaces/comment-service.interface";
import { ICourseService } from "./interfaces/course-service.interface";
import { IEmailService } from "./interfaces/email-service.interface";
import { IRatingService } from "./interfaces/rating-service.interface";
import { IRecommenderService } from "./interfaces/recommender-service.interface";
import { IUserService } from "./interfaces/user-service.interface";
import { RatingService } from "./rating.service";
import { RecommenderService } from "./recommender.service";
import { UserService } from "./user.service";

const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const categoryRepository = new CategoryRepository();
const courseRepository = new CourseRepository();
const commentRepository = new CommentRepository();
const ratingRepository = new RatingRepository();
const storageRepository = new StorageRepository();
const emailRepository = new EmailRepository();
const chatRepository = new ChatRepository();
const conversationRepository = new ConversationRepository();

const categoryService = new CategoryService(categoryRepository, courseRepository);
const courseService = new CourseService(courseRepository, categoryRepository, storageRepository);
const ratingService = new RatingService(ratingRepository, courseRepository, userRepository);
const recommenderService = new RecommenderService();

interface Modules {
  services: {
    user: IUserService;
    category: ICategoryService;
    course: ICourseService;
    comment: ICommentService;
    rating: IRatingService;
    email: IEmailService;
    chat: IChatService;
    recommender: IRecommenderService;
  };
  repositories: {
    conversation: IConversationRepository;
  };
}

export const modules: Modules = {
  services: {
    user: new UserService(userRepository, authRepository),
    category: categoryService,
    course: courseService,
    comment: new CommentService(commentRepository, courseRepository, userRepository),
    rating: ratingService,
    email: new EmailService(emailRepository),
    chat: new ChatService(
      chatRepository,
      courseService,
      categoryService,
      ratingService,
      recommenderService,
      conversationRepository,
    ),
    recommender: recommenderService,
  },
  repositories: {
    conversation: conversationRepository,
  },
};
