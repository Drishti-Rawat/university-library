import {Client as WorkflowClient} from '@upstash/workflow';
import config from './config';
import { Client as QStashClient, resend } from "@upstash/qstash";

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
                "Content-Type": "application/json"
            },
            body: {
                service_id: config.env.emailjs.serviceId,
                template_id: config.env.emailjs.templateId,
                user_id: config.env.emailjs.publicKey,
                accessToken: config.env.emailjs.privateKey,
                template_params: {
                    subject: subject,     // Goes to {{subject}} in template
                    message: message,     // Goes to {{message}} in template  
                    to_email: email,      // Recipient email
                    to_name: recipientName, // Optional: if you want to use {{to_name}}
                    from_name: "BOOKSHELF" // Optional: if you want to use {{from_name}}
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

