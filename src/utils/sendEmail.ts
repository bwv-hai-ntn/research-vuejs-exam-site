import * as AWS from 'aws-sdk';
import { Request } from 'express';
import * as moment from 'moment-timezone';
import * as serviceEmail from 'nodemailer';
import { SendMailOptions } from 'nodemailer';
import { messages, Static, types } from '../constant';

export const sendByEmail = async (
  data: types.answer.dataUpdate,
  req: Request
) => {
  try {
    const url = `${req.protocol}://${req.headers.host}/resultDetail/${data?.id}/accessToken/${data?.accessToken}`;
    const transporter = serviceEmail.createTransport({
      SES: new AWS.SES({
        region: <string>process.env.SES_REGION,
        apiVersion: <string>process.env.SES_VERSION,
        credentials: {
          accessKeyId: <string>process.env.AWS_IAM_ID,
          secretAccessKey: <string>process.env.AWS_IAM_ACCESS_KEY
        }
      })
    });
    let score = '';
    if (data.totalScore !== null) {
      score = `${data.totalScore} / ${data.exam!.totalPoints} (${Math.floor(
        data.scorePercentage! * 100
      ) / 100}%)`;
    }
    let passExam = '';
    if (
      data.passExam === Static.passExam.FAILED ||
      data.passExam === Static.passExam.PASSED
    ) {
      passExam = Static.passExam[data.passExam];
    }
    let link = '';
    let showResult = false;
    if (
      data.exam?.showResult === Static.showResult.showSubmittedWork ||
      data.exam?.showResult === Static.showResult.showCorrectAnswer
    ) {
      showResult = true;
      link = url;
    }
    let linkExpired = '';
    if (showResult && data.expiredAt !== null) {
      linkExpired = dateFormatCountry(
        'YYYY/MM/DD H:mm:ss',
        data?.expiredAt,
        data.country
      );
    }
    const mailOption: SendMailOptions = {
      from: <string>process.env.MAIL_FROM,
      to: data.email!,
      html: messages.formEmail(
        data.exam!.title,
        score,
        passExam,
        link,
        linkExpired
      )
    };
    mailOption.subject = `[Result] ${data.exam!.title} ${data.name}`;
    await transporter.sendMail(mailOption);
  } catch (err) {
    throw err;
  }
};

/**
 * set time
 */
function dateFormatCountry(
  format: string = 'YYYY/MM/DD',
  object?: string | Date,
  country?: number | string
) {
  if (object === null || object === '') {
    return '';
  }
  let timeZone = '';
  const date = moment(object);
  if (country && Static.country.Japan === Number(country)) {
    timeZone = '(UTC+09:00)';
    date.tz('Asia/Tokyo');
  } else {
    timeZone = '(UTC+07:00)';
    date.tz('Asia/Ho_Chi_Minh');
  }
  return `${date.format(format)} ${timeZone}`;
}
