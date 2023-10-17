import { Exam } from '../../src/domain/model/ExamModel';
import ExamRepository from '../../src/domain/repo/ExamRepo';
import sequelize from '../../src/sequelize';
// Hack to make iconv load the encodings module, otherwise jest crashes. Compare
// https://github.com/sidorares/node-mysql2/issues/489
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

describe('ExamRepository', () => {
  const examRepo = new ExamRepository(sequelize);

  describe('search list exam by id', () => {
    test('should call findAll function with correct parameter', async () => {
      const mockResult = { count: 1, rows: [{ id: '1' }] };
      const spy = jest
        .spyOn(Exam as any, 'findAll')
        .mockImplementation(
          () => new Promise((resolve) => resolve(mockResult as any)),
        );

      const searchResult = await examRepo.searchListExamById([1, 2]);
      expect(searchResult).toEqual(mockResult);
      expect(spy.mock.calls.length).toBe(1);
      spy.mockRestore();
    });
  });

  describe('search exam by access key', () => {
    test('should call findAll function with correct parameter', async () => {
      const mockResult = { count: 1, rows: [{ id: '2' }] };
      const spy = jest
        .spyOn(Exam as any, 'findAll')
        .mockImplementation(
          () => new Promise((resolve) => resolve(mockResult as any)),
        );

      const searchResult = await examRepo.searchExam('abcdef');
      expect(searchResult).toEqual(mockResult);
      expect(spy.mock.calls.length).toBe(1);
      spy.mockRestore();
    });
  });
});
