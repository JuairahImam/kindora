
import { ObjectId, type Document } from "mongodb";

import { database } from "../../config/mongodb.js";

const USER_COLLECTION = "user";

const userCollection = database.collection<Document>(
  USER_COLLECTION
);

// Get user profile
const getUserProfile = async (userId: string) => {
  if (!ObjectId.isValid(userId)) {
    return null;
  }

  const user = await userCollection.findOne(
    {
      _id: new ObjectId(userId),
    },
    {
      projection: {
        _id: 1,
        name: 1,
        email: 1,
        image: 1,
        emailVerified: 1,
        createdAt: 1,
      },
    }
  );

  return user;
};

// Update user profile
const updateUserProfile = async (
  userId: string,
  data: {
    name?: string;
    image?: string;
  }
) => {
  if (!ObjectId.isValid(userId)) {
    return null;
  }

  const updateData: Record<string, string | Date> = {
    updatedAt: new Date(),
  };

  if (data.name !== undefined) {
    updateData.name = data.name;
  }

  if (data.image !== undefined) {
    updateData.image = data.image;
  }

  const result = await userCollection.findOneAndUpdate(
    {
      _id: new ObjectId(userId),
    },
    {
      $set: updateData,
    },
    {
      returnDocument: "after",
      projection: {
        _id: 1,
        name: 1,
        email: 1,
        image: 1,
        emailVerified: 1,
        createdAt: 1,
      },
    }
  );

  return result;
};

export { getUserProfile, updateUserProfile };
