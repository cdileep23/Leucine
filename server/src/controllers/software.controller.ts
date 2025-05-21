import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { softwareEntity } from "../entities/software.entity";
import { AuthenticatedRequest } from "../types/user.types";

export class SoftwareController {
  static async createSoftware(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<any> {
    try {
   

      if (req.role !== "Admin") {
        return res.status(403).json({
          message: "Unauthorized Access",
          success: false,
        });
      }
      console.log("admi")
   
      const { name, description, accessLevels } = req.body;
console.log(req.body)
      if (!name || !description||!accessLevels) {
        return res.status(400).json({
          message: "Please provide name, description, and access levels",
          success: false,
        });
      }

      const softwareRepository = AppDataSource.getRepository(softwareEntity);

      const newSoftware = softwareRepository.create({
        name,
        description,
        accessLevels,
      });

      await softwareRepository.save(newSoftware);

      return res.status(201).json({
        message: "Software created successfully",
        success: true,
        software: newSoftware,
      });
    } catch (error) {
      console.error("Error creating software:", error);
      return res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
  }
  static async getSoftwares(req:AuthenticatedRequest,res:Response){
    try {
      const softwareRepo = AppDataSource.getRepository(softwareEntity);
      const softwares = await softwareRepo.find({});
       return res.status(200).json({
         success: true,
         data: softwares,
       });
    } catch (error) {
      console.error("Error fetching Softwares:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}
