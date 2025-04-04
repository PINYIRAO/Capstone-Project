export default [
  {
    program: "Application Design and Delivery",
    term: 3,
    id: "1234",
    courseCode: "COMP-3018",
    courseName: "Back-End Development",
    courseType: "Required",
    userId: "admin",
    courseSections: [
      {
        sectionCode: "COMP-3018-FTE01",
        sectionName: "Back-End Development",
        sectionInstructor: "Christine Stone",
        sectionDeliveryType: "Mixed", // Lecture, Online
        sectionStartDate: "2025-01-06T00:00:00.000",
        sectionEndDate: "2025-04-25T00:00:00.000",
        sectionSeats: 30,
        sectionSchedules: [
          {
            day: 2, // T (Tuesday)
            deliveryType: "Lecture",
            startTime: 12,
            endTime: 15,
            location: "72640 Timothy Hills Suite 726\nMooreshire, MN 86382",
          },
          {
            day: 3, // W (Wednesday)
            deliveryType: "Online",
            startTime: 13,
            endTime: 16,
            location: "116 Brandon Heights Apt. 381\nKevinmouth, CA 77175",
          },
        ],
      },
      {
        sectionCode: "COMP-3018-FTE02",
        sectionName: "Back-End Development",
        sectionInstructor: "Elizabeth Lee",
        sectionDeliveryType: "Mixed", // Lecture, Online
        sectionStartDate: "2025-01-06T00:00:00.000",
        sectionEndDate: "2025-04-25T00:00:00.000",
        sectionSeats: 30,
        sectionSchedules: [
          {
            day: 1, // M (Monday)
            deliveryType: "Lecture",
            startTime: 8,
            endTime: 11,
            location: "7129 Baird Terrace\nKennethshire, MA 74275",
          },
          {
            day: 4, // Th (Thursday)
            deliveryType: "Online",
            startTime: 14,
            endTime: 17,
            location: "116 Brandon Heights Apt. 381\nKevinmouth, CA 77175",
          },
        ],
      },
      {
        sectionCode: "COMP-3018-FTE03",
        sectionName: "Back-End Development",
        sectionInstructor: "Marissa Shepherd",
        sectionDeliveryType: "Mixed", // Lecture, Online
        sectionStartDate: "2025-01-06T00:00:00.000",
        sectionEndDate: "2025-04-25T00:00:00.000",
        sectionSeats: 30,
        sectionSchedules: [
          {
            day: 2, // T (Tuesday)
            deliveryType: "Lecture",
            startTime: 15,
            endTime: 18,
            location: "8568 Megan Inlet\nHelenshire, IN 46080",
          },
          {
            day: 3, // W (Wednesday)
            deliveryType: "Online",
            startTime: 13,
            endTime: 16,
            location: "116 Brandon Heights Apt. 381\nKevinmouth, CA 77175",
          },
        ],
      },
      {
        sectionCode: "COMP-3018-FTO01",
        sectionName: "Back-End Development",
        sectionInstructor: "Christine Stone",
        sectionDeliveryType: "Online",
        sectionStartDate: "2025-01-06T00:00:00.000",
        sectionEndDate: "2025-04-25T00:00:00.000",
        sectionSeats: 30,
        sectionSchedules: [
          {
            day: 2, // T (Tuesday)
            deliveryType: "Online",
            startTime: 8,
            endTime: 11,
            location: "116 Brandon Heights Apt. 381\nKevinmouth, CA 77175",
          },
          {
            day: 1, // M (Monday)
            deliveryType: "Online",
            startTime: 12,
            endTime: 15,
            location: "116 Brandon Heights Apt. 381\nKevinmouth, CA 77175",
          },
        ],
      },
    ],
  },
];

const courseObj: object = {
  program: "Application Design and Delivery",
  term: 3,
  id: "1234",
  courseCode: "COMP-3018",
  courseName: "Back-End Development",
  courseType: "Required",
  userId: "admin",
  courseSections: [
    {
      sectionCode: "COMP-3018-FTE01",
      sectionName: "Back-End Development",
      sectionInstructor: "Christine Stone",
      sectionDeliveryType: "Mixed", // Lecture, Online
      sectionStartDate: "2025-01-06T00:00:00.000",
      sectionEndDate: "2025-04-25T00:00:00.000",
      sectionSeats: 30,
      sectionSchedules: [
        {
          day: 2, // T (Tuesday)
          deliveryType: "Lecture",
          startTime: 12,
          endTime: 15,
          location: "72640 Timothy Hills Suite 726\nMooreshire, MN 86382",
        },
        {
          day: 3, // W (Wednesday)
          deliveryType: "Online",
          startTime: 13,
          endTime: 16,
          location: "116 Brandon Heights Apt. 381\nKevinmouth, CA 77175",
        },
      ],
    },
    {
      sectionCode: "COMP-3018-FTE02",
      sectionName: "Back-End Development",
      sectionInstructor: "Elizabeth Lee",
      sectionDeliveryType: "Mixed", // Lecture, Online
      sectionStartDate: "2025-01-06T00:00:00.000",
      sectionEndDate: "2025-04-25T00:00:00.000",
      sectionSeats: 30,
      sectionSchedules: [
        {
          day: 1, // M (Monday)
          deliveryType: "Lecture",
          startTime: 8,
          endTime: 11,
          location: "7129 Baird Terrace\nKennethshire, MA 74275",
        },
        {
          day: 4, // Th (Thursday)
          deliveryType: "Online",
          startTime: 14,
          endTime: 17,
          location: "116 Brandon Heights Apt. 381\nKevinmouth, CA 77175",
        },
      ],
    },
    {
      sectionCode: "COMP-3018-FTE03",
      sectionName: "Back-End Development",
      sectionInstructor: "Marissa Shepherd",
      sectionDeliveryType: "Mixed", // Lecture, Online
      sectionStartDate: "2025-01-06T00:00:00.000",
      sectionEndDate: "2025-04-25T00:00:00.000",
      sectionSeats: 30,
      sectionSchedules: [
        {
          day: 2, // T (Tuesday)
          deliveryType: "Lecture",
          startTime: 15,
          endTime: 18,
          location: "8568 Megan Inlet\nHelenshire, IN 46080",
        },
        {
          day: 3, // W (Wednesday)
          deliveryType: "Online",
          startTime: 13,
          endTime: 16,
          location: "116 Brandon Heights Apt. 381\nKevinmouth, CA 77175",
        },
      ],
    },
    {
      sectionCode: "COMP-3018-FTO01",
      sectionName: "Back-End Development",
      sectionInstructor: "Christine Stone",
      sectionDeliveryType: "Online",
      sectionStartDate: "2025-01-06T00:00:00.000",
      sectionEndDate: "2025-04-25T00:00:00.000",
      sectionSeats: 30,
      sectionSchedules: [
        {
          day: 2, // T (Tuesday)
          deliveryType: "Online",
          startTime: 8,
          endTime: 11,
          location: "116 Brandon Heights Apt. 381\nKevinmouth, CA 77175",
        },
        {
          day: 1, // M (Monday)
          deliveryType: "Online",
          startTime: 12,
          endTime: 15,
          location: "116 Brandon Heights Apt. 381\nKevinmouth, CA 77175",
        },
      ],
    },
  ],
};

export { courseObj };
