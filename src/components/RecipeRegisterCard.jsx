import React, { useState, useCallback } from 'react';
import { Card, Form, Image } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';

const RecipeRegisterCard = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const [instructions, setInstructions] = useState('');

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    }, []);

    // useDropzone 훅을 사용하여 드래그 앤 드롭 기능을 설정
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false,
    });

    // 조리 방법 입력 필드의 값이 변경될 때 호출되는 핸들러
    const handleInstructionsChange = (e) => {
        setInstructions(e.target.value);
    };

    return (
        <Card className="shadow-sm mx-auto" style={{ width: '300px', marginBottom: '1rem' }}>
            <Card.Body className="d-flex flex-column align-items-center">

                <div
                    {...getRootProps()}
                    className="border rounded d-flex justify-content-center align-items-center mb-3"
                    style={{
                        width: '150px', height: '150px',
                        backgroundColor: '#f9f9f9', cursor: 'pointer', overflow: 'hidden',
                    }}
                >
                    <input {...getInputProps()} />

                    {imagePreview ? (
                        <Image
                            src={imagePreview}
                            alt="Recipe step image preview"
                            fluid
                            style={{ maxHeight: '100%', maxWidth: '100%' }}
                        />
                    ) : (
                        <span style={{ fontSize: '2rem', color: '#ccc' }}>+</span>
                    )}
                </div>

                <Form.Group controlId="recipeInstructions" style={{ width: '100%' }}>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="조리 방법"
                        value={instructions}
                        onChange={handleInstructionsChange}
                    />
                </Form.Group>

            </Card.Body>
        </Card>
    );
}

export default RecipeRegisterCard;