import { Calendar } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";

async function fetchData() {
  // set the preference for course
  const notAvailableTimeSpots = [
    [1, 8, 12],
    [2, 8, 12],
  ];
  const preferenceForInstructor = { goFor: [], notGoFor: [] };
  const preferenceForLectureType = {
    lecture: [], // the section code for lecture type
    online: [], // the section code for online type
    mixed: [], // the course code for mixed type
  };
  const preferenceForSection = { goFor: [], notGoFor: [] };
  const electiveSelection = [];
  //   type SortOption = "daysGoToCampus" | "daysAttendMorningClass";
  //   SortOptions = [] | [SortOption] | [SortOption, SortOption];
  const sortOptions = [];

  // get course schedule
  const baseUrl = "http://localhost:3000/api/v1/schedules";
  const queryParams = {
    notAvailableTimeSpots,
    preferenceForInstructor,
    preferenceForLectureType,
    preferenceForSection,
    electiveSelection,
    sortOptions,
  };
  const url = `${baseUrl}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(queryParams, null, 2),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch, status: ${res.status}`);
    }
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error("fetching has error", err.message);
  }
  console.log("Finish fectch data from back end API");
}

// return a type of element id when need to set a new one
function idNum(elementClassname) {
  // get the current filter number to set the new filter id
  const timeSlotFilterEles = document.getElementsByClassName(elementClassname);
  let current_max_id = 0;

  for (let _ = 0; _ < timeSlotFilterEles.length; _++) {
    let eleID = timeSlotFilterEles[_].id;
    let parts = eleID.split("_");
    let eleIDNum = parseInt(parts[parts.length - 1]);
    if (eleIDNum > current_max_id) {
      current_max_id = eleIDNum;
    }
  }
  return current_max_id + 1;
}

// create calendar to display the schedule
function createNewCalendar(schedule) {
  const scheduleContainer = document.getElementById("schedules");
  // console.log(scheduleContainer.id);
  const newScheduleEle = document.createElement("div");
  let newScheduleEleID = idNum("schedule");
  newScheduleEle.id = `schedule_${newScheduleEleID}`;
  newScheduleEle.className = "schedule";
  scheduleContainer.appendChild(newScheduleEle);

  const calendar = new Calendar(newScheduleEle, {
    plugins: [timeGridPlugin],
    initialView: "timeGridFiveDay",
    headerToolbar: {
      left: "prev,next",
      center: "title",
      right: "timeGridFiveDay,timeGridDay",
    },
    slotDuration: "00:30", // 30 mins
    // The initial date displayed when the calendar first loads.
    // initialDate: "2024-11-15",
    initialDate: schedule.initialDate,
    views: {
      timeGridFiveDay: {
        type: "timeGrid",
        duration: { days: 7 },
        buttonText: "7 day",
      },
    },
    events: schedule.events,
  });
  calendar.setOption("slotMinTime", "08:00:00");
  calendar.setOption("slotMaxTime", "22:00:00");
  // remove the all day label
  calendar.setOption("allDaySlot", false);
  // hide the weekends
  calendar.setOption("hiddenDays", [0, 6]);
  calendar.setOption("height", 810);
  calendar.setOption("contentHeight", 760);
  calendar.setOption("expandRows", true);
  // Sets the width-to-height aspect ratio of the calendar.
  calendar.setOption("aspectRatio", 0.2);
  calendar.render();

  const parentElement = document.getElementById(`schedule_${newScheduleEleID}`);
  const toolBarTitle = parentElement.querySelector("h2");
  toolBarTitle.style.fontSize = "12px";
  toolBarTitle.style["white-space"] = "break-spaces";
  toolBarTitle.innerText =
    schedule.numDesc +
    "\n" +
    "Days attend class before 10AM: " +
    [...schedule.daysBefore10].length +
    "\n" +
    "Days go to Compus: " +
    [...schedule.daysToSchool].length;
  // hide the tool bar button
  const toolBarButtonEles = document.getElementsByClassName(`fc-button-group`);
  // toolBarButtonEles.forEach(item => (item.style.display = "none"));
  for (let _ = 0; _ < toolBarButtonEles.length; _++) {
    toolBarButtonEles[_].style.display = "none";
  }
}

