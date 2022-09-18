import { connectToDatabase } from '../libs/db';
import { ERRORS, STRINGS } from '../libs/messages';
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

export const getBlog = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    const { id } = event.pathParameters;
    try {
      await connectToDatabase();
    } catch (error) {
      throw { statusCode: 503, message: ERRORS.DB_UNREACHABLE };
    }
    let blog;
    try {
      blog = await BlogTable.findById(id);
    } catch (error) {
      throw { statusCode: 502, message: ERRORS.NO_BLOG };
    }
    return success({
      status: true,
      blog: blog,
    });
  } catch (error) {
    return failure({ status: false, error: error });
  }
};

export const updateBlog = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = event.body;
  try {
    try {
      await connectToDatabase();
    } catch (error) {
      throw { statusCode: 503, message: ERRORS.DB_UNREACHABLE };
    }
    let blog = {};
    for (const key in data) {
      if (data[key] !== undefined && key !== '_v') blog[key] = data[key];
    }
    if (Object.keys(blog).length === 0) {
      return failure({
        status: false,
        error: 'Nothing to update',
      });
    }

    console.log(data, blog);
    const updateResult = await BlogTable.findByIdAndUpdate(data.id, data.body);
    console.log(updateResult);
    return success({
      status: true,
      message: STRINGS.BLOG_UPDATED,
      updatedBlog: updateResult,
    });
    // if (updateResult.isModified) {
    // } else {
    //   throw { statusCode: 400, message: ERRORS.BLOGNOTFOUND };
    // }
  } catch (error) {
    return failure({
      status: false,
      error: error,
    });
  }
};
