// redux/actions.js
export const addTask = (task) => ({
    type: 'ADD_TASK',
    payload: task,
  });
  
  export const toggleTask = (taskId) => ({
    type: 'TOGGLE_TASK',
    payload: taskId,
  });
  
  export const deleteTask = (taskId) => ({
    type: 'DELETE_TASK',
    payload: taskId,
  });
  export const updateTasks = (updatedTasks) => ({
    type: 'UPDATE_TASKS',
    payload: updatedTasks,
  });  
  export const updateTaskDescription = (taskId, description) => ({
    type: 'UPDATE_TASK_DESCRIPTION',
    payload: {
      taskId,
      description,
    },
  });
  