import React, { useState, useEffect } from 'react';
import DropDown from '../components/DropDown';
import Input from '../components/Input';
import Button from '../components/Button';
import Tag from '../components/Tag';
import style from './IngredientModal.module.css';
import plus from '../assets/plus.svg';
import { getRequest, postRequest } from '../apis/api';
import deleteSvg from '../assets/delete.svg'

function IngredientModal({ ingredient, setIngredient, setIsModalOpen, setIndividualCal }) {
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [search, setSearch] = useState('');
  const [addIngredient, setAddIngredient] = useState([]);
  const [modalIngredient, setModalIngredient] = useState([]);

  useEffect(() => {
    const fetch = async () => {
        const response = await getRequest("/getCategory")
        setCategory([])
        await response.category.map((e) => setCategory((prev) => [...prev, { value : e.code, label : e.codeNm}]))
        setCategory((prev) => [...prev, { value : null, label : "전체"}])
    }
    setModalIngredient(ingredient);
    fetch()

  }, []);

  const categorySelect = async (e) => {
    const response = await postRequest('/getIngredient', { upperListSel: e.value });
    const set = new Set();
    setIngredients(() => response.ingredient.filter(item => {
        if(set.has(item.feedNm)) return false
        set.add(item.feedNm)
        return true
    }))
  };

  const clickIngredient = (item) => {
    if (addIngredient.some(i => i.feedNm === item.feedNm) ||
        modalIngredient.some(i => i.feedNm === item.feedNm)) {
        console.log("이미 추가된 재료입니다.");
        return;
    }
    setAddIngredient(prev => [...prev, { ...item, capacity: 0, capacityType: 'g' }]);
  };

  const ingredientAdd = (item, index) => {
    if (!item.capacity || item.capacity <= 0) {
        console.log("재료가 적어도 1 이상이어야합니다.")
        return;
    }
    setModalIngredient(prev => {
        let nutritionCheck = item

        const volume = nutritionCheck.capacity * (nutritionCheck.capacityType === 'kg' || nutritionCheck.capacityType === 'L' ? 1000 : 1) / 100

        nutritionCheck.mitrQy *= volume // 수분
        nutritionCheck.protQy *= volume // 단백질
        nutritionCheck.clciQy *= volume // 칼슘
        nutritionCheck.phphQy *= volume // 인
        nutritionCheck.fatQy *= volume // 지방
        nutritionCheck.crbQy *= volume // 탄수화물
        nutritionCheck.totEdblfibrQy *= volume // 총식이섬유
        nutritionCheck.naQy *= volume // 나트륨
        nutritionCheck.ptssQy *= volume // 칼륨

        return [...prev, nutritionCheck]
    });

    setAddIngredient(prev => prev.filter((_, idx) => idx !== index));
  };

  const directlyAdd = () => {
    setAddIngredient(prev => [...prev, { feedNm: '', capacity: 0, capacityType: 'g' }]);
  };

  const deleteIngredient = (item, index) => {
    setModalIngredient(prev => prev.filter((_, idx) => idx !== index));
  };

  const exportIngredient = () => {
    setIngredient(modalIngredient);
    close()
  };

  const close = () =>{
    setIsModalOpen(false)
  };

  const removeIngredient = (index) => {
    setAddIngredient((prev) => prev.filter((_, idx) => index !== idx))
  }

  return (
    <div className={style.modalBody}>
      <DropDown className={style.dropdownField} options={category} onSelect={categorySelect} />
      <Input
        className={style.inputField}
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="입력해주세요."
      />
      <div className={style.ingredients}>
        {ingredients
          .filter(e => e.feedNm.includes(search))
          .map(e => (
            <div key={e.feedNm} onClick={() => clickIngredient(e)}>
              {e.feedNm}
            </div>
        ))}
      </div>
      <div className={style.infoRow}>
        <div>
            <span>찾는 식재료가 없으신가요?</span>
            <button onClick={directlyAdd}>
            <img src={plus} alt="plus" />
            <span>직접 추가하기</span>
            </button>
        </div>
        <div className={style.infoText}>직접 입력하신 식재료는 영양 정보 제공이 어려울 수 있습니다.</div>
      </div>
      {addIngredient.map((e, index) => (
        <div key={index} className={style.fieldRow}>
          <Input
            type="text"
            value={e.feedNm}
            onChange={i => setAddIngredient(prev => prev.map((item, idx) => idx === index ? { ...item, feedNm: i.target.value } : item))}
            placeholder="입력해주세요."
            readOnly={e.length === 3}
          />
          <Input
            type="number"
            value={e.capacity}
            onChange={i => setAddIngredient(prev => prev.map((item, idx) => idx === index ? { ...item, capacity: i.target.value } : item))}
            placeholder="입력해주세요."
          />
          <DropDown
            options={[
              { value: 'g', label: 'g' },
              { value: 'kg', label: 'kg' },
              { value: 'ml', label: 'ml' },
              { value: 'L', label: 'L' }
            ]}
            onSelect={i => setAddIngredient(prev => prev.map((item, idx) => idx === index ? { ...item, capacityType: i.value } : item))}
            placeholder="g"
          />
          <Button
            text="추가"
            color="sandBrown"
            onClick={() => ingredientAdd(e, index)}
          />
          <button className={style.delete} onClick={() => removeIngredient(index)}>
            <img src={deleteSvg} />
          </button>
        </div>
      ))}
      {modalIngredient.map((e, index) => (
        <Tag
          key={index}
          text={`${e.feedNm} ${e.capacity}${e.capacityType}`}
          onDelete={() => deleteIngredient(e, index)}
        />
      ))}
      <div className={style.buttonGroup}>
        <Button text="추가하기" color="brown" onClick={exportIngredient} />
        <Button text="닫기" color="sandBrown" onClick={close} />
      </div>
    </div>
  );
}

export default IngredientModal;