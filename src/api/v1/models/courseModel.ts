import { Section } from "./courseSectionModel";

type CourseType = "Required" | "Elective";

export type Course = {
  id: string; // firestore's id string
  program: string;
  term: number;
  courseCode: string;
  courseName: string;
  courseType: CourseType;
  userId: string; // indicate the course information is uploaded by specific student or the overall information set by admin
  courseSections: Section[];
};
