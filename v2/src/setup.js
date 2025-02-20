import { readFile } from "node:fs/promises";
import { Database } from "./lib/db.client.js";
import { environment } from "./lib/enviroment.js";
import { logger, logger as loggerSingleton } from "./lib/logger.js";
import { parseQuestionCategory, parseIndexFile } from "./lib/parse.js";
import { join } from "node:path";

const SCHEMA_FILE = "./sql/schema.sql";
const DROP_SCHEMA_FILE = "./sql/drop.sql";
const INSERT_FILE = "./sql/insert.sql";

/**
 * @param {Database} db
 * @param {import('./lib/logger.js').Logger} logger
 * @returns {Promise<boolean>}
 */
async function setupDbFromFiles(db, logger) {
  const dropScript = await readFile(DROP_SCHEMA_FILE);
  const createScript = await readFile(SCHEMA_FILE);
  const insertScript = await readFile(INSERT_FILE);

  if (await db.query(dropScript.toString("utf-8"))) {
    logger.info("schema dropped");
  } else {
    logger.info("schema not dropped, exiting");
    return false;
  }

  if (await db.query(createScript.toString("utf-8"))) {
    logger.info("schema created");
  } else {
    logger.info("schema not created");
    return false;
  }

  if (await db.query(insertScript.toString("utf-8"))) {
    logger.info("data inserted");
  } else {
    logger.info("data not inserted");
    return false;
  }

  return true;
}

async function setupData(db, logger) {
  const inputDir = "../data"; 
  const filePath = join(inputDir, "index.json");

  let indexData;

  try {
    indexData = await readFile(filePath, "utf-8");
  } catch (error) {
    logger.error(`Unable to read file index.json`, { error: error.message });
  }

  if (indexData) {
    const fileItems = parseIndexFile(indexData);

    // Insert categories based on parsed items
    for (const item of fileItems) {
      const subFilePath = join(inputDir, item.file);

      let subFileData;

      try {
        subFileData = await readFile(subFilePath, "utf-8");
      } catch (error) {
        logger.error(`Unable to read file ${subFilePath}`, {
          error: error.message,
        });
        continue;
      }
      if (subFileData) {
        const categoryID = await insertCategory(db, item.title);
        // Parse the other files (js.json, css.json, html.json) as question categories
        const parsedCategory = parseQuestionCategory(subFileData);

        if (parsedCategory) {
          // Insert questions and answers for each category
          await insertQuestionsAndAnswers(db, categoryID, parsedCategory);
        } else {
          logger.error(`Unable to parse category from ${subFilePath}`);
        }
      }
    }
  }

  return true;
}

async function insertCategory(db, title) {
  console.log("Inserting category", title);
  const result = await db.query(
    "INSERT INTO categories (name) VALUES ($1) RETURNING id",
    [title]
  );

  logger.info("Categories inserted into database");

  return result.rows[0].id;
}

/**
 * Helper function to insert questions and answers into the database
 */
async function insertQuestionsAndAnswers(db, categoryID, parsedCategory) {
  const { title, questions } = parsedCategory;

  console.log(title);

  for (const question of questions) {
    console.log("question", question.question, categoryID);
    const result = await db.query(
      "INSERT INTO questions (question_text, category_id) VALUES ($1, $2) RETURNING id",
      [question.question, categoryID]
    );

    const questionId = result.rows[0].id;
    console.log("questionID", questionId);

    // Insert answers for each question
    for (const answer of question.answers) {
      console.log("answer", answer);

      await db.query(
        "INSERT INTO answers (answer_text, question_id, is_correct) VALUES ($1, $2, $3)",
        [answer.answer, questionId, answer.correct]
      );
    }
  }

  logger.info(
    `Questions and answers for category ${title} inserted into database`
  );
}

export { setupData };

async function create() {
  const logger = loggerSingleton;
  const env = environment(process.env, logger);

  if (!env) {
    process.exit(1);
  }

  logger.info("starting setup");

  const db = new Database(env.connectionString, logger);
  db.open();

  const resultFromFileSetup = await setupDbFromFiles(db, logger);

  if (!resultFromFileSetup) {
    logger.info("error setting up database from files");
    process.exit(1);
  }

  let resultFromReadingData;
  try {
    resultFromReadingData = await setupData(db, logger);
  } catch (e) {
    console.log(e);
  }

  if (!resultFromReadingData) {
    logger.info("error reading data from files");
    process.exit(1);
  }

  logger.info("setup complete");
  await db.close();
}

create().catch((err) => {
  console.error("error running setup", err);
});