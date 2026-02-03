
import { GoogleGenAI } from "@google/genai";
import { Project, Client, ProjectStatus } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateClientWelcomeEmail = async (client: Client, agencyName: string) => {
  const ai = getAI();
  const prompt = `Generate a warm, professional welcome email for a new client.
    Client: ${client.name}
    Company: ${client.company}
    Agency: ${agencyName}
    Mention that we are excited to start working with them and that their account is now active in our CRM.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (e) { return "Welcome aboard! We've registered your company in our system."; }
};

export const generateStatusEmail = async (project: Project, client: Client, newStatus: ProjectStatus) => {
  const ai = getAI();
  const prompt = `Generate a professional status update email.
    Client: ${client.name}
    Project: ${project.title}
    New Status: ${newStatus}
    Live Link: ${project.liveLink || 'Under development'}
    Deadline: ${project.estDeliveryDate}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) { return "Update: Your project status has changed."; }
};

export const generateInvoiceNotification = async (client: Client, amount: number, dueDate: string) => {
  const ai = getAI();
  const prompt = `Generate a polite invoice notification.
    Client: ${client.name}
    Amount: ৳${amount}
    Due Date: ${dueDate}
    Include a thank you for their business.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (e) { return "A new invoice has been issued for your project."; }
};
