/**
 * //
 */
import * as crypto from 'crypto';
import * as moment from 'moment-timezone';
import {
  FindAndCountOptions,
  FindOptions,
  IncludeOptions,
  Op
} from 'sequelize';
import { DB } from '../model';
import { Static, types } from './../../constant';
import BaseRepository from './BaseRepo';

/**
 * //
 */
export default class AnswerRepository extends BaseRepository {
  public readonly model: DB['Answer'];
  constructor(db: DB) {
    super(db);
    this.model = db.Answer;
  }

  public async searchAnswer(
    email: string,
    examId: number,
    completedTest?: boolean
  ) {
    let whereCompletedTest: { completedTest: number | {} } = {
      completedTest: {
        [Op.or]: [{ [Op.notIn]: [1] }, { [Op.is]: null }]
      }
    };
    if (completedTest) {
      whereCompletedTest = {
        completedTest: 1
      };
    }

    const answer = await this.model.findAll({
      where: {
        email,
        examId,
        ...whereCompletedTest
      }
    });

    return answer;
  }

  public async searchAnswerByName(name: string, examId: number) {
    const answer = await this.model.findAll({
      where: {
        name,
        examId,
        completedTest: {
          [Op.or]: [{ [Op.notIn]: [1] }, { [Op.is]: null }]
        }
      }
    });

    return answer;
  }

  /**
   * Create
   */
  public async createAnswer(params: {
    examId: number;
    name: string;
    email?: string;
  }) {
    try {
      const answer = await this.model.create(params);
      return answer;
    } catch (error) {
      throw error;
    }
  }

