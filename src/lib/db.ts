import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Todo } from '../entities/Todo';
import path from 'path';
import fs from 'fs';

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  const dbPath = process.env.DATABASE_PATH || './data/todos.db';
  const resolvedPath = path.resolve(process.cwd(), dbPath);
  const dir = path.dirname(resolvedPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let savedDb: Buffer | undefined = undefined;
  if (fs.existsSync(resolvedPath)) {
    savedDb = fs.readFileSync(resolvedPath);
  }

  dataSource = new DataSource({
    type: 'sqljs',
    autoSave: true,
    location: resolvedPath,
    entities: [Todo],
    synchronize: true,
    logging: false,
    database: savedDb
  });

  await dataSource.initialize();

  return dataSource;
}
