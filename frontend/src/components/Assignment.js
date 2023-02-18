import React, { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import { Card, Form, Button, Placeholder } from 'react-bootstrap';
import { isEmpty, pickBy, size } from "lodash";
import { API_URL } from '../common/config';
import { ASSIGNMENTS } from '../common/constants';
import axios from 'axios';
import './Assignment.css';

export function Assignment(props) {
  const { studentList } = props;
  const [assignment, setAssignment] = useState({});
  const [student, setStudent] = useState({});
  const [isValidated, setIsValidated] = useState(false);
  const [formValue, setFormValue] = useState({});
  const [isDone, setIsDone] = useState(false);
  const urlParams = useParams();
  const formRef = useRef(null);

  useEffect(() => {
    checkAssignment();
  }, []);

  // Check unfinished assignments
  const checkAssignment = () => {
    const student = studentList.find(stu => Number(urlParams.id) === stu.id);
    const emptyAssignments = pickBy(student, (value, key) => key.startsWith("answer") && isEmpty(value));
    setStudent(student);
    if (size(emptyAssignments) === 0) {
      setIsDone(true);
    } else {
      setAssignment(ASSIGNMENTS[ASSIGNMENTS.length - size(emptyAssignments)]);
    }
  }

  const onFormChange = (e, inputType) => {
    const name = e.target.name;
    let value;

    // Validation
    if (inputType === 'input') {
      const regChecker = new RegExp(/[a-zA-Z]+\s\d+$/);
      value = e.target.value;
      setIsValidated(!regChecker.test(value) ? false : true);
    } else {
      if (inputType === 'checkbox') {
        if (e.target.checked) {
          value = isEmpty(formValue) ? [e.target.value] : [
            ...formValue[name],
            e.target.value,
          ];
        } else {
          value = formValue[name].filter((uncheckItem) => uncheckItem !== e.target.value);
        }
      } else {
        value = e.target.value;
      }
      setIsValidated(value.length === 0 ? false : true);
    }
    setFormValue({ [name]: value });
  };

  const handleUpdate = () => {
    axios.put(`${API_URL}/students/${urlParams.id}`, formValue).then((response) => {

      console.log(response.data);
      handleNext();
    });
  };

  const handleNext = () => {
    const isLast = assignment.idx === ASSIGNMENTS.length - 1;
    setFormValue({});
    formRef.current.reset();

    isLast ? setIsDone(true) : setAssignment(ASSIGNMENTS[assignment.idx + 1]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false || !isValidated) {
      event.stopPropagation();
    }

    setIsValidated(true);
    handleUpdate();
  };

  return (
    <Card className="text-start">
      <Card.Header>
        Hello <span className="fw-bold">{student.firstName}</span>
        <small className="float-end text-secondary">{assignment.idx+1}/{ASSIGNMENTS.length}</small>
      </Card.Header>
      <Card.Body>
        {isEmpty(assignment) || isDone ?
          isDone ?
            <div>
              All done!
            </div>
          :
          <Placeholder as="p" animation="glow">
            <Placeholder xs={12} />
          </Placeholder>
        :
            <Form ref={formRef} onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>{assignment.question}</Form.Label>
                <div className={assignment.type === 'input' ? '' : 'ms-2'}>
                  {assignment.options.length ? assignment.options.map((opt, oIdx) =>
                    <Form.Check
                      required={assignment.type === 'checkbox' ? false : true}
                      onChange={(e) => onFormChange(e, assignment.type)}
                      type={assignment.type}
                      name={`answer${assignment.idx+1}`}
                      id={`ans-${oIdx}`}
                      key={`ans-${oIdx}`}
                      value={opt}
                      label={opt} />
                  ) : (<Form.Control
                        required
                        onChange={(e) => onFormChange(e, assignment.type)}
                        size="sm"
                        type="text"
                        name={`answer${assignment.idx+1}`}
                        isValid={!isEmpty(formValue) && isValidated}
                        isInvalid={!isEmpty(formValue) && !isValidated}
                        className="d-inline" />)}
                </div>
              </Form.Group>
              <Button
                disabled={!isValidated}
                size="sm"
                variant="primary"
                type="submit">
                Submit
              </Button>
            </Form>
        }
      </Card.Body>
    </Card>
  );
}