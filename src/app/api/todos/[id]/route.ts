import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '../../../../lib/db';
import { Todo } from '../../../../entities/Todo';

interface Params {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const ds = await getDataSource();
    const repo = ds.getRepository(Todo);

    const todo = await repo.findOneBy({ id });
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    if (typeof body.title === 'string') {
      todo.title = body.title.trim();
    }
    if ('description' in body) {
      todo.description = body.description ? body.description.trim() : null;
    }
    if (typeof body.completed === 'boolean') {
      todo.completed = body.completed;
    }

    const updated = await repo.save(todo);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('PUT /api/todos/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(Todo);

    const todo = await repo.findOneBy({ id });
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    await repo.remove(todo);
    return NextResponse.json({ message: 'Todo deleted' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/todos/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
