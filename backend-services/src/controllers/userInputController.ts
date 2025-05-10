import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { CreateUserInputDTO } from '../types';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export class UserInputController {
  private transporter: nodemailer.Transporter;
  
  constructor() {
    // Use default values as fallbacks to prevent undefined errors
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    
    // Bind methods to prevent 'this' context issues
    this.create = this.create.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
    this.getById = this.getById.bind(this);
    this.getResume = this.getResume.bind(this);
    this.update = this.update.bind(this);
    this.resendVerification = this.resendVerification.bind(this);
    this.deleteUserInput = this.deleteUserInput.bind(this);
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { email, location, prefJobType } = req.body as CreateUserInputDTO;
      const file = req.file;
     
      if (!file) {
        res.status(400).json({ error: 'Resume file is required' });
        return;
      }

      // Email format validation using regex
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const isValidFormat = emailRegex.test(email);
      
      if (!isValidFormat) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        res.status(400).json({ error: 'Invalid email format' });
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
      
      // Generate a verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date();
      tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Token valid for 24 hours
     
      const userInput = await prisma.userInput.create({
        data: {
          email,
          emailStatus: false, // Email not verified yet
          paymentStatus: false,
          resume: file.path,
          expectedSalary: 0, // placeholder, will be updated later
          location,
          prefJobType: jobTypes,
          verificationToken, // Add these fields to your Prisma schema
          verificationTokenExpiry: tokenExpiry,
        },
      });
      
      try {
        // Send verification email
        await this.sendVerificationEmail(email, verificationToken, userInput.id);
        
        res.status(201).json({
          ...userInput,
          message: 'Please check your email to verify your account'
        });
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Still return success even if email fails, but log the error
        res.status(201).json({
          ...userInput,
          message: 'Account created successfully, but verification email could not be sent'
        });
      }
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  }

  private async sendVerificationEmail(email: string, token: string, userId: string): Promise<void> {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
    const verificationUrl = `${baseUrl}/api/verify-email?token=${token}&userId=${userId}`;
    
    const mailOptions = {
      from: '"Karir.ai" <noreply@yourapp.com>',
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="background-color: #f4f4f4; padding: 30px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(to bottom right, #577C8E, #3A5566); border-radius: 16px; overflow: hidden; box-shadow: 0 8px 20px rgba(45,63,75,0.15);">
            <div style="padding: 40px 30px; text-align: center;">
              <h2 style="color: #ffffff; margin-bottom: 24px; font-size: 24px; font-weight: bold;">Karir.ai Email Verification</h2>
              <div style="background-color: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.3); border-radius: 12px; padding: 30px; margin-bottom: 25px;">
                <p style="font-size: 16px; color: #ffffff; margin-bottom: 20px;">Hi there! 👋<br><br>
                  Thank you for using Karir.ai. Please confirm your email address by clicking the button below to continue with our job matching and CV scoring services.
                </p>
                <div style="margin: 30px 0;">
                  <a href="${verificationUrl}"
                     style="display: inline-block; background-color: #2D3F4B; color: white; padding: 16px 28px; border-radius: 12px; text-decoration: none; font-weight: 500; font-size: 18px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.3s ease;">
                    Verify Email
                  </a>
                </div>
                <p style="font-size: 14px; color: rgba(255,255,255,0.8);">
                  If the button doesn't work, you can also copy and paste this link into your browser:
                </p>
                <p style="word-break: break-all; font-size: 13px; color: rgba(255,255,255,0.9); background-color: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">${verificationUrl}</p>
              </div>
              <p style="font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 20px;">
                This link is valid for 24 hours. If you didn't create this account, you can safely ignore this email.
              </p>
            </div>
            <div style="background-color: rgba(0,0,0,0.15); padding: 20px; text-align: center; font-size: 12px; color: rgba(255,255,255,0.6);">
              <p style="margin: 0;">© 2025 Karir.ai - This is an automated message — please do not reply.</p>
            </div>
          </div>
        </div>
      `
    };  
    
    return this.transporter.sendMail(mailOptions);
  }
 
  public async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token, userId } = req.query;
      
      if (!token || !userId) {
        res.status(400).json({ error: 'Invalid verification link' });
        return;
      }
      
      const userInput = await prisma.userInput.findUnique({
        where: { id: String(userId) },
      });
      
      if (!userInput) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      if (userInput.emailStatus) {
        res.status(200).json({ message: 'Email already verified' });
        return;
      }
      
      if (userInput.verificationToken !== token) {
        res.status(400).json({ error: 'Invalid verification token' });
        return;
      }
      
      const now = new Date();
      if (userInput.verificationTokenExpiry && userInput.verificationTokenExpiry < now) {
        res.status(400).json({ error: 'Verification token has expired' });
        return;
      }
      
      // Update user to mark email as verified
      await prisma.userInput.update({
        where: { id: String(userId) },
        data: {
          emailStatus: true,
          verificationToken: null,
          verificationTokenExpiry: null
        }
      });
      
      res.status(200).json({ message: 'Email successfully verified' });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
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
      const { email, location, prefJobType } = req.body as CreateUserInputDTO;
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
     
      // If email is being changed, validate and set verification required
      let emailUpdate = {};
      if (email && email !== existingUserInput.email) {
        // Email format validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValidFormat = emailRegex.test(email);
        
        if (!isValidFormat) {
          res.status(400).json({ error: 'Invalid email format' });
          return;
        }
        
        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 24);
        
        emailUpdate = {
          email,
          emailStatus: false,
          verificationToken,
          verificationTokenExpiry: tokenExpiry
        };
        
        try {
          // Send verification email for the new address
          await this.sendVerificationEmail(email, verificationToken, id);
        } catch (emailError) {
          console.error('Failed to send verification email:', emailError);
          // Continue with the update even if email fails
        }
      }
     
      let jobTypes: string[] | undefined;
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
     
      const updatedUserInput = await prisma.userInput.update({
        where: { id },
        data: {
          ...emailUpdate,
          expectedSalary: 0, // placeholder, will be updated later
          location,
          resume: file ? file.path : existingUserInput.resume,
          prefJobType: jobTypes,
        },
      });
     
      res.json({
        ...updatedUserInput,
        ...(email && email !== existingUserInput.email ? { message: 'Please check your email to verify the new email address' } : {})
      });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  }
  
  // Method to resend verification email if needed
  public async resendVerification(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const userInput = await prisma.userInput.findUnique({
        where: { id },
      });
      
      if (!userInput) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      if (userInput.emailStatus) {
        res.status(400).json({ message: 'Email is already verified' });
        return;
      }
      
      // Generate new verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date();
      tokenExpiry.setHours(tokenExpiry.getHours() + 24);
      
      await prisma.userInput.update({
        where: { id },
        data: {
          verificationToken,
          verificationTokenExpiry: tokenExpiry
        }
      });
      
      try {
        if (userInput.email) {
          await this.sendVerificationEmail(userInput.email, verificationToken, id);
        } else {
          throw new Error('User email is null');
        }
        res.status(200).json({ message: 'Verification email has been resent' });
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        res.status(500).json({ message: 'Failed to send verification email, please try again later' });
      }
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  }
  
  public async checkEmailStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const userInput = await prisma.userInput.findUnique({
        where: { id },
        select: { 
          emailStatus: true,
          email: true
        }
      });
      
      if (!userInput) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.status(200).json({ 
        emailStatus: userInput.emailStatus,
        email: userInput.email
      });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  }

  public async checkEmailUserInput(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ message: 'Email is required' });
      }

      const user = await prisma.userInput.findFirst({
        where: { email: email },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          emailStatus: true,
        },
      });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({
        id: user.id,
        emailStatus: user.emailStatus,
      });
    } catch (error) {
      console.error('Error checking email status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async deleteUserInput(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deleteResult = await prisma.userInput.deleteMany({
        where: { id },
      });

      if (deleteResult.count === 0) {
        res.status(404).json({ error: 'User input not found or already deleted' });
      } else {
        res.status(200).json({ message: 'User input deleted successfully' });
      }
    } catch (error) {
      console.error('Error deleting user input:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

}

// Create and export a singleton instance of the controller
const userInputController = new UserInputController();
export default userInputController;