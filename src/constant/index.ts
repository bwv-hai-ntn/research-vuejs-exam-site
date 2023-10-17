import * as exam from './exam/index';
import * as types from './types';

/**
 * Message
 */
export const messages = {
  notExistExam: 'This form does not exist.',
  tryAgainLater:
    "You've had too many attempts, please try again after 10 minutes.",
  closedForm: `The form exam.title is no longer accepting responses.<br>
     Try contacting the owner of the form if you think this is a mistake.`,
  signinRequired: 'To fill out this form, you must be signed in.',
  formRestricted: `You need permission.<br>
     This form can only be viewed by users in the owner's organization.<br>
     Try contacting the owner of the form if you think this is a mistake.`,
  alreadyResponded: `You've already responded.<br>
     You can fill out this form only once.<br>
     Try contacting the owner of the form if you think this is a mistake.`,
  continueTest: `You have uncompleted response.<br>
     Do you want to continue where you left off?`,
  timeout: `You have run out of time. Your response has been recorded.`,
  endMessage: `Your response has been recorded.`,
  loginError: `Invalid account. Please contact administrator for support.`,
  deletedExam: `This exam has already been deleted.`,
  continueEditConfirm: `This exam has already been responded. Do you want to continue editing?`,
  updatedsuccessfully: `Your changes have been saved successfully.`,
  noResults: `No results found.`,
  duplicateError: ($0: string) => `This ${$0} has already been used.`,
  notExistAnswer: `This answer does not exist.`,
  expiredAnswer: `This answer has been expired.`,
  processingFailed: `Something went wrong. Please refresh the page and try again.`,
  sentEmailSuccessfully: `Email sent successfully.`,
  answerSendingFailed: `Sending failed!<br>
     Please check your network connection and press here to resend.`,
  answerRecodingFailed: `Recording failed!<br>
     Please reload the page and try again, or contact administrator for support.`,
  formEmail: ($0: string, $1: string, $2: string, $3: string, $4: string) => `
  <div style="
      background-color: white;
      border-bottom: 1px solid gray;
      border-right: 1px solid gray;
      border-left: 1px solid gray;
      padding: 0;
      padding-bottom: 15px;
      min-height: auto;
      margin: 10px auto 0;
      border-radius: 10px;
      max-width: 50%;
      box-shadow: 0px 5px 5px grey;">
      <div  style="
      min-height: 10px;
      background-color: #673ab7;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;"></div>
      <div style="padding: 10px;">
          <h3 style="
              margin-bottom: 20px;
              margin-top: 10px;
              font-weight: 400;
              color: black;
              line-height: 42px;
              margin-bottom: 20px;
              ">Thank you for completing ${$0}
          </h3>
          <div>
          ${
            $1 !== ''
              ? `
                <h3 style="text-align: center;font-weight: normal;font-size: 1.75em;">
                  Your score: <span style="color: #673ab7;">${$1}</span>
              </h3>
          `
              : ''
          }
          </div>
          <div>
          ${
            $2 !== ''
              ? `
              <span
              style="
                  margin: 10px auto 0;
                  display: block;
                  text-align: center;
                  font-size: 25px;
                  font-weight: bold;
                  color: white;
                  background: #6f42c1;
                  width: 170px;
                  padding: 12px;
                  margin-top: 20px;
                  margin-bottom: 10px;
                  border-radius: 15px;">${$2} </span>
          `
              : ''
          }
          </div>
          <h3 style="font-weight: normal;color:black">
              ${
                $3 !== ''
                  ? `
                You can check your result detail via <a href="${$3}">this link.</a>
              `
                  : ''
              } <br>
              ${
                $4 !== ''
                  ? `
               Please be noted that this link will be expired at ${$4}.
              `
                  : ''
              }
          </h3>
      </div>
  </div>`,
  noRecord: 'There is no record.'
};

export enum PassExam {
  PASSED = 1,
  FAILED = 0
}

export enum CompletedTest {
  completed = 1
}

export enum ShowResult {
  show = 1,
  showSubmittedWork = 2,
  showCorrectAnswer = 3
}

export enum Authority {
  AUTHOR = 1,
  ADMIN = 0
}

export enum AuthorityScreen {
  Author = 1,
  Admin = 0
}

export enum UsercategoriesScreen {
  Admin = 'All categories'
}

export enum Country {
  Vietnam = 1,
  Japan = 2
}

export interface ICommonSearchOption {
  limit?: number | string;
  offset?: number | string;
}

export enum OnOff {
  OFF = 0,
  ON = 1
}

export enum AfterSubmission {
  'Show only ending message' = 0,
  'Show only score' = 1,
  'Show score and answer' = 2,
  'Show score, answer and right answer' = 3
}

export enum AnswerType {
  'No answer' = 0,
  'Multiple choice' = 1,
  'Checkboxes' = 2,
  'Short answer' = 3
}

export enum TestTimeSetting {
  'No limit' = 0,
  'Set based on test' = 1,
  'Set based on section' = 2
}

export enum SendResultViaEmail {
  ON = 1,
  OFF = 0
}

export const limit = 50;

export enum ListLimit {
  LimitRecommendationList = 8,
  LimitInformationList = 5,
  LimitPickupList = 8,
  LimitPickupDetailList = 8
}

// tslint:disable-next-line:no-namespace
export namespace Static {
  export import passExam = PassExam;
  export import completedTest = CompletedTest;
  export import showResult = ShowResult;
  export import authority = Authority;
  export import authorityScreen = AuthorityScreen;
  export import onOff = OnOff;
  export import afterSubmission = AfterSubmission;
  export import examListCheckBox = exam.ExamListCheckBox;
  export import examTitleTable = exam.ExamTitleTable;
  export import answerType = AnswerType;
  export import usercategoriesScreen = UsercategoriesScreen;
  export import examListResultCheckBox = exam.ExamListResultCheckBox;
  export import examStatusAnswer = exam.ExamStatusAnswer;
  export import testTimeSetting = TestTimeSetting;
  export import country = Country;
  export import sendResultViaEmail = SendResultViaEmail;
  export import listLimit = ListLimit;
}

export import types = types;
