import React from 'react'
import DropDown from '../components/DropDown'

const MyPage = () => {

  const fruitOptions = [
    { value: 'apple',  label: '🍎 Apple' },
    { value: 'banana', label: '🍌 Banana' },
    { value: 'cherry', label: '🍒 Cherry' },
  ];

  const handleSelect = (opt) => {
    console.log('선택된 과일:', opt);
  };

  return (
    <div>
      <DropDown 
        options={fruitOptions}
        placeholder="과일을 고르세요"
        onSelect={handleSelect}
      />
    </div>
  )
}

export default MyPage