import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';

const prisma = new PrismaClient();

export const getUserReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }

    // Fetch user data
    const user = await prisma.userInput.findUnique({
      where: { id: userId },
      include: {
        resumeAnalyses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        recommendations: {
          include: {
            jobListing: true,
          },
          orderBy: { similarity_score: 'desc' },
        },
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get the latest resume analysis
    const resumeAnalysis = user.resumeAnalyses[0];

    // Prepare the response data
    const responseData = {
      user: {
        id: user.id,
        email: user.email,
        location: user.location,
        preferredJobTypes: user.prefJobType,
      },
      resumeAnalysis: resumeAnalysis ? {
        id: resumeAnalysis.id,
        resumeScore: resumeAnalysis.resumeScore,
        analysis: resumeAnalysis.analysis,
        createdAt: resumeAnalysis.createdAt,
      } : null,
      jobRecommendations: user.recommendations.map(rec => ({
        id: rec.id,
        similarity_score: rec.similarity_score,
        jobListing: rec.jobListing ? {
          id: rec.jobListing.id,
          title: rec.jobListing.title,
          companyName: rec.jobListing.companyName,
          logo: rec.jobListing.logo,
          location: rec.jobListing.location,
          employmentType: rec.jobListing.employmentType,
          experience: rec.jobListing.experience,
          jobTags: rec.jobListing.jobTags,
          description: rec.jobListing.description,
          source_url: rec.jobListing.source_url,
        } : null,
      })),
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching user report:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const downloadUserReportPdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }

    // Fetch user data
    const user = await prisma.userInput.findUnique({
      where: { id: userId },
      include: {
        resumeAnalyses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        recommendations: {
          include: {
            jobListing: true,
          },
          orderBy: { similarity_score: 'desc' },
          take: 5, // Limit to top 5 recommendations for the PDF
        },
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get the latest resume analysis
    const resumeAnalysis = user.resumeAnalyses[0];
    
    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Set the response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=user_report_${userId}.pdf`);
    
    // Pipe the PDF directly to the response
    doc.pipe(res);
    
    // Add content to the PDF
    generatePdfContent(doc, user, resumeAnalysis);
    
    // Finalize the PDF and end the stream
    doc.end();
  } catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

function generatePdfContent(doc: PDFKit.PDFDocument, user: any, resumeAnalysis: any): void {
  // Define colors
  const primaryColor = '#2563EB'; // Blue
  const secondaryColor = '#4B5563'; // Gray
  const accentColor = '#10B981'; // Green
  
  // Define fonts
  doc.font('Helvetica');
  
  // Add cover page
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8fafc');

  // Title
  doc.fontSize(32)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Career Match Report', {
       align: 'center'
     })
     .moveDown(0.5)
     .moveTo(doc.page.width / 2, 220);
  
  // Reset fill color for content pages
  doc.fillColor('black');
  
  // Add user info section
  doc.fontSize(20)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('User Information', { underline: false })
     .moveDown(0.5);
  
  // Add a subtle divider
  doc.moveTo(50, doc.y)
     .lineTo(doc.page.width - 50, doc.y)
     .lineWidth(1)
     .stroke(primaryColor)
     .moveDown(0.5);
     
  doc.fontSize(12)
     .fillColor('black')
     .font('Helvetica')
     .text(`Email: ${user.email || 'N/A'}`)
     .text(`Location: ${user.location || 'N/A'}`)
     .text(`Preferred Job Types: ${user.prefJobType.join(', ') || 'N/A'}`)
     .moveDown(1);

  // Resume analysis section
  if (resumeAnalysis) {
    const analysis = resumeAnalysis.analysis as any;
    
    doc.fontSize(20)
       .fillColor(primaryColor)
       .font('Helvetica-Bold')
       .text('Resume Analysis', { underline: false })
       .moveDown(0.5);
    
    // Add a subtle divider
    doc.moveTo(50, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .lineWidth(1)
       .stroke(primaryColor)
       .moveDown(0.5);
    
    // Score box
    const scoreBoxY = doc.y;
    doc.rect(50, scoreBoxY, 120, 40)
       .fillAndStroke('#E6F0FF', primaryColor);
    
    doc.fontSize(16)
       .fillColor('#000')
       .font('Helvetica-Bold')
       .text(`${resumeAnalysis.resumeScore.toFixed(2)}%`, 
         110, scoreBoxY + 12, 
         { align: 'center' });
    
    doc.fontSize(10)
       .fillColor(secondaryColor)
       .font('Helvetica')
       .text('Overall Score', 
         110, scoreBoxY + 28, 
         { align: 'center' });
    
    doc.moveDown(2);

    // Create a table-like structure for scores
    if (analysis) {
      doc.fontSize(14)
         .fillColor(primaryColor)
         .font('Helvetica-Bold')
         .text('Component Scores:')
         .moveDown(0.5);
      
      const scoreCategories = [
        { name: 'Skills', score: analysis.skills },
        { name: 'Education', score: analysis.education },
        { name: 'Work Experience', score: analysis.work_experience },
        { name: 'Projects & Achievements', score: analysis.achievements_projects },
        { name: 'Formatting', score: analysis.formatting },
        { name: 'Readability', score: analysis.readability },
      ];
      
      // Draw score bars
      scoreCategories.forEach(category => {
        doc.font('Helvetica')
           .fillColor('black')
           .fontSize(12)
           .text(`${category.name}: `, { continued: true })
           .fillColor(primaryColor)
           .font('Helvetica-Bold')
           .text(`${category.score}%`, { align: 'right' });
        
        // Draw score bar
        const startX = 100;
        const width = 300;
        const height = 12;
        
        // Background bar
        doc.rect(startX, doc.y - 17, width, height)
           .fillAndStroke('#E5E7EB', '#D1D5DB');
           
        // Score bar
        const scoreWidth = Math.min(width * (category.score / 100), width);
        
        // Choose color based on score
        let barColor = '#EF4444'; // Red for low score
        if (category.score >= 70) barColor = accentColor; // Green for high score
        else if (category.score >= 40) barColor = '#F59E0B'; // Orange for medium score
        
        doc.rect(startX, doc.y - 17, scoreWidth, height)
           .fill(barColor);
           
        doc.moveDown(0.7);
      });
      
      doc.moveDown(1);
      
      // Key insights
      doc.fontSize(16)
         .fillColor(primaryColor)
         .font('Helvetica-Bold')
         .text('Key Insights:')
         .moveDown(0.5);
      
      // Resume length
      if (analysis.length_details) {
        doc.fontSize(12)
           .fillColor('black')
           .font('Helvetica')
           .text(`• ${analysis.length_details.message} (${analysis.length_details.word_count} words, ~${analysis.length_details.estimated_pages} pages)`)
           .moveDown(0.5);
      }
      
      // Industry detection
      if (analysis.industry_detection) {
        doc.text(`• Detected Industry: ${analysis.industry_detection.detected_industry}`)
           .moveDown(0.5);
      }
      
      // Recommendations
      if (analysis.recommendations && analysis.recommendations.length > 0) {
        doc.fontSize(16)
           .fillColor(primaryColor)
           .font('Helvetica-Bold')
           .text('Recommendations:')
           .moveDown(0.5);
        
        analysis.recommendations.forEach((recommendation: string, i: number) => {
          doc.fontSize(12)
             .fillColor('black')
             .font('Helvetica')
             .text(`${i + 1}. ${recommendation}`)
             .moveDown(0.3);
        });
      }
    }
    
    doc.moveDown(1);
  }

  // Add a page break before job recommendations
  doc.addPage();

  // Job recommendations section
  doc.fontSize(20)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Job Recommendations', { underline: false })
     .moveDown(0.5);
  
  // Add a subtle divider
  doc.moveTo(50, doc.y)
     .lineTo(doc.page.width - 50, doc.y)
     .lineWidth(1)
     .stroke(primaryColor)
     .moveDown(0.5);
  
  if (user.recommendations.length === 0) {
    doc.fontSize(12)
       .fillColor('black')
       .font('Helvetica')
       .text('No job recommendations available.')
       .moveDown(1);
  } else {
    user.recommendations.forEach((rec: any, index: number) => {
      if (rec.jobListing) {
        // Job title with background
        const jobTitleY = doc.y;
        doc.rect(50, jobTitleY - 10, doc.page.width - 100, 30)
           .fillAndStroke('#E6F0FF', primaryColor);
        
        doc.fontSize(14)
           .fillColor(primaryColor)
           .font('Helvetica-Bold')
           .text(`${index + 1}. ${rec.jobListing.title}`, 60, jobTitleY)
           .moveDown(0.6);
        
        // Match score badge
        const matchScore = (rec.similarity_score * 100).toFixed(0);
        const scoreColor = Number(matchScore) >= 80 ? accentColor : (Number(matchScore) >= 60 ? '#F59E0B' : '#EF4444');
        
        doc.fontSize(12)
           .fillColor('black')
           .font('Helvetica-Bold')
           .text(`Company: `, { continued: true })
           .font('Helvetica-Bold')
           .text(`${rec.jobListing.companyName}`)
           .moveDown(0.5);
        
        doc.fontSize(12)
           .fillColor('black')
           .font('Helvetica-Bold')
           .text(`Location: `, { continued: true })
           .font('Helvetica')
           .text(`${rec.jobListing.location}`)
           .moveDown(0.5);
        
        doc.fontSize(12)
           .fillColor('black')
           .font('Helvetica-Bold')
           .text(`Type: `, { continued: true })
           .font('Helvetica')
           .text(`${rec.jobListing.employmentType}`);
        
        // Match score with colored badge
        const matchScoreY = doc.y + 5;
        doc.roundedRect(50, matchScoreY, 85, 22, 5)
           .fillAndStroke(scoreColor, scoreColor);
        
        doc.fontSize(12)
           .fillColor('white')
           .font('Helvetica-Bold')
           .text(`Match: ${matchScore}%`, 57, matchScoreY + 5)
           .moveDown(1);
        
        // Add condensed description
        const truncatedDescription = rec.jobListing.description.length > 200 
          ? rec.jobListing.description.substring(0, 200) + '...'
          : rec.jobListing.description;
        
        doc.fontSize(12)
           .fillColor('black')
           .font('Helvetica-Bold')
           .text('Description: ', { continued: false })
           .moveDown(0.2);
           
        doc.font('Helvetica')
           .text(truncatedDescription)
           .moveDown(0.3);
        
        if (rec.jobListing.source_url) {
          doc.fillColor(primaryColor)
             .text('Source: View Job Post', { link: rec.jobListing.source_url })
             .moveDown(1);
        }
        
        // Add a divider except for the last item
        if (index < user.recommendations.length - 1) {
          doc.moveTo(50, doc.y)
             .lineTo(doc.page.width - 50, doc.y)
             .lineWidth(0.5)
             .stroke('#D1D5DB')
             .moveDown(0.8);
        }
      }
    });
  }

  // Add footer with page number to all pages except the cover
  const totalPages = doc.bufferedPageRange().count;
  for (let i = 1; i < totalPages; i++) {
    doc.switchToPage(i);
    doc.fontSize(10)
       .fillColor(secondaryColor)
       .text(
         `Page ${i + 1} of ${totalPages}`, 
         50, 
         doc.page.height - 50, 
         { align: 'center' }
       );
  }
}