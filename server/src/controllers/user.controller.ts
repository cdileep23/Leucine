import { NextFunction, Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../data-source";
import { UserEntity } from "../entities/user.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/user.types";

const JWT_SECRET = process.env.JWT_SECRET || "your-strong-secret-key";
const COOKIE_NAME = "auth_token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 24 * 60 * 60 * 1000,
};

export class UserController {
  private static readonly VALID_ROLES = ["Employee", "Manager", "Admin"];

  static async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("[HASH] Password hashed successfully");
    return hashedPassword;
  }

  private static async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log(`[AUTH] Password comparison result: ${isMatch}`);
    return isMatch;
  }

  private static generateToken(userId: string, role: string): string {
    const token = jwt.sign({ id: userId, role }, JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log("[TOKEN] Token generated successfully");
    return token;
  }

  private static verifyToken(
    token: string
  ): { id: string; role: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        role: string;
      };
      console.log("[TOKEN] Token verified successfully");
      return decoded;
    } catch (error) {
      console.error("[TOKEN] Token verification failed:", error);
      return null;
    }
  }

  static async signup(req: Request, res: Response): Promise<any> {
    try {
      const { username, password, role } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          message: "Username and password are required",
          success: false,
        });
      }

      if (!UserController.VALID_ROLES.includes(role)) {
        return res.status(400).json({
          message: "Given Role is not supported",
          success: false,
          validRoles: UserController.VALID_ROLES,
        });
      }

      const userRepository = AppDataSource.getRepository(UserEntity);
      const existingUser = await userRepository.findOne({
        where: { username },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
          success: false,
        });
      }

      const hashedPassword = await UserController.hashPassword(password);
      const newUser = userRepository.create({
        username,
        password: hashedPassword,
        role,
      });

      await userRepository.save(newUser);

      const { password: _, ...userWithoutPassword } = newUser;

      return res.status(201).json({
        message: "User created successfully",
        success: true,
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("[SIGNUP] Error:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  }

  static async login(req: Request, res: Response): Promise<any> {
    try {
      const { username, password } = req.body;

      if (!username || !password ) {
        return res.status(400).json({
          message: "Username and password are required",
          success: false,
        });
      }

      const userRepository = AppDataSource.getRepository(UserEntity);
      const user = await userRepository.findOne({ where: { username } });

      if (!user) {
        return res.status(401).json({
          message: "Invalid credentials",
          success: false,
        });
      }
      

      const isPasswordValid = await UserController.comparePassword(
        password,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Invalid credentials",
          success: false,
        });
      }

      const token = UserController.generateToken(user.id, user.role);
      res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        message: "Login successful",
        success: true,
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("[LOGIN] Error:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  }

  static async logout(_: Request, res: Response): Promise<any> {
    res.clearCookie(COOKIE_NAME);
    return res.status(200).json({
      message: "Logout successful",
      success: true,
    });
  }

  static AuthMiddleware: RequestHandler = async (req, res, next) => {
    try {
      const token = req.cookies?.[COOKIE_NAME];
      if (!token) {
        res.status(401).json({ message: "Not authenticated", success: false });
        return;
      }

      const decoded = UserController["verifyToken"](token);
      console.log(decoded);
      if (!decoded) {
        res.status(401).json({ message: "Invalid token", success: false });
        return;
      }

      (req as AuthenticatedRequest).id = decoded.id;
      (req as AuthenticatedRequest).role = decoded.role as
        | "Employee"
        | "Manager"
        | "Admin";

      next();
    } catch (error) {
      console.error("[AUTH] Error:", error);
      res
        .status(401)
        .json({ message: "Authentication failed", success: false });
    }
  };
  static async getUserProfile(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<any> {
    try {
      const userId = req.id;
console.log(userId)
      if (!userId) {
        return res
          .status(401)
          .json({ message: "Unauthorized", success: false });
      }

      const userRepository = AppDataSource.getRepository(UserEntity);
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found", success: false });
      }

      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        message: "User profile fetched successfully",
        success: true,
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("[PROFILE] Error:", error);
      return res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
  }
}
