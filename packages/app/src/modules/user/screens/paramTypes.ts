import { Account, City } from "@petfabula/common";

type ParamTypes = {
  EditAccount: {
    // id: number;
    account: Account;
    city: City | undefined;
  };

  UserActivity: {
    // id: number;
    initial: string;
  };
};

export default ParamTypes;
