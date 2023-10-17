// import { literal, Op, Order } from 'sequelize';
import * as _ from 'lodash';
import { literal, Op, Sequelize } from 'sequelize';
import { DB } from '../model';
import BaseRepository from './BaseRepo';

export default class AnswerDetailRepository extends BaseRepository {
  public readonly model: DB['AnswerDetail'];
  public readonly answerModel: DB['Answer'];
  public readonly examQuestionModel: DB['ExamQuestion'];
  public readonly examQuestionOptionModel: DB['ExamQuestionOption'];
  constructor(db: DB) {
    super(db);
    this.model = db.AnswerDetail;
    this.answerModel = db.Answer;
    this.examQuestionModel = db.ExamQuestion;
    this.examQuestionOptionModel = db.ExamQuestionOption;
  }

  public async saveAnswerData(
    params: {
      checkbox?: any;
      radio?: any;
      answerText?: string;
    },
    answer: { id: number }
  ) {
    const transaction = await this.db.sequelize.transaction();
    try {
      // save answer checkbox
      const listCheckbox = params.checkbox;
      if (listCheckbox) {
        await this.createOrUpdate(listCheckbox, answer, transaction);
      }
      // save answer radio
      const listRadio = params.radio;
      if (listRadio) {
        await this.createOrUpdate(listRadio, answer, transaction);
      }
      // save answer by text
      const listText = params.answerText;
      if (listText) {
        await this.createOrUpdate(listText, answer, transaction, true);
      }

      // Update system datetime into answer.updatedAt
      await this.answerModel.update(
        {
          id: answer.id
        },
        { where: { id: answer.id }, transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  /**
   * check answer and delete
   */
  public async searchByAnswerId(answerId: number) {
    try {
      const results = await this.model.findOne({
        where: {
          answerId
        },
        order: [
          ['updatedAt', 'DESC'],
          ['id', 'ASC']
        ]
      });

      let data: any = {};
      if (results) {
        // get examQuestion by answerId
        const examQuestionId = results?.examQuestionId
          ? results?.examQuestionId
          : '';
        const examQuestionByAnswer = await this.examQuestionModel.findOne({
          where: {
            id: examQuestionId
          }
        });
        // get all examQuestionId in the same section
        const subQuery = `SELECT examQuestion.id FROM examQuestion WHERE examQuestion.examSectionId = ${examQuestionByAnswer?.examSectionId} AND examQuestion.deletedAt IS NULL`;
        // get the last updated record
        const lastUpdatedAt = await this.model.max('updatedAt', {
          where: {
            answerId,
            examQuestionId: {
              [Op.in]: [Sequelize.literal(subQuery)]
            }
          }
        });
        // get the first created record
        const firstCreatedAt = await this.model.min('createdAt', {
          where: {
            answerId,
            examQuestionId: {
              [Op.in]: [Sequelize.literal(subQuery)]
            }
          }
        });
        // add to data
        data = {
          examSectionId: examQuestionByAnswer?.examSectionId,
          lastUpdatedAt,
          firstCreatedAt
        };
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * create or update answer detail
   * @param listCheckbox
   * @param answer
   * @param transaction
   */
  private async createOrUpdate(
    listAnswer: any,
    answer: { id: number },
    transaction: any,
    answerText?: boolean
  ) {
    for (const id of Object.keys(listAnswer)) {
      const examQuestionId = parseInt(id, 10);
      const examQuestion = await this.examQuestionModel.findByPk(
        examQuestionId
      );
      const answerDetail = await this.model.findOne({
        where: {
          answerId: answer.id,
          examQuestionId
        }
      });
      let selectedAnswer = null;
      if (listAnswer[id] instanceof Array) {
        selectedAnswer = listAnswer[id]
          .filter((e: string) => e !== '')
          .sort((a: number, b: number) => a - b)
          .join(',');
      } else if (typeof listAnswer[id] === 'string') {
        selectedAnswer = listAnswer[id];
      }

      // process score
      let score: number | undefined | null = null;
      if (answerText) {
        if (examQuestion && examQuestion.points !== null) {
          if (selectedAnswer === examQuestion.rightAnswerByText) {
            score = examQuestion.points;
          } else {
            score = 0;
          }
        }
      } else {
        const examQuestionOption = await this.examQuestionOptionModel.findOne({
          attributes: [[literal('GROUP_CONCAT(ExamQuestionOption.id)'), 'id']],
          where: {
            examQuestionId,
            rightAnswer: 1
          }
        });
        if (examQuestion && examQuestion.points !== null) {
          if (examQuestionOption && examQuestionOption.id === selectedAnswer) {
            score = examQuestion.points;
          } else {
            score = 0;
          }
        }
      }

      // case update answer detail
      if (answerDetail) {
        let paramsUpdate: any = {
          examQuestionOptionId: selectedAnswer
        };
        // save by text
        if (answerText) {
          paramsUpdate = {
            answerByText:
              typeof selectedAnswer === 'string'
                ? selectedAnswer.substr(0, 400)
                : selectedAnswer
          };
        }
        await this.model.update(
          {
            ...paramsUpdate,
            score
          },
          {
            where: { id: answerDetail.id },
            transaction
          }
        );
      } else {
        // case create new answer detail
        let paramsCreate: any = {
          answerId: answer.id,
          examQuestionId,
          score
        };
        // save by text
        if (answerText) {
          paramsCreate = {
            ...paramsCreate,
            answerByText:
              typeof selectedAnswer === 'string'
                ? selectedAnswer.substr(0, 400)
                : selectedAnswer
          };
        } else {
          paramsCreate = {
            ...paramsCreate,
            examQuestionOptionId: selectedAnswer
          };
        }

        await this.model.create(paramsCreate, {
          transaction
        });
      }
    }
  }
}
