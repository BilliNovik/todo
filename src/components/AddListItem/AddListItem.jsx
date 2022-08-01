import React from "react";
import classNames from "classnames";
import axios from "axios";

import plus from '../../assets/img/add.svg';
import remove from '../../assets/img/remove.svg';
import List from "../List/List";
import './AddListItem.scss';

function AddListItem({base , onAdd, isLoading}) {
    const [visiblePopup, setVisiblePopup] = React.useState(false);
    const [selectedColor, setSelectedColor] = React.useState(1);
    const [inputValue, setinputValue] = React.useState(null);
    
    function addItem(){
        if(inputValue){
            onAdd({ name: inputValue, colorId: selectedColor}, closePopup);
        }
    }
    
    function closePopup(){
        setSelectedColor(base[0].id);
        setinputValue('');
        setVisiblePopup(false);
    }

    return (
        <>
            <List props={[
                {icon: plus, name: 'Добавить папку', className: 'todo__list-add'}
            ]} onClick={() => {setVisiblePopup(true)}} />
            {visiblePopup && <div className="list-popup">
                <input type="text" className="text-input list-popup__input" placeholder="Название папки" onChange={(e) => {setinputValue(e.target.value)}}/>
                <ul className="list-popup__colors">
                    {base.map((item, i) => (
                        <li onClick={() => {setSelectedColor(item.id)}} key={item.id} className={classNames('list-popup__colors-item', selectedColor === item.id && 'active')} style={{backgroundColor: `${item.hex}`}}></li>
                    ))}
                </ul>
                <button className="list-popup__button button" disabled={isLoading} onClick={addItem}>{isLoading ? 'Добавление...' : 'Добавить'}</button>
                <button className="list-popup__button-hide" onClick={closePopup}><img src={remove} alt="icon" /></button>
                {/* <button className="list-popup__button-hide" onClick={() => {setVisiblePopup(false)}}><img src={remove} alt="icon" /></button> */}
            </div>}
        </>
    );
  }
  
  export default AddListItem;
  