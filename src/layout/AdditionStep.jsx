import React, { useState, useRef } from 'react'
import Input from '../components/Input'
import plus from '../assets/plus.svg'
import TextareaAutosize from 'react-textarea-autosize'
import deleteSvg from '../assets/delete.svg'
import style from './AdditionStep.module.css'

const AdditionStep = ({ description, setDescription }) => {
    const descriptionAdd = () => {
        if(description.length >= 9){
            console.log("9개가 최대입니다.")
        }
        setDescription((prev) => (
            [...prev, { description : '', image : ''}]
        ))
    }

    const inputImage = (e, index) => {
        const file = e.target.files[0]

        setDescription(prev => (
            prev.map((item, idx) => idx === index ? { ...item, image : file} : item)
        ))
    }

    const inputDescription = (e, index) => {
        setDescription((prev) => (
            prev.map((item, idx) => idx === index ? {...item, description : e.target.value} : item)
        ))
    }
    const deleteDescription = (index) => {
        setDescription((prev) => (
            prev.filter((item, idx) => idx !== index)
        ))
    }
  return (
    <div className={style.container}>
        {
            description.map((e, index) => (
                <Step
                    key={index}
                    count={index}
                    item={e}
                    inputDescription={inputDescription}
                    inputImage={inputImage}
                    deleteDescription={deleteDescription}
                />
            ))
        }
        <button className={style.addButton} onClick={descriptionAdd}>
            <img src={plus} alt="plus" />
            <span>다음 단계 추가</span>
        </button>
    </div>
  )
}

const Step = ({ count, item, inputDescription, inputImage, deleteDescription }) =>{
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef(null)
    return (
        <div className={style.stepCard}>
            <div className={style.stepHeader}>
                <span className={style.stepTitle}>
                    {`Step ${count + 1}.`}
                </span>
                <button className={style.delete} onClick={() => deleteDescription(count)}>
                    <img src={deleteSvg} alt="delete"/>
                </button>
            </div>
            <div className={style.stepBody}>
                <div
                  className={`${style.imageBox} ${style.imageUploadArea} ${isDragging ? style.highlight : ''}`}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={e => { e.preventDefault(); setIsDragging(false) }}
                  onDrop={e => {
                    e.preventDefault()
                    setIsDragging(false)
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      // simulate file input event
                      inputImage({ target: { files: [e.dataTransfer.files[0]] } }, count)
                    }
                  }}
                  onClick={() => fileInputRef.current.click()}
                >
                  {item.image
                    ? <img src={URL.createObjectURL(item.image)} alt={`step-${count}`} />
                    : <p className={style.uploadText}>Drag & Drop 또는 클릭하여 업로드</p>
                  }
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={style.hiddenInput}
                    onClick={e => e.stopPropagation()}
                    onChange={e => inputImage(e, count)}
                  />
                </div>
                <div className={style.textareaBox}>
                    <TextareaAutosize 
                        maxRows={10}
                        minRows={5}
                        cacheMeasurements={true}
                        value={item.description}
                        onChange={(e) => inputDescription(e, count)}
                    />
                </div>
            </div>
        </div>
    )
}

export default AdditionStep