jest.mock("../src/api/v1/controllers/extractClass", () => ({
  extractClassData: jest.fn(),
}));
import type { Section } from "../src/api/v1/models/courseSectionModel";
import { extractSectionData } from "../src/api/v1/controllers/extractSection";
import { extractClassData } from "../src/api/v1/controllers/extractClass";

describe("extract section data", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (extractClassData as jest.Mock).mockReturnValue([]);
  });
  it("Should return null when parameter's value is null", () => {
    const inputText: null = null;
    const expectedSections: null = null;

    const actualSections: Section[] | null = extractSectionData(inputText);

    expect(actualSections).toEqual(expectedSections);
  });

  it("Should return null when the parameter value is not the section information", () => {
    const inputText: string = "test string";
    const expectedSections: null = null;

    const actualSections: Section[] | null = extractSectionData(inputText);

    expect(actualSections).toEqual(expectedSections);
  });

  it("Should also handle if there is no instructor info to match", () => {
    const inputText: string =
      "COMP-3018-FTE01 Add Section to Schedule\\nBack-End Development\\nRuns from 2025-01-06 - 2025-04-25\\nSeats @) Times Locations Instructors\\n4/35/0 T12:00 PM - 3:00 PM Roblin Centre (Prev. PSC), \\nPrincess Building PSCP312\\n2025-01-06 - 2025-04-25\\nLecture";
    const expectedSections: Section[] = [
      {
        sectionCode: "COMP-3018-FTE01",
        sectionEndDate: new Date("2025-04-25T00:00:00.000Z"),
        sectionInstructor: "",
        sectionDeliveryType: "Mixed",
        sectionName: "Back-End Development",
        sectionSchedules: [],
        sectionSeats: 35,
        sectionStartDate: new Date("2025-01-06T00:00:00.000Z"),
      },
    ];

    const actualSections: Section[] | null = extractSectionData(inputText);

    expect(actualSections).toEqual(expectedSections);
  });

  it("Should extract the section data", () => {
    const inputText: string =
      "COMP-3018-FTE01 Add Section to Schedule\\nBack-End Development\\nRuns from 2025-01-06 - 2025-04-25\\nSeats @) Times Locations Instructors\\n4/35/0 T12:00 PM - 3:00 PM Roblin Centre (Prev. PSC), Shabaga, D (Lecture, Online)\\nPrincess Building PSCP312\\n2025-01-06 - 2025-04-25\\nLecture\\nW 1:00 PM - 4:00 PM Roblin Centre (Prev. PSC)\\n2025-01-06 - 2025-04-25 Online\\n";
    const expectedSections: Section[] = [
      {
        sectionCode: "COMP-3018-FTE01",
        sectionName: "Back-End Development",
        sectionInstructor: "Shabaga, D",
        sectionDeliveryType: "Mixed",
        sectionStartDate: new Date("2025-01-06"),
        sectionEndDate: new Date("2025-04-25"),
        sectionSeats: 35,
        sectionSchedules: [],
      },
    ];

    const actualSections: Section[] | null = extractSectionData(inputText);

    expect(actualSections).toEqual(expectedSections);
  });
});
