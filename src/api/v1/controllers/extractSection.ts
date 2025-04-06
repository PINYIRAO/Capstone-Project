import type { Section } from "../models/courseSectionModel";
import type { Class } from "../models/courseSectionModel";
import type { DeliveryType } from "../models/courseSectionModel";
import { extractClassData } from "./extractClass";

// organize the ocr text to the structured course data
export function extractSectionData(inputText: string | null): Section[] | null {
  if (inputText == null) {
    return null;
  } else {
    // first split the text by section sector
    // Example data
    // [
    //   'COMP-3018-FTE01 Add Section to Schedule\\nBack-End Development\\nRuns from 2025-01-06 - 2025-04-25\\nSeats @) Times Locations Instructors\\n4/35/0 T12:00 PM - 3:00 PM Roblin Centre (Prev. PSC), Shabaga, D (Lecture, Online)\\nPrincess Building PSCP312\\n2025-01-06 - 2025-04-25\\nLecture\\nW 1:00 PM - 4:00 PM Roblin Centre (Prev. PSC)\\n2025-01-06 - 2025-04-25 Online\\n'
    // ]
    // [
    //   'COMP-3018-FTE02 Add Section to Schedule\\nBack-End Development\\nRuns from 2025-01-06 - 2025-04-25\\nSeats ® Times Locations Instructors\\n0/35/0 Roblin Centre (Prev. PSC), Bialowas, M (Lecture,\\nM 8:00 AM -11:00 AM Innovation Centre INNE239 Online)\\n2025-01-06 - 2025-04-25\\nLecture\\nTh 2:00 PM - 5:00 PM Roblin Centre (Prev. PSC)\\n2025-01-06 - 2025-04-25 Online\\n'
    // ]
    // console.log(inputText);
    const sectionDeli: RegExp = /(?=COMP-\d+-\w+\d+ Add Section to Schedule)/g;
    const sections: string[] = inputText.split(sectionDeli).filter(Boolean);
    // console.log(sections);
    const sectionsObj: Section[] = [];
    for (const section of sections) {
      let sectionObj: Section;
      let sectionPart0202: string | null;
      let sectionPart0203: string = "";
      let match: string[] | null;
      let sectionSeats: number = -1;
      let sectionInstructor: string = "";
      // set a default value, it should be determined by the classes type
      const sectionLectureType: DeliveryType = "Mixed";
      let sectionCode: string = "NONE";
      let sectionName: string = "NONE";
      let sectionStartDate: Date = new Date("1900-01-01");
      let sectionEndDate: Date = new Date("1900-01-01");

      // split the section into two parts
      const sectionDeli01: RegExp =
        /\\nSeats.*?Times Locations Instructors\\n/g;
      // example data
      // [
      //   'COMP-3018-FTE01 Add Section to Schedule\\nBack-End Development\\nRuns from 2025-01-06 - 2025-04-25',
      //   '4/35/0 T12:00 PM - 3:00 PM Roblin Centre (Prev. PSC), Shabaga, D (Lecture, Online)\\nPrincess Building PSCP312\\n2025-01-06 - 2025-04-25\\nLecture\\nW 1:00 PM - 4:00 PM Roblin Centre (Prev. PSC)\\n2025-01-06 - 2025-04-25 Online\\n'
      // ]
      const sectionPart01: string[] = section
        .split(sectionDeli01)
        .filter(Boolean);
      // parse the first part

      const regexDeli0101: RegExp =
        /^(.*?)Add Section to Schedule\\n(.*?)\\nRuns from (\d{4}-\d{2}-\d{2}) - (\d{4}-\d{2}-\d{2})/;
      const SectionPart0101: string[] | null =
        sectionPart01[0].match(regexDeli0101);
      if (SectionPart0101) {
        // example data: COMP-3018-FTE01
        sectionCode = SectionPart0101[1].trim();
        // example data: Back-End Development
        sectionName = SectionPart0101[2].replace(/\\n/g, " ").trim();
        // example data: 2025-01-06T00:00:00.000Z
        sectionStartDate = new Date(SectionPart0101[3]); // sectionStartDate
        // example data: 2025-04-25T00:00:00.000Z
        sectionEndDate = new Date(SectionPart0101[4]); // sectionEndDate
        // console.log(sectionCode, sectionName, sectionStartDate, sectionEndDate);
      } else {
        // if there is no information for course, then exit
        return null;
      }

      // parse the second part
      // 1. parse the instructor
      const regexDeli0201: RegExp = /([A-Za-z]+,\s*[A-Za-z])\s*\(([^)]+)\)/;
      // /([A-Za-z]+,\s*[A-Za-z])\s*\((Lecture|Online|Lecture(,\s*Online)?)/;
      const sectionPart0201: string[] | null =
        sectionPart01[1].match(regexDeli0201);
      if (sectionPart0201) {
        // get the courseInstructor
        // example data: Shabaga, D
        sectionInstructor = sectionPart0201[1];
        // the left are the second part remove the instructor info
        // example data:
        // 4/35/0 T12:00 PM - 3:00 PM Roblin Centre (Prev. PSC), \nPrincess Building PSCP312\n2025-01-06 - 2025-04-25\nLecture\nW 1:00 PM - 4:00 PM Roblin Centre (Prev. PSC)\n2025-01-06 - 2025-04-25 Online\n
        sectionPart0202 = sectionPart01[1]
          .replace(/([A-Za-z]+,\s*[A-Za-z])\s*\(([^)]+)\)/g, "")
          .trim();
      } else {
        // just for in case there is no instructor
        sectionPart0202 = sectionPart01[1];
      }
      // console.log(sectionInstructor, sectionPart0202);
      // parse the seat data
      const seatsRegex: RegExp = /^(\d+)\/(\d+)\/(\d+)\s*/;
      if (sectionPart0202 !== null) {
        match = sectionPart0202.match(seatsRegex);
        if (match) {
          // example data: 35
          sectionSeats = parseInt(match[2], 10);
          // example data:
          // T12:00 PM - 3:00 PM Roblin Centre (Prev. PSC), \nPrincess Building PSCP312\n2025-01-06 - 2025-04-25\nLecture\nW 1:00 PM - 4:00 PM Roblin Centre (Prev. PSC)\n2025-01-06 - 2025-04-25 Online\n
          sectionPart0203 = sectionPart0202.replace(seatsRegex, "").trim();
          // console.log(sectionSeats, sectionPart0203);
        }
      }

      // parse the class data
      const classRegex: RegExp =
        /(?=(?:^|\\n)(?:M|T|W|Th|F|Sat|Sun)(?:\/(?:M|T|W|Th|F|Sat|Sun))*\s\d{1,2}:\d{2}\s(?:AM|PM)\s-\s\d{1,2}:\d{2}\s(?:AM|PM))/gm;

      // example data
      // T12:00 PM - 3:00 PM Roblin Centre (Prev. PSC), \nPrincess Building PSCP312\n2025-01-06 - 2025-04-25\nLecture
      // \nW 1:00 PM - 4:00 PM Roblin Centre (Prev. PSC)\n2025-01-06 - 2025-04-25 Online\n
      let classes: Class[] = [];
      const parts: string[] = sectionPart0203
        .split(classRegex)
        .map((part) => part.trim())
        .filter((p) => p.length > 0);
      if (parts.length !== 0) {
        // parts.forEach((v) => {
        //   console.log(v);
        // });
        parts.forEach((v) => {
          const classObj: Class[] | null = extractClassData(v);
          if (classObj !== null) {
            classes = classes.concat(classObj);
          }
        });
      }
      // console.log(classes);
      // eslint-disable-next-line prefer-const
      sectionObj = {
        sectionCode,
        sectionName,
        sectionInstructor,
        sectionLectureType,
        sectionStartDate,
        sectionEndDate,
        sectionSeats,
        sectionSchedules: classes,
      };
      sectionsObj.push(sectionObj);
    }
    // console.log(JSON.stringify(sectionsObj, null, 2));
    return sectionsObj;
  }
}
