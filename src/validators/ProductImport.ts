import _ = require('lodash');
import { repository } from '../domain';
import sequelize from '../sequelize';

export const messages = {
  EBT001: (params: string) => `${params}は必須です。`,
  EBT002: ($1: string, $2: string | number, $3: number) =>
    `${$1}は「${$2}」文字以下で入力してください。（現在${$3}文字）`,
  EBT004: (params: string) => `${params}は半角英数で入力してください。`,
  EBT005: 'メールアドレスを正しく入力してください。',
  EBT008: (params: string) => `${params}は日付を正しく入力してください。`,
  EBT010: (params: string) => `${params}は数字を正しく入力してください。`,
  EBT016: 'メールアドレスまたは会員IDが間違っています。',
  EBT019: 'すでにメールアドレスは登録されています。',
  EBT023: 'パスワードは半角英数字記号で8～20文字で入力してください。',
  EBT025:
    'パスワードには半角数字のみ、または半角英字のみの値は使用できません。',
  EBT030: '確認用のパスワードが間違っています。',
  EBT036: (params: string) => `${params}が取得できませんでした。`,
  EBT044: '解約予定日は契約終了日前を指定してください。',
  EBT086: 'すでに証明書番号は登録されています。',
  EBT090: '変更がありません  ',
  EBT092: 'インポートできました。  ',
  EBT094: (params: string) => `${params}が存在しておりません。`,
  EBT095: 'インポートファイルの中身が正しくありません。',
  EBT096: '登録・更新・削除処理に成功しました。',
  EBT098: 'システムエラーになります。',
  ErrorImport: ($1: string | number, $2: string) => `Dòng ${$1}:${$2}`
};

const productsRepo = new repository.Products(sequelize);

const MAX_BIGINT = BigInt('9223372036854775807');
const MIN_BIGINT = BigInt('-9223372036854775808');

export const isBigInt = (value: string): boolean => {
  try {
    BigInt(value);
    return true;
  } catch (error) {
    return false;
  }
};

export async function validateProductBeforeSave(records: []) {
  try {
    const data: any = [];

    const errorMessages: any = [];

    if (records.length <= 1) {
      errorMessages.push(messages.EBT036('[CSV Data]'));
      return { errorMessages: errorMessages, data: data };
    }

    // check header
    if (records.length > 0) {
      const check = _.join(Object.values((records as any[])[0]), ',');
      const targetString = 'id,name,price,content,featured_flg';
      
      if (check.localeCompare(targetString)) {
        errorMessages.push(messages.EBT095);
      }
    }

    for (let i = 1; i < records.length; i++) {
      let check = true;

      if (Object.keys(records[i]).length != 5) {
        errorMessages.push(messages.ErrorImport(i + 1, messages.EBT095));
        check = false;
      }

      for (let j = 0; j < Object.keys(records[i]).length; j++) {
        switch (j) {
          case 0:
            if (records[i]['id'] != '') {
              if (isNaN(records[i]['id']) || !isBigInt(records[i]['id'])) {
                errorMessages.push(
                  messages.ErrorImport(i + 1, messages.EBT010('ID'))
                );
                check = false;
              } else if (
                isBigInt(records[i]['id']) &&
                BigInt(records[i]['id']) <= MAX_BIGINT &&
                BigInt(records[i]['id']) >= MIN_BIGINT
              ) {
                // check exist
                const product = await productsRepo.findById(records[i]['id']);
                if (_.isNil(product)) {
                  errorMessages.push(
                    messages.ErrorImport(i + 1, messages.EBT094('ID'))
                  );
                  check = false;
                }
              } else if (records[i]['id']['length'] > 19) {
                errorMessages.push(
                  messages.ErrorImport(
                    i + 1,
                    messages.EBT002('ID', 19, records[i]['id']['length'])
                  )
                );
                check = false;
              }
            }
            break;
          case 1:
            if (records[i]['name'] == '') {
              errorMessages.push(
                messages.ErrorImport(i + 1, messages.EBT001('Group Name'))
              );
              check = false;
            } else {
              if (records[i]['name']['length'] > 100) {
                errorMessages.push(
                  messages.ErrorImport(
                    i + 1,
                    messages.EBT002(
                      'Product Name',
                      100,
                      records[i]['name']['length']
                    )
                  )
                );
                check = false;
              }
            }
            break;
          case 2:
            if (records[i]['price'] == '') {
              errorMessages.push(
                messages.ErrorImport(i + 1, messages.EBT001('Price'))
              );
              check = false;
            } else if (
              (records[i]['price'] as any).replace('.', '').length > 10
            ) {
              errorMessages.push(
                messages.ErrorImport(
                  i + 1,
                  messages.EBT002('Price', '(10,2)', records[i]['price']['length'])
                )
              );
              check = false;
            } else {
              if (isNaN(records[i]['price'])) {
                errorMessages.push(
                  messages.ErrorImport(i + 1, messages.EBT010('Price'))
                );
                check = false;
              }
            }
            break;
          case 3:
            if (records[i]['content'] == '') {
              errorMessages.push(
                messages.ErrorImport(i + 1, messages.EBT001('Content'))
              );
              check = false;
            }
            break;
          case 4:
            if (records[i]['featured_flg'] == '') {
              errorMessages.push(
                messages.ErrorImport(i + 1, messages.EBT001('Featured Flag'))
              );
              check = false;
            } else {
              // check int
              if (
                isNaN(records[i]['featured_flg']) ||
                !Number.isInteger(Number(records[i]['featured_flg'])) ||
                (records[i]['featured_flg'] as string).includes('.')
              ) {
                errorMessages.push(
                  messages.ErrorImport(i + 1, messages.EBT010('Featured Flag'))
                );
                check = false;
              } else if (records[i]['featured_flg']['length'] > 4) {
                errorMessages.push(
                  messages.ErrorImport(
                    i + 1,
                    messages.EBT002('Featured Flag', 4, records[i]['featured_flg']['length'])
                  )
                );
                check = false;
              }
            }
            break;
          default:
            break;
        }
      }

      if (check) {
        data.push(records[i]);
      }
    }

    return { errorMessages: errorMessages, data: data };
  } catch (error) {
    return { errorMessages: messages.EBT090, data: [] };
  }
}
