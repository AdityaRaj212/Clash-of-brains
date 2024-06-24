import React, { useContext, useEffect, useState } from 'react';
import styles from './QuestionPage.module.css';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import { useNavigate, useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuestionPage = () => {
    const navigate = useNavigate();

    const questionId = useParams();

    const { user } = useContext(AuthContext);

    const [questionCreatorId, setQuestionCreatorId] = useState(null);

    const [question, setQuestion] = useState({});

    const [questionText, setQuestionText] = useState('');
    const [questionImage, setQuestionImage] = useState(null);
    const [options, setOptions] = useState([{ text: '', file: null }, { text: '', file: null }]);
    const [difficulty, setDifficulty] = useState('3');
    const [points, setPoints] = useState(1);
    const [topic, setTopic] = useState([]);
    const [time, setTime] = useState(30);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axios.get(`/api/question/get-by-id/${questionId.questionId}`);
                setQuestion(response.data.question);
                setQuestionCreatorId(response.data.question.uploadedBy);
                setQuestionText(response.data.question.questionText || '');
                setDifficulty(response.data.question.difficulty || '3');
                setPoints(response.data.question.points || 1);
                setTopic(response.data.question.topic || '');
                setTime(response.data.question.time || 30);
                setSelectedOptionIndex(response.data.question.answer || null);
                const mappedOptions = response.data.question.option.map(opt => ({
                    text: opt.text || '',
                    file: opt.file || null,
                }));
                setOptions(mappedOptions);
            } catch (err) {
                console.log('Error: ' + err);
                toast.error('Error while fetching question: ' + err);
            } finally {
                setLoading(false); // Set loading to false after fetching
                // console.log('user id ' + user._id);
                // console.log('creator id ' + questionCreatorId._id);
            }
        };

        fetchQuestion();
    }, [questionId]);

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
                // uploadedBy: user._id
            };

            console.log(formData);
            console.log(questionId.questionId);
            const response = await axios.put(`/api/question/update/${questionId.questionId}`, formData);

            if (response.status===201) {
                toast.success('Question updated successfully!');
            } else {
                toast.error('Failed to update question.');
            }

        } catch (error) {
            toast.error('Error updating question: ' + error.message);
        }
    };

    const handleDelete = async (e)=>{
        e.preventDefault();

        try{
            const response = await axios.delete(`/api/question/delete/${questionId.questionId}`);
            console.log(response);
            if(response.status===201){
                navigate('/admin-panel');
                toast.success('Question deleted');
            }else{
                toast.error('Failed to delete question');
            }
        }catch(err){
            toast.error('Error deleting this question: ' + err.message);
        }
    }

    if(loading){
        return (
            <div>
                Loading...
            </div>
        )
    }

    if(user && user._id==questionCreatorId._id){
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
                        <Button variant="primary" className={`${styles.button} ${styles['button-primary']}`} type="submit">
                            Update Question
                        </Button>
                        <Button variant="danger" className={`${styles.button} ${styles['button-danger']}`} onClick={handleDelete}>
                            Delete Question
                        </Button>
                    </div>
                </Form>
                <ToastContainer />
            </div>
        );
    }


    if(user && user._id!=questionCreatorId._id){
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
                                    disabled
                                />
                            </Form.Group>
    
                            <Form.Group as={Col} controlId="formFile" className="mb-3">
                                <Form.Label>Figure</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setQuestionImage(e.target.files[0])}
                                    disabled
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
                                            disabled
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
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId={`formFileOption-${index}`} className="mb-3">
                                        <Form.Label>Figure</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleOptionChange(index, 'file', e.target.files[0])}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>
                            </div>
                        ))}
                    </div>
    
                    <div className={styles.wrapper}>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridDifficulty">
                                <Form.Label>Difficulty</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Select
                                        value={difficulty}
                                        disabled
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
                                    disabled
                                />
                            </Form.Group>
    
                            <Form.Group as={Col} controlId="formGridTopic">
                                <Form.Label>Topic</Form.Label>
                                <Form.Control
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    disabled
                                />
                            </Form.Group>
    
                            <Form.Group as={Col} controlId="formGridTime">
                                <Form.Label>Time (in seconds)</Form.Label>
                                <Form.Control
                                    type='number'
                                    value={time}
                                    min={5}
                                    onChange={(e) => setTime(e.target.value)}
                                    disabled
                                />
                            </Form.Group>
                        </Row>
                    </div>
                </Form>
                <ToastContainer />
            </div>
        );
    }

    
};

export default QuestionPage;
