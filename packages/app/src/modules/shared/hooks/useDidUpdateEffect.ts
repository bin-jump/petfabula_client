import React from "react";

export default function useDidUpdateEffect(fn: any, inputs: Array<any>) {
  const didMountRef = React.useRef(false);

  React.useEffect(() => {
    if (didMountRef.current) fn();
    else didMountRef.current = true;
  }, inputs);
}