  /**
   * check answer and delete
   */
  public async searchAnswerAndDelete(
    examId: number,
    name: string | undefined,
    email: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();
    try {
      let where: any = {
        examId,
        completedTest: {
          [Op.or]: [{ [Op.notIn]: [1] }, { [Op.is]: null }]
        }
      };
      if (name !== undefined) {
        where = { ...where, name };
      }

      if (email !== undefined) {
        where = {
          ...where,
          email
        };
      }

      const results = await this.model.findAll({
        where,
        order: [['updatedAt', 'ASC']]
      });
      const lastAnswer = results[results.length - 1];
      if (results.length > 1) {
        // delete
        const idDelete = results
          .filter((r) => r.id !== lastAnswer.id)
          .map((r) => r.id);
        await this.model.update(
          {
            deletedAt: new Date()
          },
          {
            where: { id: idDelete },
            silent: true,
            transaction
          }
        );
      }
      await transaction.commit();

      return lastAnswer;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * for start new test
   */
  public async deleteAndCreate(
    examId: number,
    name: string | undefined,
    email: string | undefined,
    user?: any
  ) {
    const transaction = await this.db.sequelize.transaction();
    try {
      let paramsCreate: any = {
        examId
      };
      let where: any = {
        examId,
        completedTest: {
          [Op.or]: [{ [Op.notIn]: [1] }, { [Op.is]: null }]
        }
      };
      if (name !== undefined) {
        where = { ...where, name };
        paramsCreate = { ...paramsCreate, name };
      }

      if (email !== undefined) {
        where = {
          ...where,
          email
        };
        paramsCreate = { ...paramsCreate, email };
        if (user) {
          paramsCreate = { ...paramsCreate, name: user.displayName };
        }
      }

      // delete all
      await this.model.update(
        {
          deletedAt: new Date()
        },
        {
          where,
          silent: true,
          transaction
        }
      );

      // create new answer
      const answer = await this.model.create(
        { ...paramsCreate },
        { transaction }
      );

      await transaction.commit();

      return answer;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * for end test
   */
  public async endTest(answer: { id: number; examId: number }) {
    try {
      const exam = await this.db.Exam.findByPk(answer.examId);
      const answerDetails = await this.db.AnswerDetail.findAll({
        where: { answerId: answer.id }
      });
      // process total score
      let totalScore: number | null = null;
      if (
        exam &&
        exam.totalPoints !== null &&
        exam.totalPoints !== undefined &&
        exam.totalPoints > 0
      ) {
        totalScore = 0;
        for (const answerDetail of answerDetails) {
          if (answerDetail.score !== null && answerDetail.score !== undefined) {
            totalScore = totalScore! + answerDetail.score;
          }
        }
      }
      // process score percentage
      let scorePercentage: number | null = null;
      if (
        totalScore !== null &&
        exam &&
        exam.totalPoints !== null &&
        exam.totalPoints !== undefined &&
        exam.totalPoints > 0
      ) {
        scorePercentage =
          Math.floor((totalScore / exam.totalPoints) * 100 * 100) / 100;
      }
      // process pass exam
      let passExam: number | null = null;
      if (exam && exam.passPercentage !== null && scorePercentage !== null) {
        // failed
        passExam = Static.passExam.FAILED;
        if (scorePercentage >= Number(exam.passPercentage!)) {
          // passed
          passExam = Static.passExam.PASSED;
        }
      }
      // process accessKey answer
      let accessToken: string | null = null;
      let isSaveExpiredAt = false;
      const completedAt = Date.now();
      if (
        (exam && exam.showResult === Static.showResult.showSubmittedWork) ||
        exam?.showResult === Static.showResult.showCorrectAnswer
      ) {
        isSaveExpiredAt = true;
        accessToken =
          String(exam.accessKey) + String(completedAt) + String(answer.id);
        for (let i = 0; i < 6; i++) {
          accessToken = crypto
            .createHash('sha256')
            .update(accessToken)
            .digest('hex');
        }
      }
      let expiredAt = null;
      // process expiredAt answer
      if (exam && exam.resultValidity !== null && isSaveExpiredAt) {
        expiredAt = moment(Date.now())
          .add(exam.resultValidity, 'm')
          .toDate();
      }
      const paramsUpdate = {
        completedTest: Static.completedTest.completed,
        totalScore,
        scorePercentage,
        passExam,
        accessToken,
        expiredAt,
        completedAt
      };
      await this.model.update(paramsUpdate, {
        where: { id: answer.id }
      });

      return { exam, ...paramsUpdate };
    } catch (err) {
      throw err;
    }
  }

  /**
   * check exist Answer
   */
  public async findById(id: number | string) {
    const answer = await this.model.findByPk(id);

    return answer;
  }

  /**
   * for A-ExamCreateEdit
   */
  public async searchAnswerByExamId(examId: number | string) {
    const answer = await this.model.findAll({
      where: {
        examId
      }
    });

    return answer;
  }

  /**
   * for A-AnswerView
   */
  public async searchAnswerById(
    answerId: number | string,
    examId: number | string
  ) {
    const findOption = this.makeFindIdOptionAnswer(answerId, examId);
    const answer = await this.model.findOne(findOption);
    // const answerData = [];
    // // let data = {};
    return answer;
  }

  public async countConditionAnswer(arrId: any[], passExam?: boolean) {
    const findOption: FindOptions = {
      where: {
        id: arrId,
        completedTest: [Static.completedTest.completed]
      }
    };
    if (passExam) {
      findOption.where = {
        ...findOption.where,
        passExam: [Static.passExam.PASSED]
      };
    }
    const countAnswer = this.model.count(findOption);
    return countAnswer;
  }

  public async searchAnswerList(params: types.answer.searchListAnswer) {
    const findOption = this.makeFindOptionSeachList(params);
    this.setOffsetLimit(findOption, params);
    const list = await this.model.findAndCountAll(findOption);
    return list;
  }

  public async deleteAnswer(answerId: number | string) {
    const transaction = await this.db.sequelize.transaction();
    try {
      await this.model.update(
        {
          deletedAt: Date.now()
        },
        {
          where: {
            id: answerId
          },
          silent: true,
          transaction
        }
      );
      await this.db.AnswerDetail.update(
        {
          deletedAt: Date.now()
        },
        {
          where: {
            answerId
          },
          silent: true,
          transaction
        }
      );
      transaction.commit();
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }

  public async findByAccessToken(
    accessToken: string,
    answerId: string | number
  ) {
    const answer = await this.model.findAll({
      where: {
        id: answerId,
        accessToken
      }
    });
    return answer;
  }

  public async saveAnswer(
    id: number | string | null,
    saveType: string,
    params: {}
  ) {
    const transaction = await this.db.sequelize.transaction();
    try {
      let answer = await this.model.findOne({
        where: { id }
      });

      if (answer) {
        // delete Exam
        if (saveType === 'delete') {
          await this.model.destroy({
            where: { id }
          });
        }
        // revert Exam
        if (saveType === 'revert') {
          await this.model.restore({
            where: { id }
          });
        }
        // update Exam
        if (saveType === 'update') {
          await answer.update(params, {
            transaction
          });
        }
      } else {
        answer = await this.model.create(params, {
          transaction
        });
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  private makeFindOptionSeachList(params: types.answer.searchListAnswer) {
    const findOption: FindAndCountOptions = {
      where: {
        examId: params.examId
      },
      order: [['id', 'ASC']]
    };
    if (!params) {
      return findOption;
    }
    if (params.examName) {
      findOption.where = {
        ...findOption.where,
        name: {
          [Op.substring]: params.examName
        }
      };
    }
    if (params.examEmail) {
      findOption.where = {
        ...findOption.where,
        email: {
          [Op.substring]: params.examEmail
        }
      };
    }
    const where = [];
    if (params.totalFrom) {
      where.push({
        totalScore: {
          [Op.gte]: params.totalFrom
        }
      });
    }
    if (params.totalTo) {
      where.push({
        totalScore: {
          [Op.lte]: params.totalTo
        }
      });
    }
    if (params.percentageFrom) {
      where.push({
        scorePercentage: {
          [Op.gte]: params.percentageFrom
        }
      });
    }
    if (params.percentageTo) {
      where.push({
        scorePercentage: {
          [Op.lte]: params.percentageTo
        }
      });
    }
    if (where.length > 0) {
      findOption.where = {
        ...findOption.where,
        [Op.and]: where
      };
    }
    if (params.result) {
      findOption.where = {
        ...findOption.where,
        passExam: {
          [Op.in]: params.result
        }
      };
    }
    if (params.status) {
      if (!(params.status instanceof Array)) {
        params.status = [params.status];
      }
      const whereComplete: any[] = [];
      params.status.forEach((status) => {
        if (Number(status) === Static.examStatusAnswer.Completed) {
          whereComplete.push({
            completedTest: Static.examStatusAnswer.Completed
          });
        } else {
          whereComplete.push(
            {
              completedTest: {
                [Op.ne]: Static.examStatusAnswer.Completed
              }
            },
            {
              completedTest: {
                [Op.is]: null
              }
            }
          );
        }
      });
      findOption.where = {
        ...findOption.where,
        [Op.or]: whereComplete
      };
    }
    return findOption;
  }

  private makeFindIdOptionAnswer(
    answerId: string | number,
    examId: string | number
  ) {
    // join with examSection table
    const examSectionInclude: IncludeOptions = {
      model: this.db.ExamSection,
      attributes: {
        exclude: [...this.extraExclude]
      }
    };
    // join with Exam table
    const examInclude: IncludeOptions = {
      model: this.db.Exam,
      where: {
        id: examId
      },
      attributes: {
        exclude: [
          'description',
          'acceptAnswer',
          'signinRestrict',
          'userRestrict',
          'limitResponse',
          'testTime',
          'totalPoints',
          'passPercentage',
          'showResult',
          'shuffleQuestion',
          'shuffleOption',
          'endMessage',
          'accessKey',
          ...this.extraExclude
        ]
      },
      include: [examSectionInclude],
      required: true,
      paranoid: false
    };

    const findOption: FindOptions = {
      where: {
        id: answerId
      },
      include: [examInclude],
      order: [['exam', 'examSection', 'sort', 'ASC']]
    };

    return findOption;
  }
}
