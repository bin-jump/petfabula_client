import { useSafeAreaInsets } from "react-native-safe-area-context";

const useBottomTabbarHeight = () => {
  const { bottom } = useSafeAreaInsets();

  return { tabbarHeight: 70 + bottom / 2 };
};

export default useBottomTabbarHeight;
