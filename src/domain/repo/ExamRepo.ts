/**
 * //
 */
import { NOT_FOUND } from 'http-status';
import { FindOptions, IncludeOptions, Op } from 'sequelize';
import * as factory from '../../constant/types';
import { DB } from '../model';
import { ExamCategory } from '../model/ExamCategoryModel';
import { Static } from './../../constant';
import BaseRepository from './BaseRepo';

/**
 * //
 */
export default class ExamRepository extends BaseRepository {
  public readonly model: DB['Exam'];
  public readonly modelExamSection: DB['ExamSection'];
  public readonly modelExamQuestion: DB['ExamQuestion'];
  public readonly modelExamQuestionOption: DB['ExamQuestionOption'];
  public readonly modelExamCategory: DB['ExamCategory'];
  constructor(db: DB) {
    super(db);
    this.model = db.Exam;
    this.modelExamSection = db.ExamSection;
    this.modelExamQuestion = db.ExamQuestion;
    this.modelExamQuestionOption = db.ExamQuestionOption;
    this.modelExamCategory = db.ExamCategory;
  }

  public async searchExam(accessKey: string) {
    const exam = await this.model.findAll({
      where: {
        accessKey
      }
    });

    return exam;
  }

  public async searchListExamById(idList: number[]) {
    const exams = await this.model.findAll({
      where: {
        id: idList,
        deletedAt: null
      },
      attributes: ['id', 'title', 'description', 'accessKey']
    });

    return exams;
  }

  public async checkDuplicateAccessKey(
    accessKey: string,
    examId: number | string | null
  ) {
    let whereById: any = null;
    if (examId) {
      whereById = {
        id: { [Op.not]: examId }
      };
    }
    const exam = await this.model.findAll({
      where: {
        accessKey,
        ...whereById
      },
      paranoid: false
    });

    return exam;
  }

  public async findById(id: string | number) {
    const exam = await this.model.findByPk(id);

    return exam;
  }

  public async findByIdForCreateEdit(id: string) {
    return this.model.findByPk(id, { paranoid: false });
  }

  public async findAllById(id: string) {
    const exam = await this.model.findOne({
      where: {
        id
      },
      paranoid: false
    });

    return exam;
  }

  public async findByConditions(
    examId: string | number,
    userId: string | number,
    userFlag: string | number
  ) {
    const findOption = this.makeFindIdOptionExam(examId, userId, userFlag);
    const exam = await this.model.findOne(findOption);

    return exam;
  }

