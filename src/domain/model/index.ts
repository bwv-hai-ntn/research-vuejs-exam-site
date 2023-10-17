/**
 * //
 */
import { values } from 'lodash';
import * as Sequelize from 'sequelize';
import answerDetail, { AnswerDetail } from './AnswerDetailModel';
import answer, { Answer } from './AnswerModel';
import category, { Category } from './CategoryModel';
import examCategory, { ExamCategory } from './ExamCategoryModel';
import exam, { Exam } from './ExamModel';
import examQuestion, { ExamQuestion } from './ExamQuestionModel';
import examQuestionOption, {
  ExamQuestionOption
} from './ExamQuestionOptionModel';
import examSection, { ExamSection } from './ExamSectionModel';
import information, { Information } from './InformationModel';
import pickupDetail, { PickupDetail } from './PickupDetailModel';
import pickup, { Pickup } from './PickupModel';
import recommendation, { Recommendation } from './RecommendationModel';
import userCategory, { UserCategory } from './UserCategoryModel';
import user, { User } from './UserModel';

export type DB = ReturnType<typeof initialize>;

export const initialize = (sqlize: Sequelize.Sequelize) => {
  const db = {
    Exam: sqlize.import(Exam.name, exam),
    Answer: sqlize.import(Answer.name, answer),
    ExamSection: sqlize.import(ExamSection.name, examSection),
    ExamQuestion: sqlize.import(ExamQuestion.name, examQuestion),
    ExamQuestionOption: sqlize.import(
      ExamQuestionOption.name,
      examQuestionOption
    ),
    AnswerDetail: sqlize.import(AnswerDetail.name, answerDetail),
    User: sqlize.import(User.name, user),
    Category: sqlize.import(Category.name, category),
    UserCategory: sqlize.import(UserCategory.name, userCategory),
    ExamCategory: sqlize.import(ExamCategory.name, examCategory),
    Pickup: sqlize.import(Pickup.name, pickup),
    PickupDetail: sqlize.import(PickupDetail.name, pickupDetail),
    Information: sqlize.import(Information.name, information),
    Recommendation: sqlize.import(Recommendation.name, recommendation)
  };

  // initialize all association of all model
  for (const model of values(db)) {
    if (typeof model.ASSOCIATE === 'function') {
      model.ASSOCIATE();
    }
  }

  return {
    ...db,
    sequelize: sqlize,
    Sequelize
  };
};
