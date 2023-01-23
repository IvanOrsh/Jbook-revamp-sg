import React from "react";

import { useActions } from "../hooks/use-actions";

import "./add-cell.css";

interface AddCellProps {
  nextCellId: string | null;
  forceVisible?: boolean;
}

const AddCell: React.FC<AddCellProps> = ({ nextCellId, forceVisible }) => {
  const { inserCellAfter } = useActions();

  return (
    <div className={`add-cell ${forceVisible ? "force-visible" : ""}`}>
      <div className="add-buttons">
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => inserCellAfter(nextCellId, "code")}
        >
          <span className="icon is-small">
            <i className="fas fa-plus" />
          </span>
          <span>Code</span>
        </button>

        <button
          className="button is-rounded is-primary is-small"
          onClick={() => inserCellAfter(nextCellId, "text")}
        >
          <span className="icon is-small">
            <i className="fas fa-plus" />
          </span>
          <span>Text</span>
        </button>
      </div>
      <div className="divider"></div>
    </div>
  );
};

export default AddCell;
