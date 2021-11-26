-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS quizzes CASCADE;
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY NOT NULL,
  creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status BOOLEAN NOT NULL DEFAULT TRUE,
  category VARCHAR(255) NOT NULL,
  cover_image_url TEXT,
  created_at TIMESTAMP
);

DROP TABLE IF EXISTS questions_answers CASCADE;
CREATE TABLE questions_answers (
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  choice_1 TEXT NOT NULL,
  choice_2 TEXT NOT NULL,
  choice_3 TEXT,
  choice_4 TEXT
);

DROP TABLE IF EXISTS results CASCADE;
CREATE TABLE results (
  id SERIAL PRIMARY KEY NOT NULL,
  score INTEGER,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  finish_at TIMESTAMP
);
