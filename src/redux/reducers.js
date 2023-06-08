// redux/reducers.js
const initialState = {
    tasks: [],
  };
  
  const tasksReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_TASK':
        return {
          ...state,
          tasks: [action.payload, ...state.tasks],
        };
      case 'TOGGLE_TASK':
        return {
          ...state,
          tasks: state.tasks.map((task) => {
            if (task.id === action.payload) {
              return { ...task, completed: !task.completed };
            }
            return task;
          }),
        };
      case 'DELETE_TASK':
        return {
          ...state,
          tasks: state.tasks.filter((task) => task.id !== action.payload),
        };
        case 'UPDATE_TASKS':
      return {
        ...state,
        tasks: action.payload,
      };
      case 'UPDATE_TASK_DESCRIPTION':
        return {
          ...state,
          tasks: state.tasks.map((task) => {
            if (task.id === action.payload.taskId) {
              return { ...task, description: action.payload.description };
            }
            return task;
          }),
        };
      
      default:
        return state;
    }
    
  };
  
  export default tasksReducer;
  