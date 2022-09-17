const connectToDatabase = require('../libs/db');
const { BlogTable } = require('../models/Models');
const { failure, success } = require('../libs/response-lib');
const { ERRORS, STRINGS } = require('../libs/messages');

export const get = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    const data = JSON.parse(event.body);

    try {
      await connectToDatabase();
    } catch (error) {
      throw { statusCode: 503, message: ERRORS.DB_UNREACHABLE };
    }

    if (typeof data.authorId === 'undefined') {
      throw { statusCode: 400, message: 'Invalid AuthorId, Please try again!' };
    }

    const books = await BlogTable.find({
      authorId: data.authorId,
      new: true,
    });

    if (!books) {
      throw { statusCode: 400, message: ERRORS.NO_BOOK };
    }
    const updateActivity = await BlogTable.findByIdAndUpdate(
      data.userId,
      {
        $set: {
          lastAccessedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updateActivity) {
      throw {
        statusCode: 400,
        message: 'Invalid Blog, Please try again!',
      };
    }
    return success({
      status: true,
      books: books,
    });
  } catch (error) {
    return failure({
      status: false,
      error: error,
    });
  }
};
