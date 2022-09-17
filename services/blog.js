import { connectToDatabase } from '../libs/db';
import { ERRORS } from '../libs/messages';
import { failure, success } from '../libs/response-lib';
import { BlogTable, UserTable } from '../models/Models';

export const createBlog = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    const data = JSON.parse(event.body);
    try {
      await connectToDatabase();
    } catch (error) {
      throw { statusCode: 503, message: ERRORS.DB_UNREACHABLE };
    }

    const dbUserId = await UserTable.find({
      _id: data.userId,
    });
    if (dbUserId > 0) {
      throw { statusCode: 400, message: ERRORS.INVALID_USER };
    }

    const newBlog = await BlogTable.create({
      userId: data.userId,
      title: data.title,
      summary: data.summary,
      description: data.description,
    });
    return success({
      status: true,
      message: 'blog posted',
      newBlog: newBlog,
    });
  } catch (error) {
    return failure({
      status: false,
      error: error,
    });
  }
};

export const getBlogs = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    // const data = JSON.parse(event.body);

    try {
      await connectToDatabase();
    } catch (error) {
      throw { statusCode: 503, message: ERRORS.DB_UNREACHABLE };
    }

    // if (typeof data.authorId === 'undefined') {
    //   throw { statusCode: 400, message: 'Invalid AuthorId, Please try again!' };
    // }

    const blogs = await BlogTable.find();

    if (blogs.length === 0) {
      throw { statusCode: 400, message: ERRORS.NO_BLOG };
    }
    // const updateActivity = await BlogTable.findByIdAndUpdate(
    //   data.userId,
    //   {
    //     $set: {
    //       lastAccessedAt: new Date(),
    //     },
    //   },
    //   { new: true }
    // );

    // if (!updateActivity) {
    //   throw {
    //     statusCode: 400,
    //     message: 'Invalid Blog, Please try again!',
    //   };
    // }
    return success({
      status: true,
      blog: blogs,
    });
  } catch (error) {
    return failure({
      status: false,
      error: error,
    });
  }
};

export const findByUser = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    const data = JSON.parse(event.body);
    try {
      await connectToDatabase();
    } catch (error) {
      throw { statusCode: 503, message: ERRORS.DB_UNREACHABLE };
    }
    const userBlogs = await BlogTable.find({ userId: data.userId });
    return success({
      status: true,
      userBlogs: userBlogs,
    });
  } catch (error) {
    return failure({
      status: false,
      error: error,
    });
  }
};
