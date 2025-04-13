jest.mock("tesseract.js", () => ({
  //   default: { recognize: jest.fn() },
  recognize: jest.fn(),
}));

import tesseract from "tesseract.js";
import { ocrEachFile } from "../src/api/v1/services/uploadCourseImage/ocrEachFile";

describe("ocr for each file", () => {
  it("should updated the mocked text from image", async () => {
    const mockedCourse: string = "course-3018\nBack-End Development";
    (tesseract.recognize as jest.Mock).mockResolvedValue({
      data: { text: mockedCourse },
    });
    const fileObj: object = {};
    const expectedText: string = "course-3018\\nBack-End Development";

    const actualText: string | null = await ocrEachFile(
      fileObj as Express.Multer.File
    );

    expect(actualText).toBe(expectedText);
  });
  it("should return null if there is no information from iamge", async () => {
    const mockedCourse: string = "";
    (tesseract.recognize as jest.Mock).mockResolvedValue({
      data: { text: mockedCourse },
    });
    const fileObj: object = {};
    const expectedText: null = null;

    const actualText: string | null = await ocrEachFile(
      fileObj as Express.Multer.File
    );

    expect(actualText).toBe(expectedText);
  });
  it("should throw an error when ocr occurs error", async () => {
    (tesseract.recognize as jest.Mock).mockRejectedValue(
      new Error("test error")
    );
    const fileObj: object = { filename: "testfile.png" };
    await expect(ocrEachFile(fileObj as Express.Multer.File)).rejects.toThrow(
      /Error during OCR the file/
    );
  });
});
