import tesseract from "tesseract.js";
import { getErrorMessage } from "../../utils/errorUtils";
// do OCR for each file
export async function ocrEachFile(
  file: Express.Multer.File
): Promise<string | null> {
  try {
    const data: tesseract.RecognizeResult = await tesseract.recognize(
      file.path,
      "eng"
    );
    return data.data.text.replace(/\n/g, "\\n") || null;
  } catch (err) {
    throw new Error(
      `Error during OCR the file ${file.filename}: ${getErrorMessage(err)}`
    );
  }
}
