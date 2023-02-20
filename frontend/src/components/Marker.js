import React, { useState, useEffect, useRef } from 'react';
import { Card, ListGroup, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";
import { ASSIGNMENTS } from '../common/constants';
import { API_URL } from '../common/config';
import { markingApi } from '../common/api';
import { isEmpty } from 'lodash';
import './Marker.css';

export function Marker(props) {
  const { isStudent, studentList, getStudents } = props;
  const [formValue, setFormValue] = useState({});
  const [isValidated, setIsValidated] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const urlParams = useParams();
  const student = studentList.find(st => st.id === Number(urlParams.id));
  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkDone();
  }, []);

  const checkDone = () => {
    const allMarked = student.emptyMarks === 0 || isStudent;
    if (allMarked) {
      setIsDone(true);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false || !isValidated) {
      event.stopPropagation();
    }

    setIsValidated(true);
    handleUpdate();
  };

  const handleUpdate = () => {
    markingApi.put(`${API_URL}/students/${urlParams.id}`, formValue).then((response) => {

      console.log(response.data);
      setIsDone(true);
      getStudents();
    });
  };


  return (
    <Card className="text-start">
      <Card.Header>
        {isStudent ? 'Hi ' : 'Student: '}
        {student && student.firstName} ({student && student.email})
      </Card.Header>
      <Card.Body>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <ListGroup variant="flush">
            {ASSIGNMENTS.map(que => {
              const answer = que.idx === 1 ? JSON.parse(student[`answer${que.idx + 1}`]).join(', ') : student[`answer${que.idx + 1}`]
              const hasMark = !isEmpty(student[`mark${que.idx + 1}`]) || isStudent;

              return (
                <ListGroup.Item className="py-4">
                  <span className="fw-bold">{que.question}</span><br/>
                  <small className="text-secondary">{answer}</small><br/><br/>
                  <Form.Label className="me-2">Mark:</Form.Label>
                  {hasMark ? student[`mark${que.idx + 1}`] :
                    <Form.Control
                      required
                      htmlSize={20}
                      style={{ width:"100px" }}
                      className="d-inline"
                      disabled={isDone}
                      onChange={e => setFormValue({ ...formValue, [e.target.name]: Number(e.target.value) })}
                      size="sm"
                      type="number"
                      name={`mark${que.idx+1}`} />
                  }
                </ListGroup.Item>
              )
            })}
          </ListGroup>
          {isStudent ? null :
            isDone ?
              <Button
                onClick={() => navigate(-1)}
                size="sm"
                variant="outline-primary">
                Back
              </Button>
            :
              <Button
                size="sm"
                variant="primary"
                type="submit">
                Submit
              </Button>
          }
        </Form>
      </Card.Body>
    </Card>
  );
}