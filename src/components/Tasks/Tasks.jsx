import axios from "axios";
import React from "react";

import './Tasks.scss';
import AddTasksForm from "./AddTasksForm";
import Task from "./Task";

function Tasks({list, onEditTitle, onAddTask, onRemoveTask, onEditTask, onCheckedTask}) {
    const [editTextTitle, setEditTextTitle] = React.useState(list.name);
    const [checkEditText, setCheckEditText] = React.useState(false);

    React.useEffect(() => {
        setEditTextTitle(list.name)
    }, [list.name])
    
    function editTitle(){
        const newTitle = editTextTitle.replace(/^ +| +$|( ) +/g,"$1");
        console.log(newTitle)
        if(newTitle){
            onEditTitle(list.id, newTitle);
            axios.patch('http://localhost:3004/lists/' + list.id, {
                    name: newTitle 
                })
                .catch(() => { alert('Не удалось обновить название списка' )});
            setCheckEditText(false);
        }
    }

    function changeTextCheck(e){
        (e.target.value.length < 30) ? setEditTextTitle(e.target.value) : setEditTextTitle(editTextTitle.trim());
    }

    return (
        <div className="tasks">
            <div className="tasks__top">
                { !checkEditText ? <h1 className="tasks__name" style={{color: `${list.colorHex}`}}>{list.name}</h1> :
                <input autoFocus onBlur={() => {editTitle(); setCheckEditText(false)}} className="tasks__name tasks__name-input" value={editTextTitle} onChange={changeTextCheck} />}
                { !checkEditText ? <svg onClick={() => setCheckEditText(true)} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 12.0504V14.5834C0 14.8167 0.183308 15 0.41661 15H2.9496C3.05792 15 3.16624 14.9583 3.24123 14.875L12.34 5.78458L9.21542 2.66001L0.124983 11.7504C0.0416611 11.8338 0 11.9337 0 12.0504ZM14.7563 3.36825C14.8336 3.29116 14.8949 3.1996 14.9367 3.0988C14.9785 2.99801 15 2.88995 15 2.78083C15 2.6717 14.9785 2.56365 14.9367 2.46285C14.8949 2.36205 14.8336 2.27049 14.7563 2.19341L12.8066 0.24367C12.7295 0.166428 12.638 0.105146 12.5372 0.0633343C12.4364 0.021522 12.3283 0 12.2192 0C12.1101 0 12.002 0.021522 11.9012 0.0633343C11.8004 0.105146 11.7088 0.166428 11.6318 0.24367L10.107 1.76846L13.2315 4.89304L14.7563 3.36825V3.36825Z" fill="black"/>
                </svg> : <img onClick={editTitle} src="/static/media/add.c4fa83e1531853436062fd8c7a459787.svg" alt="add icon" />}
            </div>
            <div className="tasks__bottom">
                {list.tasks && list.tasks.map(task => (
                    <Task key={task.id} onRemove={onRemoveTask} onEditTask={onEditTask} list={list} onCheckedTask={onCheckedTask} {...task} />
                ))}
                <AddTasksForm key={list.id} list={list} onAddTask={onAddTask}/>
            </div>
        </div>
    );
  }
  
  export default Tasks;
  