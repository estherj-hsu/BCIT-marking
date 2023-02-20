import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Form, Modal } from 'react-bootstrap';
import { startCase } from "lodash";
import { API_URL } from '../common/config';
import { markingApi } from '../common/api';

const STUDENT_FIELDS = ['firstName', 'lastName', 'password', 'email'];

export function StudentList(props) {
  const { studentList, getStudents } = props;
  const [formValue, setFormValue] = useState({});
  const [isValidated, setIsValidated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();

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
    markingApi.post(`${API_URL}/students`, formValue).then((response) => {

      console.log(response.data);
      setFormValue({});
      setIsVisible(false)
      formRef.current.reset();
      getStudents();
    });
  };

  return (
    <Row className="d-flex align-items-center text-center">
      <Col xs={12} className="text-end mb-3">
        <Button
          size="sm"
          onClick={() => setIsVisible(true)}
          variant="outline-secondary">Add Student</Button>
      </Col>
      {studentList.map(student => {
        const isNotReady = student.emptyAssignments !== 0;
        const isDone = !isNotReady && student.emptyMarks === 0;
        return (
          <Col xs={4} className="mb-3">
            <Card>
              <Card.Header>{student.firstName} {student.lastName}</Card.Header>
              <Card.Body>
                <Card.Text>
                  Undone Assignments: {student.emptyAssignments}
                </Card.Text>
                <Button
                  disabled={isDone || isNotReady}
                  className="mx-2"
                  size="sm"
                  onClick={() => navigate(`/instructor/student/${student.id}`)}
                  variant={`${isDone || isNotReady ? 'outline-' : ''}primary`}>
                  {isDone ? 'All Done' : 'Mark'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )
      })}
      <Modal
        show={isVisible}
        onHide={() => setIsVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Form.Group>
              <Row>
                {STUDENT_FIELDS.map((field, idx) =>
                  <Col xs={field !== 'email' ? 6 : 6}>
                    <Form.Control
                      required
                      onChange={e => setFormValue({ ...formValue, [e.target.name]: e.target.value })}
                      size="sm"
                      type="text"
                      placeholder={startCase(field)}
                      name={field}
                      className="d-inline mb-3" />
                  </Col>
                )}
              </Row>
              <Button
                size="sm"
                variant="primary"
                type="submit">
                Create
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </Row>
  );
}