  public async saveExam(
    examId: number | string | null,
    saveType: string,
    params: {}
  ) {
    const transaction = await this.db.sequelize.transaction();
    try {
      let exam = await this.model.findOne({
        where: { id: examId },
        paranoid: false
      });

      if (exam) {
        // delete Exam
        if (saveType === 'delete') {
          await this.model.destroy({
            where: { id: examId }
          });
        }
        // revert Exam
        if (saveType === 'revert') {
          await this.model.restore({
            where: { id: examId }
          });
        }
        // update Exam
        if (saveType === 'update') {
          await exam.update(params, {
            transaction
          });
        }
      } else {
        exam = await this.model.create(params, {
          transaction
        });
      }

      await transaction.commit();
      return { id: exam.id };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  public async copyExamWithConstraints(examId: string | number, params: {}) {
    const transaction = await this.db.sequelize.transaction();
    try {
      // create Exam
      const examCopy = await this.model.create(params, {
        transaction
      });

      // get exam for copy
      const exam = await this.findAllById(examId.toString());
      if (exam) {
        // get examCategory
        const examCategorys = await this.modelExamCategory.findAll({
          where: {
            examId: exam.id
          }
        });
        // create data copy for examCategory
        const categoriesData = [];
        for (const examCategorysData of examCategorys) {
          categoriesData.push({
            examId: examCopy?.id,
            categoryId: examCategorysData?.categoryId
          });
        }
        // create examCategory
        await this.modelExamCategory.bulkCreate(categoriesData, {
          transaction
        });
        // get examSection
        const examSections = await this.modelExamSection.findAll({
          where: {
            examId: exam.id
          }
        });
        const examSectionIds = [];
        const sectionDatas = [];
        const questionFartherHasChildDatas = [];
        const questionFartherDatas = [];
        const questionChildDatas = [];
        const questionOptionFatherHasChildDatas = [];
        const questionOptionFatherDatas = [];
        const questionOptionChildDatas = [];
        for (const examSectionData of examSections) {
          // create data copy for examSection
          sectionDatas.push({
            examId: examCopy?.id,
            title: examSectionData?.title,
            description: examSectionData?.description,
            testTime: examSectionData?.testTime,
            sort: examSectionData?.sort
          });
          // get examSection id for copy
          examSectionIds.push(examSectionData?.id);
        }
        // create examSection
        const examSectionsCopy = await this.modelExamSection.bulkCreate(
          sectionDatas,
          {
            transaction
          }
        );
        // get question father
        let questionFathers = await this.modelExamQuestion.findAll({
          include: [
            {
              model: this.db.ExamQuestionOption,
              separate: true
            }
          ],
          where: {
            examSectionId: { [Op.in]: examSectionIds },
            higherExamQuestionId: { [Op.is]: null }
          }
        });
        questionFathers = JSON.parse(JSON.stringify(questionFathers));
        // get question child
        for (const questionFather of questionFathers) {
          questionFather.questionChild = await this.modelExamQuestion.findAll({
            include: [
              {
                model: this.db.ExamQuestionOption,
                separate: true
              }
            ],
            where: {
              examSectionId: { [Op.in]: examSectionIds },
              higherExamQuestionId: questionFather.id
            }
          });
        }
        // create examQuestion
        let sectionContinue = 0;
        let questionOptionKey = 0;
        let fatherKey = 0;
        let questionChildKey = 0;
        const oldQuestions: number[] = [];
        for (const examSec of examSectionsCopy) {
          for (const questionFather of questionFathers) {
            // ignores the question that was run in the previous loop
            if (oldQuestions.includes(questionFather.id)) {
              continue;
            }
            oldQuestions.push(questionFather.id);
            if (questionFathers.indexOf(questionFather) > 0) {
              const sectionBreak =
                questionFathers[questionFathers.indexOf(questionFather) - 1]
                  .examSectionId;
              if (sectionBreak !== sectionContinue) {
                if (questionFather.examSectionId !== sectionBreak) {
                  // remove questionId if examSectionId is different
                  oldQuestions.splice(
                    questionFathers.indexOf(questionFather),
                    1
                  );
                  sectionContinue = sectionBreak;
                  break;
                }
              }
            }
            // question has childs
            if (
              questionFather.questionChild &&
              questionFather.questionChild.length > 0
            ) {
              // create data copy for questionFarther
              questionFartherHasChildDatas.push({
                examSectionId: examSec?.id,
                higherExamQuestionId: null,
                content: questionFather?.content,
                picturePath: questionFather?.picturePath,
                audioPath: questionFather?.audioPath,
                answerType: questionFather?.answerType,
                rightAnswerByText: questionFather?.rightAnswerByText,
                explanation: questionFather?.explanation,
                points: questionFather?.points,
                sort: questionFather?.sort
              });
              // create examQuestionOption of examQuestion father
              if (questionFather.examQuestionOption !== undefined) {
                for (const questionFatherOption of questionFather?.examQuestionOption) {
                  // create data copy for questionFatherOption
                  questionOptionFatherHasChildDatas.push({
                    examQuestionId: fatherKey,
                    content: questionFatherOption?.content,
                    rightAnswer: questionFatherOption?.rightAnswer,
                    sort: questionFatherOption?.sort
                  });
                }
              }
              for (const questionChild of questionFather?.questionChild) {
                // create data copy for questionChild
                questionChildDatas.push({
                  examSectionId: examSec?.id,
                  higherExamQuestionId: fatherKey,
                  content: questionChild?.content,
                  picturePath: questionChild?.picturePath,
                  audioPath: questionChild?.audioPath,
                  answerType: questionChild?.answerType,
                  rightAnswerByText: questionChild?.rightAnswerByText,
                  explanation: questionChild?.explanation,
                  points: questionChild?.points,
                  sort: questionChild?.sort
                });
                // create examQuestionOption of examQuestion child
                if (
                  questionChild.examQuestionOption &&
                  questionChild.examQuestionOption.length > 0
                ) {
                  for (const questionChildOption of questionChild?.examQuestionOption) {
                    // create data copy for questionChildOption
                    questionOptionChildDatas.push({
                      examQuestionId: questionChildKey,
                      content: questionChildOption?.content,
                      rightAnswer: questionChildOption?.rightAnswer,
                      sort: questionChildOption?.sort
                    });
                  }
                }
                questionChildKey++;
              }
              fatherKey++;
            } else {
              // create data copy for questionFarther
              questionFartherDatas.push({
                examSectionId: examSec?.id,
                higherExamQuestionId: null,
                content: questionFather?.content,
                picturePath: questionFather?.picturePath,
                audioPath: questionFather?.audioPath,
                answerType: questionFather?.answerType,
                rightAnswerByText: questionFather?.rightAnswerByText,
                explanation: questionFather?.explanation,
                points: questionFather?.points,
                sort: questionFather?.sort
              });
              if (questionFather.examQuestionOption !== undefined) {
                for (const questionFatherOption of questionFather?.examQuestionOption) {
                  // create data copy for questionFatherOption
                  questionOptionFatherDatas.push({
                    examQuestionId: questionOptionKey,
                    content: questionFatherOption?.content,
                    rightAnswer: questionFatherOption?.rightAnswer,
                    sort: questionFatherOption?.sort
                  });
                }
              }
              questionOptionKey++;
            }
          }
        }
        // create examQuestion father has child
        const questionFathersHasChildCopy = await this.modelExamQuestion.bulkCreate(
          questionFartherHasChildDatas,
          {
            transaction
          }
        );
        let fatherKeyChild = 0;
        for (const quesFatherHasChild of questionFathersHasChildCopy) {
          // reset questionId to questionChild
          for (const quesChild of questionChildDatas) {
            if (quesChild.higherExamQuestionId === fatherKeyChild) {
              quesChild.higherExamQuestionId = quesFatherHasChild.id;
            }
          }
          // reset questionId to questionOptionFatherHasChild
          for (const questionOptionFartherHasChild of questionOptionFatherHasChildDatas) {
            if (
              questionOptionFartherHasChild.examQuestionId === fatherKeyChild
            ) {
              questionOptionFartherHasChild.examQuestionId =
                quesFatherHasChild.id;
            }
          }
          fatherKeyChild++;
        }
        // create examQuestionOptionFather has child
        await this.modelExamQuestionOption.bulkCreate(
          questionOptionFatherHasChildDatas,
          {
            transaction
          }
        );
        // create examQuestion child
        const questionsChildCopy = await this.modelExamQuestion.bulkCreate(
          questionChildDatas,
          {
            transaction
          }
        );
        let questionKeyChild = 0;
        for (const questionChild of questionsChildCopy) {
          for (const questionOptionChild of questionOptionChildDatas) {
            if (questionOptionChild.examQuestionId === questionKeyChild) {
              questionOptionChild.examQuestionId = questionChild.id;
            }
          }
          questionKeyChild++;
        }
        // create examQuestionOption child
        await this.modelExamQuestionOption.bulkCreate(
          questionOptionChildDatas,
          {
            transaction
          }
        );
        // create examQuestion father
        const questionFathersCopy = await this.modelExamQuestion.bulkCreate(
          questionFartherDatas,
          {
            transaction
          }
        );
        let questionOptionKeyChild = 0;
        for (const quesFather of questionFathersCopy) {
          for (const questionOptionFarther of questionOptionFatherDatas) {
            if (
              questionOptionFarther.examQuestionId === questionOptionKeyChild
            ) {
              questionOptionFarther.examQuestionId = quesFather.id;
            }
          }
          questionOptionKeyChild++;
        }
        // create examQuestionOption father
        await this.modelExamQuestionOption.bulkCreate(
          questionOptionFatherDatas,
          {
            transaction
          }
        );
      }

      await transaction.commit();
      return { id: examCopy.id };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  public async searchListExam(
    params: factory.exam.searchListExam,
    userId: number | string,
    authority: number | string
  ) {
    const findOption = await this.makeFindOption(params, userId, authority);
    if (params?.limitFlag !== undefined) {
      params.limit = await this.model.count({
        paranoid: false
      });
    }
    this.setOffsetLimit(findOption, params);
    const { rows, count } = await this.model.findAndCountAll(findOption);
    const exams = [];
    for (const item of rows) {
      // get categoryName
      const category = [];
      const categoryId = [];
      if (item?.examCategory) {
        for (const examCategory of item?.examCategory) {
          if (params.category !== undefined && params.category !== '') {
            let listUserCategoryId: any = [];
            if (authority === Static.authority.AUTHOR) {
              listUserCategoryId = await this.userCategoryId(userId);
            }
            let newExamCategory: ExamCategory[];
            if (listUserCategoryId.length > 0) {
              newExamCategory = await this.db.ExamCategory.findAll({
                include: [this.db.Category],
                where: {
                  examId: examCategory?.examId,
                  categoryId: { [Op.in]: listUserCategoryId }
                }
              });
            } else {
              newExamCategory = await this.db.ExamCategory.findAll({
                include: [this.db.Category],
                where: {
                  examId: examCategory?.examId
                }
              });
            }
            for (const i of newExamCategory) {
              if (i?.category?.name !== undefined) {
                category.push(i?.category?.name);
              }
              categoryId.push(i?.categoryId);
            }
          } else {
            if (examCategory?.category?.name !== undefined) {
              category.push(examCategory?.category?.name);
              categoryId.push(examCategory?.category?.id);
            }
          }
        }
      }
      const categoryName = category.join(', ');
      // get testTime when testTimeSetting = 2
      let testTimeTotal = 0;
      if (item?.examSection) {
        for (const examSection of item?.examSection) {
          const testTimeSection = examSection.testTime
            ? examSection.testTime
            : 0;
          testTimeTotal += testTimeSection;
        }
      }
      // get number of question
      const countExamQuestion = this.countExamQuestion(item?.id);
      const result = await this.model.count(countExamQuestion);
      exams.push({
        id: item?.id,
        title: item?.title,
        accessKey: item?.accessKey,
        description: item?.description,
        categoryName,
        categoryId,
        acceptAnswer: item?.acceptAnswer,
        signinRestrict: item?.signinRestrict,
        userRestrict: item?.userRestrict,
        limitResponse: item?.limitResponse,
        testTimeSetting: item?.testTimeSetting,
        testTime: item?.testTime,
        testTimeTotal,
        questions: result,
        totalPoints: item?.totalPoints,
        passPercentage: item?.passPercentage,
        showResult: item?.showResult,
        shuffleQuestion: item?.shuffleQuestion,
        shuffleOption: item?.shuffleOption,
        deleted: item?.deletedAt,
        resultValidity: item?.resultValidity
      });
    }
    return { rows: { exams }, count };
  }

  public async deleteAndRevert(id: number | string, flag: string) {
    if (flag === 'delete') {
      await this.model.destroy({
        where: {
          id
        }
      });
      return { status: 'ok' };
    }
    if (flag === 'revert') {
      await this.model.restore({
        where: {
          id
        }
      });
      return { status: 'ok' };
    }
    return { status: 'fail' };
  }

  public async saveExamCategory(params: factory.exam.updateExamCategory) {
    let listIdAdd: number[] | string[] = [];
    let listIdDelete: number[] | string[] = [];
    if (params.cbxCategory !== undefined) {
      if (params.constCbxCategory !== undefined) {
        for (const item of params.constCbxCategory) {
          if (!params.cbxCategory.includes(item)) {
            listIdDelete.push(item);
          }
        }
        for (const item of params.cbxCategory) {
          if (
            !params.constCbxCategory.includes(item) &&
            !listIdDelete.includes(item)
          ) {
            listIdAdd.push(item);
          }
        }
      } else {
        listIdAdd = params.cbxCategory;
      }
    } else {
      listIdDelete = params.constCbxCategory;
    }
    const transaction = await this.db.sequelize.transaction();
    try {
      if (listIdAdd.length > 0) {
        for (const item of listIdAdd) {
          await this.db.ExamCategory.create(
            {
              examId: params.examId,
              categoryId: item
            },
            {
              transaction
            }
          );
        }
      }
      if (listIdDelete.length > 0) {
        await this.db.ExamCategory.destroy({
          where: {
            examId: params.examId,
            categoryId: { [Op.in]: listIdDelete }
          },
          transaction
        });
      }
      await transaction.commit();
      return { status: 'ok' };
    } catch (error) {
      await transaction.rollback();
      return error;
    }
  }

  public async getExam(examId: string | number) {
    const exam = await this.model.findOne({
      where: {
        id: examId
      },
      paranoid: false
    });
    if (!exam) {
      throw { NOT_FOUND };
    }
    return exam;
  }

  private makeFindIdOptionExam(
    examId: string | number,
    userId: string | number,
    userFlag: string | number
  ) {
    // join with Category table
    const categoryInclude: IncludeOptions = {
      model: this.db.Category,
      attributes: {
        exclude: ['name', ...this.extraExclude]
      },
      include: [
        {
          model: this.db.UserCategory,
          attributes: {
            exclude: ['userId', 'categoryId', ...this.extraExclude]
          },
          where: {
            userId
          },
          required: true
        }
      ],
      required: true
    };
    // join with examCategory table
    const examCategoryInclude: IncludeOptions = {
      model: this.db.ExamCategory,
      attributes: {
        exclude: ['examId', 'categoryId', ...this.extraExclude]
      },
      where: {
        examId
      },
      include: [categoryInclude],
      required: true
    };
    const findOption: FindOptions = {
      where: {
        id: examId
      },
      paranoid: false
    };
    // join with examQuestionOption table
    const examQuestionOptionInclude: IncludeOptions = {
      model: this.db.ExamQuestionOption,
      attributes: {
        exclude: [...this.extraExclude]
      }
    };
    // join with examQuestion table
    const examQuestionInclude: IncludeOptions = {
      model: this.db.ExamQuestion,
      include: [examQuestionOptionInclude],
      attributes: {
        exclude: [...this.extraExclude]
      }
    };
    // join with examSection table
    const examSectionInclude: IncludeOptions = {
      model: this.db.ExamSection,
      include: [examQuestionInclude],
      attributes: {
        exclude: [...this.extraExclude]
      }
    };
    // with userFlag = 1
    let includeConstraints: any[] = [];
    if (userFlag === Static.authority.AUTHOR) {
      includeConstraints = [examCategoryInclude];
    }
    includeConstraints = [...includeConstraints, examSectionInclude];
    findOption.include = includeConstraints;

    return findOption;
  }

  private async userCategoryId(userId: string | number) {
    const listUserCategoryId = [];
    const userCategory = await this.db.UserCategory.findAll({
      where: {
        userId
      }
    });
    for (const item of userCategory) {
      listUserCategoryId.push(item.categoryId);
    }
    return listUserCategoryId;
  }

  private async makeFindOption(
    params: factory.exam.searchListExam,
    userId: number | string,
    authority: number | string
  ) {
    const categoryIncludeOption: IncludeOptions = {
      model: this.db.Category
    };
    let examCategoryIncludeOption: IncludeOptions = {};
    if (authority === Static.authority.AUTHOR) {
      const listUserCategoryId = await this.userCategoryId(userId);
      examCategoryIncludeOption = {
        model: this.db.ExamCategory,
        include: [categoryIncludeOption],
        where: {
          categoryId: { [Op.in]: listUserCategoryId }
        }
      };
    } else {
      examCategoryIncludeOption = {
        model: this.db.ExamCategory,
        include: [categoryIncludeOption]
      };
    }

    // join with examSection table
    const examSectionInclude: IncludeOptions = {
      model: this.db.ExamSection,
      attributes: {
        exclude: [...this.extraExclude]
      }
    };
    const findOption: FindOptions = {
      include: [examCategoryIncludeOption, examSectionInclude],
      group: ['id']
    };
    if (params !== undefined) {
      if (params.title !== undefined && params.title !== '') {
        findOption.where = {
          ...findOption.where,
          title: { [Op.like]: `%${params.title}%` }
        };
      }
      if (params.description !== undefined && params.description !== '') {
        findOption.where = {
          ...findOption.where,
          description: { [Op.like]: `%${params.description}%` }
        };
      }
      if (params.accessKey !== undefined && params.accessKey !== '') {
        findOption.where = {
          ...findOption.where,
          accessKey: { [Op.like]: `%${params.accessKey}%` }
        };
      }
      if (params.category !== undefined && params.category !== '') {
        examCategoryIncludeOption.where = {
          ...examCategoryIncludeOption.where,
          categoryId: params.category
        };
      }
      if (params.status !== undefined) {
        if (Array.isArray(params.status)) {
          if (params.status.length >= 2) {
            findOption.paranoid = false;
          } else {
            if (
              params.status.indexOf(
                Static.examListCheckBox.Deleted.toString()
              ) !== -1
            ) {
              findOption.paranoid = false;
              findOption.where = {
                ...findOption.where,
                deletedAt: { [Op.not]: null }
              };
            } else if (params.status.indexOf('') !== -1) {
              findOption.paranoid = false;
            }
          }
        }
      }
    }
    findOption.order = [['id', 'ASC']];
    return findOption;
  }

  private countExamQuestion(examId: number | string) {
    const examQuestionIncludeOption: IncludeOptions = {
      model: this.db.ExamQuestion,
      required: true,
      where: {
        answerType: { [Op.ne]: Static.answerType['No answer'] }
      }
    };
    const examSectionIncludeOption: IncludeOptions = {
      model: this.db.ExamSection,
      required: true,
      include: [examQuestionIncludeOption]
    };
    const findOption: FindOptions = {
      include: [examSectionIncludeOption],
      paranoid: false
    };
    findOption.where = {
      ...findOption.where,
      id: examId
    };
    return findOption;
  }
}
