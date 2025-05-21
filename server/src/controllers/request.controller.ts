import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { RequestEntity } from "../entities/request.entity";
import { UserEntity } from "../entities/user.entity";
import { softwareEntity } from "../entities/software.entity";
import { AuthenticatedRequest } from "../types/user.types";

export class RequestController {
  /**
   * PATCH /api/requests/:id
   * Admin/Manager approves or rejects a software access request
   */
  static async UpdateRequest(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body; // expected: "Approved" or "Rejected"
      const role = req.role;

      if (role !== "Admin" && role !== "Manager") {
        return res.status(403).json({
          success: false,
          error: "Only Admin or Manager can update request status",
        });
      }

      if (!["Approved", "Rejected"].includes(status)) {
        return res.status(400).json({
          success: false,
          error: "Invalid status. Must be 'Approved' or 'Rejected'",
        });
      }

      const requestRepo = AppDataSource.getRepository(RequestEntity);
      const request = await requestRepo.findOne({
        where: { id },
        relations: ["user", "software"],
      });

      if (!request) {
        return res.status(404).json({
          success: false,
          error: "Request not found",
        });
      }

      if (request.status !== "Pending") {
        return res.status(409).json({
          success: false,
          error: "Request has already been processed",
        });
      }

      request.status = status;
      await requestRepo.save(request);

      return res.status(200).json({
        success: true,
        message: `Request has been ${status.toLowerCase()}`,
        data: request,
      });
    } catch (error) {
      console.error("Error updating request:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  /**
   * GET /api/requests
   * Admin/Manager view all pending requests
   */
  static async getAllRequest(req: AuthenticatedRequest, res: Response) {
    try {
      const role = req.role;

      if (role !== "Admin" && role !== "Manager") {
        return res.status(403).json({
          success: false,
          error: "Only Admin or Manager can view requests",
        });
      }

      const requestRepo = AppDataSource.getRepository(RequestEntity);

      const requests = await requestRepo.find({
        relations: {
          user: true,
          software: true,
        },
        where: {
          status: "Pending",
        },
      });

      return res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error) {
      console.error("Error fetching requests:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  /**
   * POST /api/request
   * Employee submits a new software access request
   */
  static async postRequestAccess(req: AuthenticatedRequest, res: Response) {
    try {
      const { softwareId, reason, accessType } = req.body;
      const userId = req.id;
      const role = req.role;

      if (role !== "Employee") {
        return res.status(403).json({
          success: false,
          error: "Only employees can request access",
        });
      }

      if (!softwareId || !reason || !accessType) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
        });
      }

      const requestRepo = AppDataSource.getRepository(RequestEntity);
      const userRepo = AppDataSource.getRepository(UserEntity);
      const softwareRepo = AppDataSource.getRepository(softwareEntity);

      const [user, software] = await Promise.all([
        userRepo.findOneBy({ id: userId }),
        softwareRepo.findOneBy({ id: softwareId }),
      ]);

      if (!user || !software) {
        return res.status(404).json({
          success: false,
          error: "User or software not found",
        });
      }

      const existingRequest = await requestRepo.findOne({
        where: {
          user: { id: userId },
          software: { id: softwareId },
          status: "Pending",
        },
      });

      if (existingRequest) {
        return res.status(409).json({
          success: false,
          error: "Pending request already exists",
        });
      }

      const newRequest = requestRepo.create({
        user,
        software,
        accessType,
        reason,
        status: "Pending",
      });

      await requestRepo.save(newRequest);

      return res.status(201).json({
        success: true,
        message: "Access request submitted successfully",
        data: newRequest,
      });
    } catch (error) {
      console.error("Error creating request:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}
