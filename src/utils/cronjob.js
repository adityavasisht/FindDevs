const cron = require('node-cron');
const { sendEmail } = require('./email');
const connectionReq = require('../models/connectionreq');
const datefns = require("date-fns");
const nodemailer = require("nodemailer");
const {SESClient, SendRawEmailCommand} = require("@aws-sdk/client-ses");
const userModel = require('../models/user');

const transporter = nodemailer.createTransport({
    SES : {ses, aws :{SendRawEmailCommand}},
});

const ses = new SESClient({
    region: 'us-east-1',
    credentials:{
        accessKeyId: process.env.AWS_ACESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});



cron.schedule("0 9 * * *",  async()=>{
    try {

        const yesterday = new Date(Date.now() - 1000*60*60*24);
        const emailLists = connectionReq.aggregate([
            {
                $match:{
                    status: "interestes",
                    ceatedAt: {$gte: yesterday}
                }
            
            },
            {
                $group:{
                    _id: "$toUserId",
                    requestCount: {$sum :1}
                }
            },
        ]);
        for(const item of emailLists){
            const user = userModel.findById(item._id);
            if(user){
                await sendDigestEmail(user, item.count);
            }

        }

    
        
        
    } catch (error) {
        console.log("cron error" + error);
        
    }
    
});

async function sendDigestEmail(userId, reqCount) {
    const mailOptions = {
        from: '"FindDevs" <no-reply@finddevs.xyz>',
        to: user.emailId,
        subject: `You have ${reqCount} new connection requests `,
        html:`
        <a href="https://finddevs.xyz/unsubscribe">Unsubscribe</a>
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2>Hello, ${user.firstName}!</h2>
        <p>Your profile is getting noticed on DevTinder.</p>
        <div style="background-color: #f0f0f0; padding: 15px; margin: 20px 0; border-radius: 8px;">
           <p style="font-size: 18px; margin: 0;">You received <strong>${count} new requests</strong> in the last 24 hours.</p>
        </div>
        <a href="https://finddevs.xyz/requests" style="background-color: #FF5733; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Review Requests</a>
        <p style="margin-top: 30px; color: #888; font-size: 12px;">Keep coding,<br>The DevTinder Team</p>
      </div>
        `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("email sent about connection requests!");
        
    } catch (error) {
        console.log("connection req email error" + error);
        
    }
    
}