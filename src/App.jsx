import React from "react";
import axios from "axios";

import {List, AddListItem, Tasks} from './components'
import list from './assets/img/list.svg'
import db from './assets/db.json'

function App() {
  
  let [lists, setLists] = React.useState(db.json);
  // console.log(lists)
  let [colors, setColors] = React.useState([]);
  // массив colors (((2)))
  let [isLoading, setLoading] = React.useState(false);
  let [activeItem, setActiveItem] = React.useState(null);
  let [allTasks, setAllTasks] = React.useState(false);
  
  React.useEffect(() => {
    axios.get('http://localhost:3004/lists?_expand=color&_embed=tasks').then(({data}) => {
      setLists(data);
    });
    axios.get('http://localhost:3004/colors').then(({data}) => {
      setColors(data);
    });
    // беру данные вверху, и заполняю ими массвив colors (((1)))
  }, [])

  React.useEffect(() => {
    setAllTasks(false);
  }, [activeItem])
  
  function onAdd(obj, fnClose){
    setLoading(true);
    const color = colors.filter(c => c.id === obj.colorId)[0].hex; 
    // это решает всю проблему ( то что сверху ) (((4)))
    const listObj = {...obj , color : { hex: color }, id : Math.random(), tasks: []}
    const newList = [...lists, listObj];
    console.log(listObj)
    
    axios.post('http://localhost:3004/lists', listObj)
      .then(({data}) => {
        setLists(newList);
        fnClose();
      })
      .finally(() => {
        setLoading(false);
      })
  }

  function onRemove(item){
    console.log(item)
    axios.delete('http://localhost:3004/lists/' + item.id);
    const newList = lists.filter(delElem => delElem.id !== item.id);
    setLists(newList);
  }

  function onEditListTitle(id, title){
    const newList = lists.map((item) => {
      if (item.id === id){
        item.name = title;
      }
      return item;
    });
    setLists(newList)
    
    console.log(id, title)
  }

  const onAddTask = (listId, takObj) => {
    console.log(listId, takObj)
    const newList = lists.map((item) => {
      if (item.id === listId){
        item.tasks = [...item.tasks, takObj];
      }
      return item;
    });
    setLists(newList)
  }

  function onRemoveTask(listId, taskId){
    axios.delete('http://localhost:3004/tasks/' + taskId);
    const newTasks = lists.map(item => {
      if(item.id === listId){
        // console.log(item);
        item.tasks = item.tasks.filter(task => task.id !== taskId);
      }
      return item
    })
    // console.log(newTasks)
    setLists(newTasks);
  }

  function onEditTask(listId, taskObj){
    const newTaskText = window.prompt('Текст задачи', taskObj.text)
    if(newTaskText){
      const newTasks = lists.map(list => {
        if(list.id === listId){
          list.tasks = list.tasks.map(task => {
            if (task.id === taskObj.id){
              task.text = newTaskText;
            }
            return task;
          });
        }
        return list
      })
      setLists(newTasks);
      axios.patch('http://localhost:3004/tasks/' + taskObj.id, {
        text: newTaskText
      });
    }
  }

  function onCheckedTask(listId, id, completed){
    let newLists = lists.map(list => {
      if(list.id === listId){
        list.tasks = list.tasks.map(task => {
          if(task.id === id){
            task.completed = completed;
          }
          return task;
        })
      }
      return list;
    })
    setLists(newLists);
    axios.patch('http://localhost:3004/tasks/' + id, {
        completed
    });
  }

  return (
    <div className="todo">
      <div className="todo__sidebar">
        <div className="todo__sidebar-top">
          <List props={[
            {icon: list, name: 'Все задачи'},
          ]} isRemovable={false} setAllTasks={setAllTasks} allTasks={allTasks} />
        </div>
        <div className="todo__sidebar-bottom">
          { lists && <List props={lists.map(item => {
            // item.colorHex = colors.filter(color => color.id === item.colorId)[0].hex;
            // делаю так - item.colorHex это новый ключ по которому должен быть hex код, но в итое выбивает что...
            // ...немогу прочитать с undefined (((3)))
            item.colorHex = item.color.hex;
            return item; 
          })} isRemovable onRemove={onRemove} onClickItemfn={setActiveItem}/>}
          <AddListItem base={colors} onAdd={onAdd} isLoading={isLoading} />
        </div>
      </div>
      <div className="todo__tasks">
        { allTasks ? lists.map((item) => (
          <Tasks key={item.id} list={item} onEditTitle={onEditListTitle} onAddTask={onAddTask} onRemoveTask={onRemoveTask} onEditTask={onEditTask} onCheckedTask={onCheckedTask} />
        )) : activeItem && <Tasks list={activeItem} onEditTitle={onEditListTitle} onAddTask={onAddTask} onRemoveTask={onRemoveTask} onEditTask={onEditTask} onCheckedTask={onCheckedTask} />} 
        {/* { activeItem && <Tasks list={activeItem} onEditTitle={onEditListTitle} onAddTask={onAddTask} onRemoveTask={onRemoveTask} onEditTask={onEditTask} onCheckedTask={onCheckedTask} />} */}
      </div>
    </div>
  );
}

export default App;