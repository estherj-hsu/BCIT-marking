import React, { useState, useEffect, useRef } from 'react';
import { Card, ListGroup, Form, Button } from 'react-bootstrap';
import { useParams, Link } from "react-router-dom";
import { ASSIGNMENTS } from '../common/constants';
import { API_URL } from '../common/config';
import { isEmpty } from "lodash";
import './Marker.css';
import axios from 'axios';

export function Marker(props) {
  const { studentList } = props;
  const [formValue, setFormValue] = useState({});
  const [isValidated, setIsValidated] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const urlParams = useParams();
  const student = studentList.find(st => st.id === Number(urlParams.id));
  const formRef = useRef(null);

  useEffect(() => {
    checkDone();
  }, []);

  const checkDone = () => {
    const allMarked = student.emptyMarks === 0;
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
    axios.put(`${API_URL}/students/${urlParams.id}`, formValue).then((response) => {

      console.log(response.data);
      setIsDone(true);
    });
  };


  return (
    <Card className="text-start">
      <Card.Header>
        Student: {student && student.firstName}
      </Card.Header>
      <Card.Body>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <ListGroup variant="flush">
            {ASSIGNMENTS.map(que => {
              const answer = que.idx === 1 ? JSON.parse(student[`answer${que.idx + 1}`]).join(', ') : student[`answer${que.idx + 1}`]
              const hasMark = !isEmpty(student[`mark${que.idx + 1}`]);

              return (
                <ListGroup.Item className="py-4">
                  <span className="fw-bold">{que.question}</span><br/>
                  <small className="text-secondary">{answer}</small><br/><br/>
                  <Form.Label className="me-2">Mark:</Form.Label>
                  {hasMark ? student[`mark${que.idx + 1}`] :
                    <Form.Control
                      required
                      disabled={isDone}
                      onChange={e => setFormValue({ ...formValue, [e.target.name]: Number(e.target.value) })}
                      size="sm"
                      type="number"
                      name={`mark${que.idx+1}`}
                      className="d-inline" />
                  }
                </ListGroup.Item>
              )
            })}
          </ListGroup>
          {isDone ?
            <Link to="/instructor">
              <Button
                size="sm"
                variant="outline-primary">
                Back
              </Button>
            </Link>
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