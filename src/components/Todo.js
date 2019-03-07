import React, {  useEffect, useReducer, useRef } from 'react';
import axios from 'axios';

const todo = (props) => {
  // const [todoName, setTodoName] = useState('');
  // const [submittedTodo, setSubmittedTodo] = useState(null);
  // const [todoList, setTodoList] = useState([]);
  // const [todoState, setTodoState] = useState({ userInput: '', todoList: [] });
  const todoInputRef = useRef();

  const todoListReducer = (state, action) => {
    switch (action.type) {
      case 'ADD':
        return state.concat(action.payload);
      case 'SET':
        return action.payload;
      case 'REMOVE':
        return state.filter((todo) => todo.id !== action.payload);
      default:
        return state;
    }
  };

  const [todoList, dispatch] = useReducer(todoListReducer, []);

  useEffect(() => {
    axios.get('https://vue-exp.firebaseio.com/todos.json').then((res) => {
      console.log(res);
      const todoData = res.data;
      const todos = [];
      for (const key in todoData) {
        todos.push({ id: key, name: todoData[key].name });
      }
      dispatch({ type: 'SET', payload: todos });
    });
    return () => {
      console.log('Cleanup');
    };
  }, []);

  const mouseMoverHandler = (event) => {
    console.log(event.clientX, event.clientY);
  };

  useEffect(() => {
    document.addEventListener('mousemove', mouseMoverHandler);
    return () => {
      document.removeEventListener('mousemove', mouseMoverHandler);
    };
  }, []);

  // useEffect(() => {
  //   if (submittedTodo) {
  //     dispatch({ type: 'ADD', payload: submittedTodo });
  //   }
  // }, [submittedTodo]);

  // const inputChangeHandler = (event) => {
  //   // setTodoState({
  //   //   userInput: event.target.value,
  //   //   todoList: todoState.todoList
  //   // });
  //   setTodoName(event.target.value);
  // };

  const todoAddHandler = () => {
    // setTodoState({
    //   userInput: todoState.userInput,
    //   todoList: todoState.todoList.concat(todoState.userInput)
    // });

    const todoName = todoInputRef.current.value;

    axios
      .post('https://vue-exp.firebaseio.com/todos.json', { name: todoName })
      .then((res) => {
        const todoItem = { id: res.data.name, name: todoName };
        dispatch({type: 'ADD', payload: todoItem})
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const todoRemoveHadler = (todoId) => {
    axios
      .delete(`https://vue-exp.firebaseio.com/todos/${todoId}.json`)
      .then(res => {
        dispatch({ type: 'REMOVE', payload: todoId });
      })
      .catch((err) => console.log(err));
   };

  return (
    <React.Fragment>
      <input
        type="text"
        placeholder="Todo"
        ref={todoInputRef}
      />
      <button onClick={todoAddHandler}>Add</button>
      <ul>
        {todoList.map((todo) => (
          <li
            key={Math.random()}
            onClick={todoRemoveHadler.bind(this, todo.id)}
          >
            {todo.name}
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default todo;
