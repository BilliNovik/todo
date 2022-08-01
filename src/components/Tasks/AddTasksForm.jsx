import axios from "axios";
import React from "react";

import plus from '../../assets/img/add.svg';

function AddTasksForm({list, onAddTask}) {

    const [visibleForm, setFormVisible] = React.useState(false);
    const [inputValue, setinputValue] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const toogleFormVisible = () => {
        setFormVisible(!visibleForm);
        setinputValue('');
    }

    const addTask = () => {
        setIsLoading(true);
        const obj = {'completed': false, 'id': Math.random(), 'listId': list.id, 'text': inputValue};
        axios.post('http://localhost:3004/tasks/', obj)
            .then(({data}) => {
                console.log(data);
                onAddTask(list.id, data);
                toogleFormVisible();
            })
            .finally(() => {
                setIsLoading(false);
            })
    }
  
    return (
        <div className="tasks__form">
            { !visibleForm ? <div className="tasks__form-new" onClick={toogleFormVisible}>
                <img src={plus} alt="add icon" />
                <span>Новая задача</span>
            </div>
             : <div className="tasks__form-field">
                <input type="text" className="text-input" placeholder="Текст задачи" onChange={(e) => {setinputValue(e.target.value)}}/>
                <button className="button tasks__form-field-button" onClick={addTask} disabled={isLoading} >{isLoading ? 'Добавление...' : 'Добавить задачу'}</button>
                <button className="button tasks__form-field-button grey-button" onClick={toogleFormVisible}>Отмена</button>
            </div> }
        </div>
    );
}

export default AddTasksForm;