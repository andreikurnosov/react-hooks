import React, { useState, useEffect } from 'react';
import axios from 'axios';

const todo = (props) => {
  const [todoName, setTodoName] = useState('');
  const [submittedTodo, setSubmittedTodo] = useState(null);
  const [todoList, setTodoList] = useState([]);
  // const [todoState, setTodoState] = useState({ userInput: '', todoList: [] });

  useEffect(() => {
    axios.get('https://vue-exp.firebaseio.com/todos.json').then((res) => {
      console.log(res);
      const todoData = res.data;
      const todos = [];
      for (const key in todoData) {
        todos.push({ id: key, name: todoData[key].name });
      }
      setTodoList(todos);
    });
    return () => {
      console.log('Cleanup');
    };
  }, [todoName]);

  const mouseMoverHandler = (event) => {
    console.log(event.clientX, event.clientY);
  };

  useEffect(() => {
    document.addEventListener('mousemove', mouseMoverHandler);
    return () => {
      document.removeEventListener('mousemove', mouseMoverHandler);
    };
  }, []);

  useEffect(() => {
    if (submittedTodo){
      setTodoList(todoList.concat(submittedTodo));
    }
  }, [submittedTodo]);

  const inputChangeHandler = (event) => {
    // setTodoState({
    //   userInput: event.target.value,
    //   todoList: todoState.todoList
    // });
    setTodoName(event.target.value);
  };

  const todoAddHandler = () => {
    // setTodoState({
    //   userInput: todoState.userInput,
    //   todoList: todoState.todoList.concat(todoState.userInput)
    // });

    axios
      .post('https://vue-exp.firebaseio.com/todos.json', { name: todoName })
      .then((res) => {
        const todoItem = { id: res.data.name, name: todoName };
        setSubmittedTodo(todoItem);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <React.Fragment>
      <input
        type="text"
        placeholder="Todo"
        onChange={inputChangeHandler}
        value={todoName}
      />
      <button onClick={todoAddHandler}>Add</button>
      <ul>
        {todoList.map((todo) => (
          <li key={Math.random()}>{todo.name}</li>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default todo;
