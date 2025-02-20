CREATE TABLE IF NOT EXISTS public.categories (
  id serial primary key,
  name varchar(64) NOT NULL unique
);

CREATE TABLE IF NOT EXISTS public.questions (
  id serial primary key,
  category_id INT REFERENCES categories(id),
  question_text TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.answers (
  id serial primary key,
  question_id INTEGER REFERENCES questions(id),
  answer_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL
);