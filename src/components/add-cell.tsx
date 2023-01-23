import React from "react";

import { useActions } from "../hooks/use-actions";

import "./add-cell.css";

interface AddCellProps {
  nexCellId: string;
}

const AddCell: React.FC<AddCellProps> = ({ nexCellId }) => {
  const { insertCellBefore } = useActions();

  return (
    <div>
      <button onClick={() => insertCellBefore(nexCellId, "code")}>Code</button>
      <button onClick={() => insertCellBefore(nexCellId, "text")}>Text</button>
    </div>
  );
};

export default AddCell;
