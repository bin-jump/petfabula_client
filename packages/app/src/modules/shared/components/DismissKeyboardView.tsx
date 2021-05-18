import * as React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

const DismissKeyboardView: React.FC<{}> = ({ children }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboardView;
