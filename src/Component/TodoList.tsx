import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addTask, toggleTask, deleteTask, updateTasks, updateTaskDescription } from '../redux/actions';

interface Task {
  id: number;
  description: string;
  completed: boolean;
}

enum TaskFilter {
  All = 'all',
  Completed = 'completed',
  Uncompleted = 'uncompleted',
}

const TodoList: React.FC = () => {
  const tasks = useSelector((state:any) => state.tasks);
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<TaskFilter>(TaskFilter.All);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskDescription, setEditingTaskDescription] = useState('');
  const [error, setError] = useState<any>(null);
 

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };


  const handleAddTask = () => {
    if (inputValue.trim() !== '') {
      const existingTask = tasks.find((task: Task) => task.description === inputValue);
      if (existingTask) {
        setError('Task with the same description already exists');
        setInputValue('')
        toast(error, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
      } else {
        const newTask: Task = {
          id: Date.now(),
          description: inputValue,
          completed: false,
        };
        dispatch(addTask(newTask));
        setInputValue('');
        setError(null);
      }
    }
  };

  const handleToggleTask = (taskId: number) => {
    dispatch(toggleTask(taskId));
  };

  const handleDeleteTask = (taskId: number) => {
    dispatch(deleteTask(taskId));
  };
  const handleFilterChange = (selectedFilter: TaskFilter) => {
    setFilter(selectedFilter);
  };
  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
  
    const updatedTasks = Array.from(filteredTasks);
  
    const [removed] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, removed);
  
  
    dispatch(updateTasks(updatedTasks));
  
  };
  

  const filteredTasks = tasks.filter((task:any) => {
    if (filter === TaskFilter.Completed) {
      return task.completed;
    } else if (filter === TaskFilter.Uncompleted) {
      return !task.completed;
    }
    return true;
  });
  
  const handleUpdateTaskDescription = (taskId: number) => {
    if (editingTaskDescription.trim() !== '') {
      const existingTask = tasks.find(
        (task: Task) => task.description === editingTaskDescription && task.id !== taskId
      );
      if (existingTask) {
        setError('Task with the same description already exists');
        setEditingTaskDescription('')
        toast(error, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })

        return;
      }
      dispatch(updateTaskDescription(taskId, editingTaskDescription));
    }
    setEditingTaskId(null);
    setEditingTaskDescription('');
    setError(null);
  };

  return (
    <div style={{ padding: '10px' }}>
      <h1 style={{ fontWeight: '18px' }}>Todo List</h1>
      <div>
        <div className="row align-items-center justify-content-center">
          <div className="col-md-9">
            <input
              type="textarea"
              className="form-control w-100 ml-4"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-3 m-2">
            <button className="btn btn-primary ml-2" onClick={handleAddTask}>
              Add Task
            </button>
          </div>
        </div>
      </div>

      <div style={{ margin: '10px' }}>
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="filter-dropdown">
            Filter: {filter}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              active={filter === TaskFilter.All}
              onClick={() => handleFilterChange(TaskFilter.All)}
            >
              All
            </Dropdown.Item>
            <Dropdown.Item
              active={filter === TaskFilter.Completed}
              onClick={() => handleFilterChange(TaskFilter.Completed)}
            >
              Completed
            </Dropdown.Item>
            <Dropdown.Item
              active={filter === TaskFilter.Uncompleted}
              onClick={() => handleFilterChange(TaskFilter.Uncompleted)}
            >
              Uncompleted
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
     
      <div className="card border-0 mt-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="task-list">
            {(provided: any) => (

<ul {...provided.droppableProps} ref={provided.innerRef}>
{filteredTasks.map((task: any, index: any) => (
  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
    {(provided: any) => (
      <li
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <div className="card m-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div className="mr-4">
                <input
                  type="checkbox"
                  className="m-3"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                />
                <span
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    fontWeight: 'bold',
                    fontSize: '16px',
                  }}
                >
                  {!editingTaskId && task.description.slice(0, 16).concat('...')}

                </span>
                <input
                  type="text"
                  
                  value={editingTaskDescription}
                  onChange={(e) => setEditingTaskDescription(e.target.value)}
                  style={{
                    display: editingTaskId === task.id ? 'inline-block' : 'none',
                  }}
                />
              </div>
              <div className='m-2'>
                <button
                  className="btn btn-primary mr-2"
                  onClick={() => {
                    setEditingTaskId(task.id);
                    setEditingTaskDescription(task.description);
                  }}
                  style={{
                    display: editingTaskId === task.id ? 'none' : 'inline-block',
                    marginRight: '4px'
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-primary mr-2"
                  onClick={() => handleUpdateTaskDescription(task.id)}
                  style={{
                    display: editingTaskId === task.id ? 'inline-block' : 'none',
                    marginRight: '4px'
                  }}
                >
                  Update
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>
    )}
  </Draggable>
))}
{provided.placeholder}
</ul>

            )}
          </Droppable>
        </DragDropContext>
      </div>

      <p
        style={{
          marginTop: '10px',
          fontWeight: 'bold',
          fontSize: '16px',
        }}
      >
        Total tasks: {tasks.length}
      </p>
    </div>
  );
};

export default TodoList;
