import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { CreateUserInputDTO } from '../types';
const prisma = new PrismaClient();
export class UserInputController {
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { email, expectedSalary, location, prefJobType } = req.body as CreateUserInputDTO;
      const file = req.file;
      
      if (!file) {
        res.status(400).json({ error: 'Resume file is required' });
        return;
      }

      let jobTypes: string[] = [];
      if (prefJobType) { 
        if (Array.isArray(prefJobType)) {
          jobTypes = prefJobType;
        } else if (typeof prefJobType === 'string') {
          if (prefJobType.includes(',')) {
            jobTypes = prefJobType.split(',').map(type => type.trim());
          } else {
            jobTypes = [prefJobType.trim()];
          }
        }
      }
      
      const userInput = await prisma.userInput.create({
        data: {
          email,
          emailStatus: false,
          paymentStatus: false,
          resume: file.path,
          expectedSalary: parseInt(expectedSalary.toString()),
          location,
          prefJobType: jobTypes,
        },
      });
      
      res.status(201).json(userInput);
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  }
  
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userInput = await prisma.userInput.findUnique({
        where: { id },
      });
      
      if (!userInput) {
        res.status(404).json({ error: 'User input not found' });
        return;
      }
      
      res.json(userInput);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  }
  
  public async getResume(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userInput = await prisma.userInput.findUnique({
        where: { id },
        select: { resume: true }
      });
      
      if (!userInput?.resume) {
        res.status(404).json({ error: 'Resume not found' });
        return;
      }
      
      res.sendFile(userInput.resume, { root: '.' });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  }
  
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { email, expectedSalary, location, prefJobType } = req.body as CreateUserInputDTO;
      const file = req.file;
      
      const existingUserInput = await prisma.userInput.findUnique({
        where: { id },
      });
      
      if (!existingUserInput) {
        res.status(404).json({ error: 'User input not found' });
        return;
      }
      
      if (file && existingUserInput.resume) {
        fs.unlinkSync(existingUserInput.resume);
      }
      
      let jobTypes: string[] | undefined;
      if (prefJobType) {
        if (Array.isArray(prefJobType)) {
          jobTypes = prefJobType;
        } else {
          jobTypes = prefJobType.split(', ');
        }
      }
      
      const updatedUserInput = await prisma.userInput.update({
        where: { id },
        data: {
          email,
          expectedSalary: expectedSalary ? parseInt(expectedSalary.toString()) : undefined,
          location,
          resume: file ? file.path : existingUserInput.resume,
          prefJobType: jobTypes,
        },
      });
      
      res.json(updatedUserInput);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  }
}

export default new UserInputController();