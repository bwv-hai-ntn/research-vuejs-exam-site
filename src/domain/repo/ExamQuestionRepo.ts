import * as _ from 'lodash';
import { literal, Op, Order, Sequelize, WhereOptions } from 'sequelize';
import { DB } from '../model';
import BaseRepository from './BaseRepo';
export default class ExamQuestionRepository extends BaseRepository {
  public readonly model: DB['ExamQuestion'];
  constructor(db: DB) {
    super(db);
    this.model = db.ExamQuestion;
  }

  /**
   * get all examQuestion by examSectionId
   */
  public async getByExamSectionId(
    examSectionId: number,
    answerId: number,
    shuffleQuestion?: number,
    shuffleOption?: number
  ) {
    // process order ramdom or not
    let order: Order = [
      ['sort', 'ASC'],
      ['id', 'ASC']
    ];
    let orderOption: Order = [
      ['sort', 'ASC'],
      ['id', 'ASC']
    ];

    if (shuffleQuestion === 1) {
      order = literal(`RAND()`);
    }

    if (shuffleOption === 1) {
      orderOption = literal(`RAND()`);
    }

    // get question father
    let questionFathers = await this.model.findAll({
      include: [
        {
          model: this.db.ExamQuestionOption,
          order: orderOption,
          separate: true
        },
        {
          model: this.db.AnswerDetail,
          required: false,
          where: {
            answerId
          }
        }
      ],
      where: {
        examSectionId,
        higherExamQuestionId: { [Op.is]: null }
      },
      order
    });
    questionFathers = JSON.parse(JSON.stringify(questionFathers));

    // get question child
    for (const questionFather of questionFathers) {
      questionFather.questionChild = await this.model.findAll({
        include: [
          {
            model: this.db.ExamQuestionOption,
            order: orderOption,
            separate: true
          },
          {
            model: this.db.AnswerDetail,
            required: false,
            where: {
              answerId
            }
          }
        ],
        where: {
          higherExamQuestionId: questionFather.id
        },
        order
      });
    }

    return questionFathers;
  }

  /**
   * find max sort
   * @param examSectionId
   */
  public async getMaxOrder(
    examSectionId: string | number,
    higherExamQuestionId?: string | number
  ) {
    let where: WhereOptions = {
      examSectionId
    };

    if (higherExamQuestionId !== undefined) {
      where = {
        ...where,
        higherExamQuestionId
      };
    }

    const examSection = await this.model.findOne({
      where,
      attributes: [[Sequelize.fn('max', Sequelize.col('sort')), 'sort']]
    });

    return examSection ? examSection.sort || 0 : 0;
  }

  public async dupplication(id: string) {
    const transaction = await this.db.sequelize.transaction();
    try {
      const question = await this.model.findByPk(id, {
        include: [{ model: this.db.ExamQuestionOption }]
      });
      const questionChild = await this.model.findAll({
        where: { higherExamQuestionId: id },
        include: [{ model: this.db.ExamQuestionOption }]
      });
      const dataOptions = [];
      let data = {};

      if (question) {
        // create new question
        const newQuestion = await this.model.create(
          {
            examSectionId: question.examSectionId,
            higherExamQuestionId: question.higherExamQuestionId,
            content: question.content,
            picturePath: question.picturePath,
            audioPath: question.audioPath,
            answerType: question.answerType,
            rightAnswerByText: question.rightAnswerByText,
            points: question.points,
            explanation: question.explanation,
            sort: question.sort
          },
          { transaction }
        );

        // copy new option of question
        for (const option of question.examQuestionOption || []) {
          dataOptions.push({
            examQuestionId: newQuestion.id,
            content: option.content,
            rightAnswer: option.rightAnswer,
            sort: option.sort
          });
        }

        // copy new questionChild
        const newQuestionChild = [];
        let i = 0;
        for (const child of questionChild) {
          newQuestionChild.push({
            examSectionId: child.examSectionId,
            higherExamQuestionId: newQuestion.id,
            content: child.content,
            picturePath: child.picturePath,
            audioPath: child.audioPath,
            answerType: child.answerType,
            rightAnswerByText: child.rightAnswerByText,
            points: child.points,
            explanation: child.explanation,
            sort: child.sort
          });

          // copy new option of questionChild
          for (const option of child.examQuestionOption || []) {
            dataOptions.push({
              examQuestionId: `no_${i}`,
              content: option.content,
              rightAnswer: option.rightAnswer,
              sort: option.sort
            });
          }

          i++;
        }

        // create new questionChild
        if (newQuestionChild.length) {
          const newChilds = await this.model.bulkCreate(newQuestionChild, {
            transaction
          });
          let newI = 0;
          for (const newChild of newChilds) {
            for (const option of dataOptions) {
              if (option.examQuestionId === `no_${newI}`) {
                option.examQuestionId = newChild.id;
              }
            }
            newI++;
          }
        }

        // create new option
        if (dataOptions.length) {
          await this.db.ExamQuestionOption.bulkCreate(dataOptions, {
            transaction
          });
        }

        // commit
        await transaction.commit();

        // re find option
        newQuestion.setDataValue(
          'questionOptions',
          await this.db.ExamQuestionOption.findAll({
            where: { examQuestionId: newQuestion.id },
            order: [
              ['sort', 'ASC'],
              ['id', 'ASC']
            ]
          })
        );
        // re find questionChild
        const reFindQuestions = await this.model.findAll({
          where: { higherExamQuestionId: newQuestion.id },
          order: [
            ['sort', 'ASC'],
            ['id', 'ASC']
          ],
          include: [
            {
              model: this.db.ExamQuestionOption,
              order: [
                ['sort', 'ASC'],
                ['id', 'ASC']
              ]
            }
          ]
        });
        for (const reFindquestion of reFindQuestions) {
          reFindquestion.setDataValue(
            'questionOptions',
            reFindquestion.examQuestionOption || []
          );
        }

        newQuestion.setDataValue('questions', reFindQuestions);

        data = newQuestion;
      }

      return data;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  /**
   * remove question
   */
  public async remove(id: string) {
    const transaction = await this.db.sequelize.transaction();
    try {
      // remove this question
      await this.model.destroy({ where: { id }, transaction });
      // get question child
      const questionChild = await this.model.findAll({
        attributes: ['id'],
        where: {
          higherExamQuestionId: id
        }
      });
      await this.model.destroy({
        where: { higherExamQuestionId: id },
        transaction
      });
      // remove options parent
      await this.db.ExamQuestionOption.destroy({
        where: { examQuestionId: id },
        transaction
      });
      // remove options children
      if (questionChild.length > 0) {
        await this.db.ExamQuestionOption.destroy({
          where: {
            examQuestionId: _.map(questionChild, 'id')
          },
          transaction
        });
      }

      // commit
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}
