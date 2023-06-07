import React, { useState, useEffect, } from 'react';
import { Dropdown } from 'react-bootstrap';

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<TaskFilter>(TaskFilter.All);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever the tasks state changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddTask = () => {
    if (inputValue.trim() !== '') {
      const newTask: Task = {
        id: Date.now(),
        description: inputValue,
        completed: false,
      };
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      setInputValue('');
    }
  };

  const handleToggleTask = (taskId: number) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const handleFilterChange = (selectedFilter: TaskFilter) => {
    setFilter(selectedFilter);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === TaskFilter.Completed) {
      return task.completed;
    } else if (filter === TaskFilter.Uncompleted) {
      return !task.completed;
    }
    return true;
  });

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
        <div className="row row-cols-md-3 g-4">
          {filteredTasks.map((task) => (
            <div className="col" key={task.id}>
              <div className="card">
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
                          textDecoration: task.completed
                            ? 'line-through'
                            : 'none',
                          fontWeight: 'bold',
                          fontSize: '16px',
                        }}
                      >
                        {task.description.slice(0, 16).concat('...')}
                      </span>
                    </div>
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
          ))}
        </div>
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