async function getCourseSchedule() {
  // check the filter set
  //   let checkFlag = checkFilterValid();
  let checkFlag = false;
  if (!checkFlag) {
    // clear the current shedule
    const scheduleContainer = document.getElementById("schedules");
    scheduleContainer.innerHTML = "";
    // return;
  }

  // prepare the data
  //   const baseData = await getCourseInfoFromJsonForSchedule();
  //   console.log(baseData);
  //   const courseObj = baseData.courseObj;
  //   const sectionObj = baseData.sectionObj;
  //  const courseList = Object.keys(courseObj);
  const courseList = [
    "COMM-2176",
    "COMP-3018",
    "COMP-3019",
    "COMP-3020",
    "COMP-3021",
  ];

  //   // get the filter value
  //   const filterValue = getFilterValue();
  //   console.log(filterValue);

  // generate the schedule data
  //   const schedules = arrangeSchedule(
  //     courseObj,
  //     courseList,
  //     sectionObj,
  //     filterValue,
  //     [],
  //     [],
  //     0
  //   );
  // console.log(schedules);

  const resData = await fetchData();
  const resSchedules = resData.data;

  let schedules = [];

  for (const schedule of resSchedules) {
    let newSingleSchedule = [];
    for (const course of schedule.schedule) {
      for (const section of course.courseSections) {
        for (const scheduleOfSection of section.sectionSchedules) {
          newSingleSchedule.push([
            course.courseCode,
            course.courseName,
            section.sectionStartDate,
            section.sectionEndDate,
            section.sectionCode,
            section.sectionInstructor,
            scheduleOfSection.deliveryType,
            scheduleOfSection.day,
            scheduleOfSection.startTime,
            scheduleOfSection.endTime,
            scheduleOfSection.location,
          ]);
        }
      }
    }
    schedules.push(newSingleSchedule);
  }

  //   if (schedules.length > 200) {
  //     schedules = schedules.slice(0, 50);
  //   }

  // display the schedule
  // clear the current shedule first
  const scheduleContainer = document.getElementById("schedules");
  scheduleContainer.innerHTML = "";

  // if there is no schedule, then display a message
  if (schedules.length == 0) {
    const scheduleContainer = document.getElementById("schedules");
    scheduleContainer.innerHTML = "";
    // console.log(scheduleContainer.id);
    const newScheduleEle = document.createElement("div");
    newScheduleEle.innerText =
      "Oops, No schedule could be applied, Please change your filter setting.";
    newScheduleEle.className = "noschedule";
    scheduleContainer.appendChild(newScheduleEle);
  }

  // if there are scheduels, then diaplay
  // create the attributes for calendar
  //   const weekdaMap = { M: "1", T: "2", W: "3", Th: "4", F: "5" };
  const weekdaMap = { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5" };
  //   const timeMap = {
  //     8: "08:00:00",
  //     9: "09:00:00",
  //     10: "10:00:00",
  //     11: "11:00:00",
  //     12: "12:00:00",
  //     13: "13:00:00",
  //     14: "14:00:00",
  //     15: "15:00:00",
  //     16: "08:00:00",
  //     16: "16:00:00",
  //     17: "17:00:00",
  //     18: "18:00:00",
  //     19: "19:00:00",
  //     20: "20:00:00",
  //     21: "21:00:00",
  //     22: "22:00:00",
  //   };
  const timeMap = {
    8: "08:00:00",
    9: "09:00:00",
    10: "10:00:00",
    11: "11:00:00",
    12: "12:00:00",
    13: "13:00:00",
    14: "14:00:00",
    15: "15:00:00",
    16: "08:00:00",
    16: "16:00:00",
    17: "17:00:00",
    18: "18:00:00",
    19: "19:00:00",
    20: "20:00:00",
    21: "21:00:00",
    22: "22:00:00",
  };
  const colorStyle = [
    "Crimson",
    "Orange",
    "Gold",
    "Orchid",
    "SeaGreen",
    "Teal",
    "DodgerBlue",
    "Purple",
    "Chocolate",
  ];
  let courseColorStyle = {};
  for (let _ = 0; _ < courseList.length; _++) {
    let colorIndex = _ % 9;
    courseColorStyle[courseList[_]] = colorStyle[colorIndex];
  }

  let scheduleForCalendar = [];
  schedules.forEach((singleSchedule) => {
    let courseName,
      sectionName,
      classInstructor,
      classType,
      classWeekday,
      classStartDate,
      classEndDate,
      classStartTime,
      classEndTime,
      classSite;
    let events = [];
    let singleClendar = {};
    let daysToSchool = new Set();
    let daysBefore10 = new Set();
    singleSchedule.forEach((singlClass) => {
      let singleEvent = {};
      courseName = singlClass[1];
      sectionName = singlClass[4];
      classInstructor = singlClass[5];
      classType = singlClass[6];
      classWeekday = weekdaMap[singlClass[7]];
      classStartDate = singlClass[2];
      classEndDate = singlClass[3];
      classStartTime = timeMap[singlClass[8]];
      classEndTime = timeMap[singlClass[9]];
      classSite = singlClass[10];
      if (classType.toUpperCase() == "LECTURE") {
        daysToSchool.add(singlClass[7]);
      }
      if (singlClass[8] < 10 || singlClass[9] < 10) {
        daysBefore10.add(singlClass[7]);
      }
      singleEvent.title = `${sectionName}\n${courseName}\n${classInstructor}\n${classType}\n${classSite}`;
      // console.log(singleEvent.title);
      singleEvent.startRecur = classStartDate;
      singleEvent.endRecur = classEndDate;
      singleEvent.daysOfWeek = [classWeekday];
      singleEvent.startTime = classStartTime;
      singleEvent.endTime = classEndTime;
      singleEvent.color = courseColorStyle[singlClass[0]];
      singleEvent.textColor = "white";
      events.push(singleEvent);
    });
    // console.log(events);
    singleClendar.initialDate = classStartDate;
    singleClendar.events = events;
    singleClendar.daysToSchool = daysToSchool;
    singleClendar.daysBefore10 = daysBefore10;
    scheduleForCalendar.push(singleClendar);
  });

  scheduleForCalendar.sort((a, b) => {
    if ([...a.daysBefore10].length == [...b.daysBefore10].length) {
      return [...a.daysToSchool].length - [...b.daysToSchool].length;
    } else {
      return [...a.daysBefore10].length - [...b.daysBefore10].length;
    }
  });

  let calendarCount = scheduleForCalendar.length;
  scheduleForCalendar.forEach((singleCalendar) => {
    console.log(JSON.stringify(singleCalendar, null, 2));
    singleCalendar.numDesc =
      "Schedule: " +
      (scheduleForCalendar.indexOf(singleCalendar) + 1) +
      "/" +
      calendarCount;
  });

  // use the method to display calendar
  scheduleForCalendar.forEach((item) => {
    createNewCalendar(item);
  });

  // collapse the filter area
  // const butEle = document.getElementById("collapseexpand");
  // const butName = butEle.innerText;
  // // const filterAearEle = document.getElementById("filter_form");
  // if (butName.toUpperCase() == "COLLAPSE FILTER AREA") {
  //   filterAearEle.className = "hidden";
  //   butEle.innerText = "Expand Filter Area";
  //   window.scroll(0, 0);
  // }
}

document.addEventListener("DOMContentLoaded", async function () {
  const getCourseScheduleEle = document.getElementById("bt_get_schedule");
  getCourseScheduleEle.addEventListener("click", getCourseSchedule);
});
