const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({ region: "us-east-1" }); 

const sendEmail = async (toAddress, subject, body) => {
  const command = new SendEmailCommand({
    Destination: { ToAddresses: [toAddress] },
    Message: {
      Body: { Html: { Data: body } },
      Subject: { Data: subject },
    },
    Source: "welcome@finddevs.xyz", 
  });

  try {
    const response = await sesClient.send(command);
    console.log("Email sent successfully:", response.MessageId);
  } catch (error) {
    console.error("SES Error:", error);
  }
};

module.exports = { sendEmail };