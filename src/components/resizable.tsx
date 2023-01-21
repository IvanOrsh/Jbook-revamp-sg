import { ResizableBox, ResizableBoxProps } from "react-resizable";
import { useEffect, useState } from "react";

import "./resizable.css";

interface ResizableProps {
  direction: "horizontal" | "vertical";
  children?: React.ReactNode;
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableProps: ResizableBoxProps;
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setinnerWidth] = useState(window.innerWidth);
  const [width, setWidth] = useState(window.innerWidth * 0.75);

  useEffect(() => {
    // debouncing
    let timer: any;
    const listener = () => {
      if (timer) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setinnerWidth(window.innerWidth);
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
      }, 100);
    };
    window.addEventListener("resize", listener);

    return () => {
      window.removeEventListener("resize", listener);
    };
  }, [width]);

  if (direction === "vertical") {
    resizableProps = {
      height: 300,
      width: Infinity,
      resizeHandles: ["s"],
      minConstraints: [Infinity, 30],
      maxConstraints: [Infinity, innerHeight * 0.9],
    };

    // horizontal
  } else {
    resizableProps = {
      className: "resize-horizontal",
      height: Infinity,
      width,
      resizeHandles: ["e"],
      minConstraints: [innerWidth * 0.2, Infinity],
      maxConstraints: [innerWidth * 0.75, Infinity],
      onResizeStop: (event, data) => {
        setWidth(data.size.width);
      },
    };
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
