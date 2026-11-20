import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import nodemailer, { type Transporter } from 'nodemailer';
import cors from 'cors'
// Load environment variables
dotenv.config();

// Create the Express application
const app = express();
const PORT: number = Number(process.env.PORT) || 3000;
app.use(cors())
app.use(express.json())
// Step 1: Create the transporter (your connection to the mail server)
const transporter: Transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
     port: 2525, 
     secure: false,
    connectionTimeout: 10000,
    greetingTimeout: 10000 , 
     socketTimeout: 15000,
    auth: {
        user: String(process.env.SMTP_USER),
        pass: String(process.env.SMTP_PASS),
    }

});

// Step 2: Send the email!
const sendEmail = async (receiver: string, name: string, subject: string) => {
    try {

        const info = await transporter.sendMail({
            from: `MR BLUE Class <${process.env.SENDER_EMAIL}>`,
            to: receiver,
            subject: "BOOKED CLASS",
            html: `<div style="padding:24px; font-family: Arial, sans-serif;">
            <h1 style="color:#0A1F44; font-size:24px;  border-bottom:2px solid black; margin-bottom:2px;">Your free trial class booked ${name}!</h1> 
               
            <p style="font-size:16px;">Hi ${name}</p>
            <p style="font-size:16px; color:#333;">You booked a free trial class for <span style="font-size:16px; font-weight:bold;">${subject}</span> trial class.</p>
            <p style="font-size:16px; color:#333; font-weight:bold; border-radius:4px; background-color:#DBEAFE; padding:4px;">We’ll be in touch with your class time soon.</p>
              
            <p style=" font-size:13px;">see you soon,</p>
            <p style="color:#2563EB; font-size:14px;">Mr Blue Class</p>
              </div>`
        })
        console.log('Message delivered! ID:', info.messageId);

    } catch (e) {
        console.log(e)
        throw (e)
    }


}
app.post('/send-emails', async (req: Request, res: Response) => {
    try {
        const { name, email, subject } = req.body;
        await sendEmail(email, name, subject)
        res.json({ success: true });


    } catch (error: any) {
        console.error("Booking failed please try again");
        res.status(500).json({
            message: "Booking failed please try again"
        });
    }

});
app.get('/health', (req: Request, res: Response) => {
   res.send('Welcome to my first Express server!');
});

// Start the server and begin listening for requests
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});