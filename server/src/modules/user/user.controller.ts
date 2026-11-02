
import type { Request, Response, NextFunction } from "express";

import {
  getUserProfile,
  updateUserProfile,
} from "./user.service.js";

const getMyProfile = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.jwtPayload?.sub;

    const user = await getUserProfile(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.jwtPayload?.sub;

    const { name, image } = req.body;

    const updatedUser = await updateUserProfile(userId, {
      name,
      image,
    });

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export { getMyProfile, updateMyProfile };
