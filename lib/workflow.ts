import {Client as WorkflowClient} from '@upstash/workflow';
import config from './config';
import { Client as QStashClient } from "@upstash/qstash";

export const workflowClient = new WorkflowClient({
    baseUrl: config.env.upstash.qstashUrl,
    token: config.env.upstash.qstashToken ,
});


const qstashClient = new QStashClient({ token: config.env.upstash.qstashToken });

export const sendEmail = async ({
    email,
    subject,
    message,
    recipientName = "User"
}: {
    email: string;
    subject: string;
    message: string;
    recipientName?: string;
}) => {
    try {
        await qstashClient.publishJSON({
            url: "https://api.emailjs.com/api/v1.0/email/send",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Add browser-like headers to bypass the restriction
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "en-US,en;q=0.9",
                "Origin": "https://yourdomain.com", // Replace with your actual domain
                "Referer": "https://yourdomain.com/", // Replace with your actual domain
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site"
            },
            body: {
                service_id: config.env.emailjs.serviceId,
                template_id: config.env.emailjs.templateId,
                user_id: config.env.emailjs.publicKey,
                accessToken: config.env.emailjs.privateKey,
                template_params: {
                    subject: subject,
                    message: message,
                    to_email: email,
                    to_name: recipientName,
                    from_name: "BOOKSHELF"
                }
            }
        });
        
        console.log("Email queued successfully with EmailJS");
    } catch (error) {
        console.error("Failed to queue email:", error);
        throw error;
    }
};

// export const sendEmail = async ({email,subject,message}:{email:string,subject:string,message:string}) => {
//     await qstashClient.publishJSON({
//   api: {
//     name: "email",
//     provider: resend({ token: config.env.resendToken }),
//   },
//   body: {
//     from: "Acme <onboarding@resend.dev>",
//     to: [email],
//     subject,
//     html: message,
//   },
// });
// }

