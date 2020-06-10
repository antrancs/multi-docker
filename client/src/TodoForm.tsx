import React, { useState, FunctionComponent } from 'react';

interface IProps {
  onSubmit: (text: string) => void;
}

const TodoForm: FunctionComponent<IProps> = ({ onSubmit }) => {
  const [value, setValue] = useState('');

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(value);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />

      <input type="submit" value="Send" disabled={value.trim().length === 0} />
    </form>
  );
};

export default TodoForm;
