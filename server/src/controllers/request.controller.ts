import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { RequestEntity } from "../entities/request.entity";
import { UserEntity } from "../entities/user.entity";
import { softwareEntity } from "../entities/software.entity";
import { AuthenticatedRequest } from "../types/user.types";


export class RequestController {

    static async getAllRequest(req:AuthenticatedRequest,res:Response){
        try {
            
        } catch (error) {
            
        }
    }
  static async postRequestAccess(req: AuthenticatedRequest, res: Response) {
    try {
      const { softwareId, reason, accessType } = req.body;
      const userId = req.id; 
    const role=req.role
    if(role!=="Employee"){

    }
     
      if (!softwareId || !reason || !accessType) {
        return res.status(400).json({ error: "Missing required fields" ,success:false});
      }

      const requestRepo = AppDataSource.getRepository(RequestEntity);
      const userRepo = AppDataSource.getRepository(UserEntity);
      const softwareRepo = AppDataSource.getRepository(softwareEntity);


      const [user, software] = await Promise.all([
        userRepo.findOneBy({ id: userId }),
        softwareRepo.findOneBy({ id: softwareId }),
      ]);

      if (!user || !software) {
        return res.status(404).json({ error: "User or software not found",success:false });
      }

      const existingRequest = await requestRepo.findOne({
        where: {
          user: { id: userId },
          software: { id: softwareId },
          status: "Pending",
        },
      });

      if (existingRequest) {
        return res
          .status(409)
          .json({ error: "Pending request already exists",success:false });
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
        data: newRequest,
      });
    } catch (error) {
      console.error("Error creating request:", error);
      return res.status(500).json({ error: "Internal server error" ,success:false});
    }
  }
}
