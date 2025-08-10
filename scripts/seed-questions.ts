import { connectDatabase } from '../src/config/db';
import { Question } from '../src/models/Question';
import { QuestionSet } from '../src/models/QuestionSet';

async function main() {
  await connectDatabase();
  const version = 1;
  const exists = await QuestionSet.findOne({ version });
  if (exists) {
    console.log('Question set already exists');
    process.exit(0);
  }
  const questions = Array.from({ length: 20 }, (_, i) => ({
    setVersion: version,
    index: i + 1,
    promptText: `ตัวอย่างโจทย์ข้อ ${i + 1}`,
    choices: [
      { text: 'ตัวเลือก A' },
      { text: 'ตัวเลือก B' },
      { text: 'ตัวเลือก C' },
      { text: 'ตัวเลือก D' },
    ],
    correctIndex: 0,
    hints: [
      { level: 1, text: 'Hint ระดับ 1' },
      { level: 2, text: 'Hint ระดับ 2' },
      { level: 3, text: 'Hint ระดับ 3' },
    ],
    firstTryExplanation: { text: 'ตอบถูกครั้งแรก เยี่ยมมาก!' },
  }));

  await Question.insertMany(questions);
  await QuestionSet.create({ version, isActive: true });
  console.log('Seeded question set v1 with 20 questions');
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
