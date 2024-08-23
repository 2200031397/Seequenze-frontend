import React, { useState, useEffect } from 'react';
import './index.css';
import expiredTaskImage from '../../images/expiredtask.png';
import activetask from '../../images/activetask.png';
import completedtask from '../../images/completedtask.png';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import axios from 'axios';

const Home = () => {
  const [taskHead, setTaskHead] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskStatus, setTaskStatus] = useState('to-do');
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/gettasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error occurred while fetching tasks:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTask = async () => {
    const newTask = {
      taskhead: taskHead,
      taskdescription: taskDescription,
      taskdeadline: taskDeadline,
      status: taskStatus
    };

    try {
      const response = await axios.post('http://localhost:3000/api/inserttask', newTask);
      if (response.status === 201) {
        setTaskHead('');
        setTaskDescription('');
        setTaskDeadline('');
        setTaskStatus('to-do');
        fetchTasks();
      } else {
        console.error('Failed to add task:', response.statusText);
      }
    } catch (error) {
      console.error('Error occurred while adding task:', error.response ? error.response.data : error.message);
    }
  };

  const handleUpdateTask = async (id) => {
 
      const updatedTask = {
        status: taskStatus
      };

      try {
        const response = await axios.put(`http://localhost:3000/api/updatetask/${id}`, updatedTask);
        if (response.status === 200) {
          setTaskStatus('to-do');
          setCurrentTask(null);
          fetchTasks();
        } else {
          console.error('Failed to update task:', response.statusText);
        }
      } catch (error) {
        console.error('Error occurred while updating task:', error.response ? error.response.data : error.message);
      }
    
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/deletetask/${taskId}`);
      if (response.status === 200) {
        fetchTasks();
      } else {
        console.error('Failed to delete task:', response.statusText);
      }
    } catch (error) {
      console.error('Error occurred while deleting task:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="home">
      <div className="search-filter-container">
        <div>
          <input className="search-box" type="search" placeholder="Search" />
        </div>
        <div className="filter-box">
          <select className="dropdown">
            <option value="">Filter</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>
      </div>

      <div className="lowerbody">
        <div className="allcomponents">
          <div className="expired_tasks">
            <img src={expiredTaskImage} className="expired_tasks_image" alt="Expired Tasks" />
            <p className="text_expired_tasks">Expired Tasks</p>
            <p>{tasks.filter(task => new Date(task.taskdeadline) < new Date()).length}</p>
          </div>
          <div className="expired_tasks">
            <img src={activetask} className="expired_tasks_image" alt="Active Tasks" />
            <p className="text_expired_tasks">All Active Tasks</p>
            <p>{tasks.filter(task => new Date(task.taskdeadline) >= new Date()).length}</p>
          </div>
          <div className="expired_tasks">
            <img src={completedtask} className="expired_tasks_image" alt="Completed Tasks" />
            <p className="text_expired_tasks">Completed Tasks</p>
            <p>{tasks.filter(task => task.status === 'done').length}</p>
          </div>
          <div>
            <Popup modal trigger={<button className="addbutton">+ Add Task</button>}>
              {(close) => (
                <>
                  <div className="popupcontainer">
                    <input
                      type="text"
                      placeholder="Task Head"
                      value={taskHead}
                      onChange={(e) => setTaskHead(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Task Description"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                    />
                    <input
                      type="date"
                      placeholder="Task Deadline"
                      value={taskDeadline}
                      onChange={(e) => setTaskDeadline(e.target.value)}
                    />
                    <select
                      value={taskStatus}
                      onChange={(e) => setTaskStatus(e.target.value)}
                    >
                      <option value="to-do">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    className="trigger-button"
                    onClick={() => {
                      handleTask();
                      close();
                    }}
                  >
                    Submit
                  </button>
                  <button type="button" className="trigger-button" onClick={() => close()}>
                    Close
                  </button>
                </>
              )}
            </Popup>
          </div>
        </div>

        <div className="todocard">
          <h1 className="todohead">To Do</h1>
          <hr className="todohrizentel" />
          {tasks.length > 0 ? (
            tasks.filter(task => task.status === 'to-do' && new Date(task.taskdeadline) > new Date()).map((task) => (
              <div className="todo_card" key={task._id}>
                <h1 className="todocard_header">{task.taskhead}</h1>
                <p className="todocard_para">{task.taskdescription}</p>
                <p className="deadline">{new Date(task.taskdeadline).toLocaleDateString()}</p>
                <Popup modal trigger={<button className="update-button">Update</button>}>
                  {(close) => (
                    <>
                      <div className="popupcontainer">
                        <select
                          value={taskStatus}
                          onChange={(e) => setTaskStatus(e.target.value)}
                        >
                          <option value="to-do">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        className="trigger-button"
                        onClick={() => {
                          handleUpdateTask(task._id);
                          close();
                        }}
                      >
                        Update Task
                      </button>
                      <button type="button" className="trigger-button" onClick={() => close()}>
                        Close
                      </button>
                    </>
                  )}
                </Popup>
                <button 
                  className="delete-button" 
                  onClick={() => handleDeleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No tasks available</p>
          )}
        </div>
        <div className="todocard">
          <h1 className="todohead">On progress</h1>
          <hr className="todohrizentel" />
          {tasks.filter(task => task.status === 'in-progress').map((task) => (
            <div className="todo_card" key={task._id}>
              <h1 className="todocard_header">{task.taskhead}</h1>
              <p className="todocard_para">{task.taskdescription}</p>
              <p className="deadline">{new Date(task.taskdeadline).toLocaleDateString()}</p>
              <Popup modal trigger={<button className="update-button" >Update</button>}>
                {(close) => (
                  <>
                    <div className="popupcontainer">
                      <select
                        value={taskStatus}
                        onChange={(e) => setTaskStatus(e.target.value)}
                      >
                        <option value="to-do">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      className="trigger-button"
                      onClick={() => {
                        handleUpdateTask(task._id);
                        close();
                      }}
                    >
                      Update Task
                    </button>
                    <button type="button" className="trigger-button" onClick={() => close()}>
                      Close
                    </button>
                  </>
                )}
              </Popup>
              <button 
                className="delete-button" 
                onClick={() => handleDeleteTask(task._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <div className="todocard">
          <h1 className="todohead">Completed</h1>
          <hr className="todohrizentel" />
          {tasks.filter(task => task.status === 'done').map((task) => (
            <div className="todo_card" key={task._id}>
              <h1 className="todocard_header">{task.taskhead}</h1>
              <p className="todocard_para">{task.taskdescription}</p>
              <p className="deadline">{new Date(task.taskdeadline).toLocaleDateString()}</p>
              <Popup modal trigger={<button className="update-button">Update</button>}>
                {(close) => (
                  <>
                    <div className="popupcontainer">
                      <select
                        value={taskStatus}
                        onChange={(e) => setTaskStatus(e.target.value)}
                      >
                        <option value="to-do">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      className="trigger-button"
                      onClick={() => {
                        handleUpdateTask(task._id);
                        close();
                      }}
                    >
                      Update Task
                    </button>
                    <button type="button" className="trigger-button" onClick={() => close()}>
                      Close
                    </button>
                  </>
                )}
              </Popup>
              <button 
                className="delete-button" 
                onClick={() => handleDeleteTask(task._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
