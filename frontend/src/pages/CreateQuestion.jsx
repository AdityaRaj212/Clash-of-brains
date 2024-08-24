import React, { useContext, useState } from 'react';
import styles from './CreateQuestion.module.css';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const CreateQuestion = () => {
    const navigate = useNavigate();

    const { user } = useContext(AuthContext);

    const [questionText, setQuestionText] = useState('');
    const [questionImage, setQuestionImage] = useState(null);
    const [options, setOptions] = useState([{ text: '', file: null }, { text: '', file: null }]);
    const [difficulty, setDifficulty] = useState('3');
    const [points, setPoints] = useState(1);
    const [topic, setTopic] = useState('');
    const [time, setTime] = useState(30);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);

    const handleAddOption = () => {
        setOptions([...options, { text: '', file: null }]);
    };

    const handleRemoveOption = (index) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...options];
        if (field === 'file') {
            newOptions[index].file = value;
        } else {
            newOptions[index].text = value;
        }
        setOptions(newOptions);
    };

    const handleBack = () => {
        navigate('/admin-panel');
    }

    const isValid = () => {
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let option = [];
            options.forEach(opt => {
                let obj = {
                    text: opt.text,
                    image: opt.file
                };
                option.push(obj);
            });

            const formData = {
                questionText,
                questionImage,
                option,
                answer: selectedOptionIndex,
                points,
                difficulty,
                topic,
                time,
                uploadedBy: user._id
            };

            console.log(formData);

            const response = await axios.post('/api/question/create', formData);

            if (response.status===201) {
                toast.success('Question created successfully!');
                // Optionally, reset form fields or show success message
                setQuestionText('');
                setQuestionImage(null);
                setOptions([{ text: '', file: null }, { text: '', file: null }]);
                setDifficulty('3');
                setPoints(1);
                setTopic('');
                setTime(30);
                setSelectedOptionIndex(null);
            } else {
                toast.error('Failed to create question.');
            }

        } catch (error) {
            toast.error('Error creating question: ' + error.message);
        }
    };

    return (
        <div className={styles.container}>
            <Form onSubmit={handleSubmit}>
                <div className={styles.wrapper}>
                    <div className={`${styles.title} ${styles.centerAlign}`}>
                        Question
                    </div>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridQuestion">
                            <Form.Label>Text</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Write question here"
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                                className={styles.textarea}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formFile" className="mb-3">
                            <Form.Label>Figure</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setQuestionImage(e.target.files[0])}
                            />
                        </Form.Group>
                    </Row>
                </div>

                <div className={styles.wrapper}>
                    <div className={`${styles.title} ${styles.centerAlign}`}>
                        Options
                    </div>
                    {options.map((option, index) => (
                        <div key={index} className={styles.wrapper}>
                            <Row className="mb-3">
                                <Col xs={1} className="d-flex align-items-center">
                                    <Form.Check
                                        type='radio'
                                        name='options'
                                        id={`option-${index}`}
                                        label={`Option ${index + 1}`}
                                        checked={selectedOptionIndex === index}
                                        onChange={() => setSelectedOptionIndex(index)}
                                    />
                                </Col>
                                <Form.Group as={Col} controlId={`formGridOptionText-${index}`}>
                                    <Form.Label>Text</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="Write option text here"
                                        value={option.text}
                                        onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                                        className={styles.textarea}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId={`formFileOption-${index}`} className="mb-3">
                                    <Form.Label>Figure</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleOptionChange(index, 'file', e.target.files[0])}
                                    />
                                </Form.Group>
                                {options.length > 2 && (
                                    <Col xs={1} className="d-flex align-items-center">
                                        <Button variant="danger" onClick={() => handleRemoveOption(index)}>
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </Button>
                                    </Col>
                                )}
                            </Row>
                        </div>
                    ))}
                    <div className={styles.btnContainer}>
                        <Button variant="success" onClick={handleAddOption}>
                            Add Option
                        </Button>
                    </div>
                </div>

                <div className={styles.wrapper}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridDifficulty">
                            <Form.Label>Difficulty</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </Form.Select>
                                <InputGroup.Text id="basic-addon2">
                                    <FontAwesomeIcon icon={faStar} />
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPoints">
                            <Form.Label>Points</Form.Label>
                            <Form.Control
                                type='number'
                                value={points}
                                min={1}
                                onChange={(e) => setPoints(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridTopic">
                            <Form.Label>Topic</Form.Label>
                            <Form.Control
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridTime">
                            <Form.Label>Time (in seconds)</Form.Label>
                            <Form.Control
                                type='number'
                                value={time}
                                min={5}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </Form.Group>
                    </Row>
                </div>
                
                <div className={styles.btnContainer}>
                    <Button variant="primary" onClick={handleBack}>
                        Back
                    </Button>
                    <Button variant="primary" type="submit">
                        Create Question
                    </Button>
                </div>
            </Form>
            <ToastContainer />
        </div>
    );
};

export default CreateQuestion;
