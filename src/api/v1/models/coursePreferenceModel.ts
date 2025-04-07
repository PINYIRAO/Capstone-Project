type NotAvailableTime = [number, number, number];
type NotAvailableTimeSpots = NotAvailableTime[];
type PreferenceForInstructor = {
  goFor: string[]; // the instructor's name
  notGoFor: string[]; // the instructor's name
};
type PreferenceForLectureType = {
  lecture: string[]; // the section code for lecture type
  online: string[]; // the section code for online type
  mixed: string[]; // the course code for mixed type
};

type PreferenceForSection = {
  goFor: string[]; // the section's code
  notGoFor: string[]; // the section's code
};

type ElectiveSelection = string[]; // select which elective courses, including course codes

// sort the schedule
type SortOption = "daysGoToCampus" | "daysAttendMorningClass";
export type SortOptions = [] | [SortOption] | [SortOption, SortOption]; // sort will consider the sort field order, the front one has a higher priority

export type SchedulePreferenceQuery = {
  notAvailableTimeSpots?: NotAvailableTimeSpots;
  preferenceForInstructor?: PreferenceForInstructor;
  preferenceForLectureType?: PreferenceForLectureType;
  preferenceForSection?: PreferenceForSection;
  electiveSelection?: ElectiveSelection;
  sortOptions?: SortOptions;
};
