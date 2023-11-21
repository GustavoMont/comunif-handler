import React, { ReactElement } from "react";

interface Props {
  text: ReactElement;
  input: ReactElement;
  isEditing: boolean;
}

export const EditableText: React.FC<Props> = ({ input, isEditing, text }) => {
  if (isEditing) {
    return input;
  }
  return text;
};
