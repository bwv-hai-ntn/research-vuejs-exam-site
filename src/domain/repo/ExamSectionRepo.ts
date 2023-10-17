import { FindOptions, IncludeOptions, Op, Sequelize } from 'sequelize';
import { DB } from '../model';
import { Static } from './../../constant';
import BaseRepository from './BaseRepo';

export default class ExamSectionRepository extends BaseRepository {
  public readonly model: DB['ExamSection'];
  constructor(db: DB) {
    super(db);
    this.model = db.ExamSection;
  }

  /**
   * get all examSection by examId
   */
  public async getByExamId(examId: string | number) {
    const rows = await this.model.findAll({
      where: {
        examId
      },
      order: [
        ['sort', 'ASC'],
        ['id', 'ASC']
      ]
    });

    return rows;
  }

  /**
   * get point examSection by examId
   */
  public async getPointByExamId(examId: string) {
    const findOption = this.makeFindIdOption(examId);
    const examSections = await this.model.findAll(findOption);
    let totalPoints = 0;
    if (examSections.length > 0) {
      for (const examSection of examSections) {
        if (examSection?.examQuestion) {
          for (const question of examSection?.examQuestion) {
            const point = question.points ? question.points : 0;
            totalPoints += point;
          }
        }
      }
    }

    return totalPoints;
  }

  /**
   * delete examSection
   * @param examSectionId
   */
  public async deleteSection(examSectionId: string) {
    const transaction = await this.db.sequelize.transaction();
    try {
      // delete examSection
      await this.model.destroy({
        where: { id: examSectionId },
        transaction
      });

      // find examQuestion
      const examQuestions = await this.db.ExamQuestion.findAll({
        where: {
          examSectionId
        }
      });

      if (examQuestions.length) {
        // delete examQuestion
        await this.db.ExamQuestion.destroy({
          where: { examSectionId },
          transaction
        });

        // delete examQuestionOption
        await this.db.ExamQuestionOption.destroy({
          where: { examQuestionId: examQuestions.map((e) => e.id) },
          transaction
        });
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  /**
   * find max examSection.sort
   * @param examId
   */
  public async getMaxOrder(examId: string | number) {
    const examSection = await this.model.findOne({
      where: { examId },
      attributes: [[Sequelize.fn('max', Sequelize.col('sort')), 'sort']]
    });

    return examSection ? examSection.sort || 0 : 0;
  }

  private makeFindIdOption(examId: string | number) {
    // join with examQuestion table
    const examQuestionInclude: IncludeOptions = {
      model: this.db.ExamQuestion,
      where: {
        answerType: { [Op.ne]: Static.answerType['No answer'] }
      },
      attributes: {
        exclude: [
          'examSectionId',
          'higherExamQuestionId',
          'content',
          'picturePath',
          'audioPath',
          'answerType',
          'rightAnswerByText',
          'sort',
          ...this.extraExclude
        ]
      }
    };
    const findOption: FindOptions = {
      where: {
        examId
      },
      include: [examQuestionInclude],
      attributes: {
        exclude: [
          'examId',
          'title',
          'description',
          'sort',
          ...this.extraExclude
        ]
      }
    };

    return findOption;
  }
}
