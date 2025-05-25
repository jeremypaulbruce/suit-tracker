export const createTable = `
  CREATE TABLE insights (
    id INTEGER PRIMARY KEY ASC NOT NULL,
    brandId INTEGER NOT NULL,
    createdAt TEXT NOT NULL,
    text TEXT NOT NULL
  )
`;

export type Row = {
  id: number;
  brandId: number;
  createdAt: string;
  text: string;
};

export type Insert = {
  id: number;
  brandId: number;
  createdAt: string;
  text: string;
};

export const insertStatement = `INSERT INTO insights (brandId, text, createdAt) VALUES (?, ?, ?)`;

export const deleteStatement = `DELETE FROM insights WHERE id = ? LIMIT 1`;

export const listStatement = `SELECT * FROM insights ORDER BY createdAt DESC LIMIT 10`;

export const getByIdStatement = "SELECT * FROM insights WHERE id = ? LIMIT 1";
