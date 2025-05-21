// types/CustomRequest.ts
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  role: "Employee" | "Manager" | "Admin";
  id: string;
}
