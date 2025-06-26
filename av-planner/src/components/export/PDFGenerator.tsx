import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { packages, addOns } from '../../data/packages';

interface PDFGeneratorProps {
  formData: {
    eventName: string;
    eventDate: string;
    location: string;
    guestCount: string;
    eventType: string;
    audioNeeds: string;
    visualNeeds: string;
    lightingNeeds: string;
    specialRequests: string;
    selectedPackage: string;
    addOns: string[];
  };
  pricing: {
    subtotal: number;
    addOnsTotal: number;
    total: number;
    breakdown: any;
  };
  onGenerate?: () => void;
  onError?: (error: string) => void;
}

export const PDFGenerator: React.FC<PDFGeneratorProps> = ({
  formData,
  pricing,
  onGenerate,
  onError
}) => {
  const generatePDF = async () => {
    try {
      onGenerate?.();
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Company branding
      pdf.setFontSize(24);
      pdf.setTextColor(59, 130, 246); // Blue color
      pdf.text('AV PLANNER', margin, 30);
      
      pdf.setFontSize(12);
      pdf.setTextColor(107, 114, 128); // Gray color
      pdf.text('Professional Audiovisual Solutions', margin, 40);
      
      // Quote title
      pdf.setFontSize(18);
      pdf.setTextColor(31, 41, 55); // Dark gray
      pdf.text('EVENT QUOTE', margin, 60);
      
      // Quote number and date
      const quoteNumber = `AV-${Date.now().toString().slice(-6)}`;
      const currentDate = new Date().toLocaleDateString();
      
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`Quote #: ${quoteNumber}`, pageWidth - margin - 50, 50);
      pdf.text(`Date: ${currentDate}`, pageWidth - margin - 50, 60);
      
      let yPosition = 80;
      
      // Event Details Section
      pdf.setFontSize(14);
      pdf.setTextColor(31, 41, 55);
      pdf.text('EVENT DETAILS', margin, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.setTextColor(75, 85, 99);
      
      const eventDetails = [
        ['Event Name:', formData.eventName],
        ['Date:', formatDate(formData.eventDate, 'long')],
        ['Location:', formData.location],
        ['Guest Count:', `${formData.guestCount} guests`],
        ['Event Type:', formData.eventType.charAt(0).toUpperCase() + formData.eventType.slice(1)]
      ];
      
      eventDetails.forEach(([label, value]) => {
        pdf.text(label, margin, yPosition);
        pdf.text(value, margin + 40, yPosition);
        yPosition += 6;
      });
      
      yPosition += 10;
      
      // AV Requirements Section
      pdf.setFontSize(14);
      pdf.setTextColor(31, 41, 55);
      pdf.text('AV REQUIREMENTS', margin, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.setTextColor(75, 85, 99);
      
      const avRequirements = [
        ['Audio Needs:', formData.audioNeeds.charAt(0).toUpperCase() + formData.audioNeeds.slice(1)],
        ['Visual Needs:', formData.visualNeeds.charAt(0).toUpperCase() + formData.visualNeeds.slice(1)],
        ['Lighting Needs:', formData.lightingNeeds.charAt(0).toUpperCase() + formData.lightingNeeds.slice(1)]
      ];
      
      avRequirements.forEach(([label, value]) => {
        pdf.text(label, margin, yPosition);
        pdf.text(value, margin + 40, yPosition);
        yPosition += 6;
      });
      
      yPosition += 15;
      
      // Selected Package Section
      const selectedPackage = packages[formData.selectedPackage];
      if (selectedPackage) {
        pdf.setFontSize(14);
        pdf.setTextColor(31, 41, 55);
        pdf.text('SELECTED PACKAGE', margin, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(12);
        pdf.setTextColor(59, 130, 246);
        pdf.text(`${selectedPackage.name} Package`, margin, yPosition);
        yPosition += 8;
        
        pdf.setFontSize(10);
        pdf.setTextColor(75, 85, 99);
        pdf.text(selectedPackage.description, margin, yPosition);
        yPosition += 10;
        
        // Package features
        pdf.text('Included Features:', margin, yPosition);
        yPosition += 6;
        
        selectedPackage.features.forEach((feature) => {
          if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = 30;
          }
          pdf.text(`• ${feature}`, margin + 5, yPosition);
          yPosition += 5;
        });
        
        yPosition += 10;
      }
      
      // Add-ons Section
      if (formData.addOns.length > 0) {
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = 30;
        }
        
        pdf.setFontSize(14);
        pdf.setTextColor(31, 41, 55);
        pdf.text('SELECTED ADD-ONS', margin, yPosition);
        yPosition += 10;
        
        formData.addOns.forEach(addOnId => {
          const addOn = addOns.find(a => a.id === addOnId);
          if (addOn) {
            pdf.setFontSize(10);
            pdf.setTextColor(75, 85, 99);
            pdf.text(`• ${addOn.name}`, margin, yPosition);
            pdf.text(formatCurrency(addOn.price), pageWidth - margin - 30, yPosition);
            yPosition += 6;
          }
        });
        
        yPosition += 10;
      }
      
      // Special Requests
      if (formData.specialRequests) {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 30;
        }
        
        pdf.setFontSize(14);
        pdf.setTextColor(31, 41, 55);
        pdf.text('SPECIAL REQUESTS', margin, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(10);
        pdf.setTextColor(75, 85, 99);
        const splitText = pdf.splitTextToSize(formData.specialRequests, contentWidth);
        pdf.text(splitText, margin, yPosition);
        yPosition += splitText.length * 5 + 10;
      }
      
      // Pricing Summary
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = 30;
      }
      
      pdf.setFontSize(14);
      pdf.setTextColor(31, 41, 55);
      pdf.text('PRICING SUMMARY', margin, yPosition);
      yPosition += 15;
      
      // Draw pricing table
      const tableStartY = yPosition;
      const tableWidth = contentWidth;
      const rowHeight = 8;
      
      // Table header
      pdf.setFillColor(249, 250, 251);
      pdf.rect(margin, yPosition, tableWidth, rowHeight, 'F');
      pdf.setFontSize(10);
      pdf.setTextColor(31, 41, 55);
      pdf.text('Description', margin + 5, yPosition + 5);
      pdf.text('Amount', pageWidth - margin - 30, yPosition + 5);
      yPosition += rowHeight;
      
      // Package subtotal
      pdf.setTextColor(75, 85, 99);
      pdf.text('Package Subtotal', margin + 5, yPosition + 5);
      pdf.text(formatCurrency(pricing.subtotal), pageWidth - margin - 30, yPosition + 5);
      yPosition += rowHeight;
      
      // Add-ons total
      if (pricing.addOnsTotal > 0) {
        pdf.text('Add-ons Total', margin + 5, yPosition + 5);
        pdf.text(formatCurrency(pricing.addOnsTotal), pageWidth - margin - 30, yPosition + 5);
        yPosition += rowHeight;
      }
      
      // Total
      pdf.setFillColor(59, 130, 246);
      pdf.rect(margin, yPosition, tableWidth, rowHeight, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.text('TOTAL', margin + 5, yPosition + 6);
      pdf.text(formatCurrency(pricing.total), pageWidth - margin - 30, yPosition + 6);
      
      yPosition += rowHeight + 20;
      
      // Terms and Conditions
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 30;
      }
      
      pdf.setFontSize(12);
      pdf.setTextColor(31, 41, 55);
      pdf.text('TERMS & CONDITIONS', margin, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(9);
      pdf.setTextColor(75, 85, 99);
      
      const terms = [
        '• Quote valid for 30 days from date of issue',
        '• 50% deposit required to secure booking',
        '• Setup and breakdown included in pricing',
        '• Professional technical support provided',
        '• Equipment subject to availability',
        '• Cancellation policy: 72 hours notice required'
      ];
      
      terms.forEach(term => {
        pdf.text(term, margin, yPosition);
        yPosition += 5;
      });
      
      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      pdf.text('AV Planner | Professional Audiovisual Solutions', margin, pageHeight - 20);
      pdf.text('Contact: info@avplanner.com | (555) 123-4567', margin, pageHeight - 15);
      pdf.text('Thank you for choosing AV Planner for your event needs!', margin, pageHeight - 10);
      
      // Save the PDF
      const fileName = `AV_Quote_${formData.eventName.replace(/[^a-zA-Z0-9]/g, '_')}_${quoteNumber}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      onError?.('Failed to generate PDF. Please try again.');
    }
  };
  
  return { generatePDF };
};

// Hook for easy PDF generation
export const usePDFGenerator = (formData: any, pricing: any) => {
  const { generatePDF } = PDFGenerator({ formData, pricing });
  
  return {
    generatePDF,
    isSupported: typeof window !== 'undefined' && 'jsPDF' in window
  };
};

export default PDFGenerator;
