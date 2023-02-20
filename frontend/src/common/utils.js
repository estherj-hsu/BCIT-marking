import { pickBy, size, isNull } from "lodash";

export function processedStudentData(stu) {
  const emptyAssignments = size(pickBy(stu, (value, key) => key.startsWith("answer") && isNull(value)));
  const emptyMarks = size(pickBy(stu, (value, key) => key.startsWith("mark") && isNull(value)));
  const student = {
    ...stu,
    emptyAssignments,
    emptyMarks
  };

  return student;
}