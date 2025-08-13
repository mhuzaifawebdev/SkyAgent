import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// Utility: normalize todo document
function normalizeTodo(todo) {
  return {
    ...todo,
    _id: todo._id.toString(),
    id: todo.id ?? todo._id.toString(),
    createdAt: (todo.createdAt instanceof Date
      ? todo.createdAt
      : new Date(todo.createdAt || Date.now())
    ).toISOString(),
  };
}

// GET /api/todos
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('todoApp');

    const todos = await db
      .collection('todos')
      .find({})
      .sort({ pinned: -1, createdAt: -1 })
      .toArray();

    return NextResponse.json(todos.map(normalizeTodo));
  } catch (err) {
    console.error('GET /api/todos error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch todos', details: err.message },
      { status: 500 }
    );
  }
}

// POST /api/todos
export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('todoApp');

    const todoToInsert = {
      ...body,
      id: body.id || Date.now(),
      createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
    };

    const result = await db.collection('todos').insertOne(todoToInsert);

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId.toString(),
      todo: normalizeTodo({ ...todoToInsert, _id: result.insertedId }),
    });
  } catch (err) {
    console.error('POST /api/todos error:', err);
    return NextResponse.json(
      { error: 'Failed to add todo', details: err.message },
      { status: 500 }
    );
  }
}

// PUT /api/todos
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, _id, ...updateFields } = body;

    if (updateFields.createdAt) {
      updateFields.createdAt = new Date(updateFields.createdAt);
    }

    const client = await clientPromise;
    const db = client.db('todoApp');

    let result;
    let query;

    if (id !== undefined) {
      query = { id };
      result = await db.collection('todos').updateOne(query, { $set: updateFields });
    }

    if ((!result || result.matchedCount === 0) && _id) {
      query = { _id: new ObjectId(_id) };
      result = await db.collection('todos').updateOne(query, { $set: updateFields });
    }

    return NextResponse.json({
      success: true,
      matchedCount: result?.matchedCount || 0,
      modifiedCount: result?.modifiedCount || 0,
      query,
    });
  } catch (err) {
    console.error('PUT /api/todos error:', err);
    return NextResponse.json(
      { error: 'Failed to update todo', details: err.message },
      { status: 500 }
    );
  }
}

// DELETE /api/todos
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id, _id } = body;

    const client = await clientPromise;
    const db = client.db('todoApp');

    let result;
    let query;

    if (id !== undefined) {
      query = { id };
      result = await db.collection('todos').deleteOne(query);
    }

    if ((!result || result.deletedCount === 0) && _id) {
      query = { _id: new ObjectId(_id) };
      result = await db.collection('todos').deleteOne(query);
    }

    return NextResponse.json({
      success: true,
      deletedCount: result?.deletedCount || 0,
      query,
    });
  } catch (err) {
    console.error('DELETE /api/todos error:', err);
    return NextResponse.json(
      { error: 'Failed to delete todo', details: err.message },
      { status: 500 }
    );
  }
}

// OPTIONS /api/todos
export async function OPTIONS() {
  try {
    const client = await clientPromise;
    const db = client.db('todoApp');

    await db.admin().ping();
    const collections = await db.listCollections().toArray();
    const todoCount = await db.collection('todos').countDocuments();

    return NextResponse.json({
      status: 'Connected',
      database: 'todoApp',
      collections: collections.map(c => c.name),
      todoCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('OPTIONS /api/todos error:', err);
    return NextResponse.json(
      { status: 'Error', error: err.message, timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
