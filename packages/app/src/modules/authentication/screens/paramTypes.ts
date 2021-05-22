import { RouteProp } from "@react-navigation/native";

type ParamTypes = {
  SignupVerification: {
    name: string;
    email: string;
    userAgreement: boolean;
  };
  LoginVerification: {
    email: string;
  };
};

export default ParamTypes;
