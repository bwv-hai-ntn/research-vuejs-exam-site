import * as answerFactory from './factory/answerFactory';
import * as authFactory from './factory/auth';
import * as examFactory from './factory/examFactory';
import * as informationFactory from './factory/informationFactory';
import * as pickupFactory from './factory/pickupFactory';
import * as recommendationFactory from './factory/recommendationFactory';
import * as userFactory from './factory/userFactory';

// tslint:disable-next-line: no-namespace
export namespace auth {
  export import LoginData = authFactory.ILoginData;
}

// tslint:disable-next-line: no-namespace
export namespace exam {
  export import searchListExam = examFactory.ISearchListExam;
  export import updateExamCategory = examFactory.ISaveExamCategory;
}

// tslint:disable-next-line: no-namespace
export namespace user {
  export import searchListUser = userFactory.ISearchListUser;
  export import createUser = userFactory.ICreateUser;
  export import saveUserCategory = userFactory.ISaveUserCategory;
}

// tslint:disable-next-line: no-namespace
export namespace answer {
  export import searchListAnswer = answerFactory.ISearchListAnswer;
  export import dataUpdate = answerFactory.IDataUpdate;
}

// tslint:disable-next-line: no-namespace
export namespace pickup {
  export import searchListPickup = pickupFactory.ISearchListPickup;
}

// tslint:disable-next-line: no-namespace
export namespace information {
  export import searchListInformation = informationFactory.ISearchListInformation;
}

// tslint:disable-next-line: no-namespace
export namespace recommendation {
  export import searchListRecommendation = recommendationFactory.ISearchListRecommendation;
}
