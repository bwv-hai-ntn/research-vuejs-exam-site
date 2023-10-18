/**
 * //
 */
import AnswerDetailRepository from './repo/AnswerDetailRepo';
import AnswerRepository from './repo/AnswerRepo';
import CategoryRepository from './repo/CategoryRepo';
import ExamCategoryRepository from './repo/ExamCategoryRepo';
import ExamQuestionOptionRepository from './repo/ExamQuestionOptionRepo';
import ExamQuestionRepository from './repo/ExamQuestionRepo';
import ExamRepository from './repo/ExamRepo';
import ExamSectionRepository from './repo/ExamSectionRepo';
import InformationRepository from './repo/InformationRepo';
import PickupRepository from './repo/PickupRepo';
import RecommendationRepository from './repo/RecommedationRepo';
import UserRepository from './repo/UserRepo';
import ProductsRepository from './repo/ProductsRepo';
// tslint:disable max-classes-per-file
/**
 * Exam
 */
export class Exam extends ExamRepository {}

/**
 * Answer
 */
export class Answer extends AnswerRepository {}

/**
 * AnswerDetail
 */
export class AnswerDetail extends AnswerDetailRepository {}

/**
 * ExamSection
 */
export class ExamSection extends ExamSectionRepository {}

/**
 * ExamQuestion
 */
export class ExamQuestion extends ExamQuestionRepository {}

/**
 * ExamQuestionOption
 */
export class ExamQuestionOption extends ExamQuestionOptionRepository {}

/**
 * User
 */
export class User extends UserRepository {}

/**
 * Category
 */
export class Category extends CategoryRepository {}

/**
 * ExamCategory
 */
export class ExamCategory extends ExamCategoryRepository {}

/**
 * Pickup
 */
export class Pickup extends PickupRepository {}

/**
 * Information
 */
export class Information extends InformationRepository {}

/**
 * Recommendation
 */
export class Recommendation extends RecommendationRepository {}

/**
 * Products
 */
export class Products extends ProductsRepository {}
