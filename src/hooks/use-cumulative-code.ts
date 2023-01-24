import { useTypedSelector } from "./use-typed-selectors";

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);

    const showFunc = `
    import _React from 'react';
    import { createRoot as _createRoot } from 'react-dom/client';

    var show = (value) => {
      const container = document.getElementById('root');

      if (typeof value === 'object') {
        if (value.$$typeof && value.props) {
          const root = _createRoot(container);
          root.render(value);
        } else {
          container.innerHTML = JSON.stringify(value);
        }
      } else {
        container.innerHTML = value;
      }
    };
    `;

    const showFuncNoop = "var show = () => {}";

    const cumulativeCode = [];

    for (const c of orderedCells) {
      if (c.type === "code") {
        const sjow = c.id === cellId ? showFunc : showFuncNoop;
        cumulativeCode.push(sjow);
        cumulativeCode.push(c.content);
      }

      if (c.id === cellId) {
        break;
      }
    }
    return cumulativeCode;
  }).join("\n");
};
