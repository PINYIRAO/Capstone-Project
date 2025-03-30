type DeliveryType = "Lecture" | "Online" | "Mixed";

type Class = {
  day: number;
  lectureType: DeliveryType;
  startTime: number;
  endTime: number;
  location: string;
};

export type Section = {
  sectionCode: string;
  sectionName: string;
  sectionInstructor: string;
  sectionLectureType: DeliveryType;
  sectionStartDate: Date;
  sectionEndDate: Date;
  sectionSeats: number;
  sectionSchedules: Class[];
};
