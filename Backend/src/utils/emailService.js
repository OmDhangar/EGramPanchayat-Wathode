import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Mailgen from 'mailgen';

dotenv.config();

// Configure nodemailer with your email service
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST, // e.g., 'smtp.gmail.com' for GMAIL provide,
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});           

// Configure Mailgen for email templates
const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Gram Panchayat Services',
    link: process.env.FRONTEND_URL || 'http://localhost:5173'
  }
});

/**
 * Send application notification email
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.applicationType - Type of application
 * @param {String} options.applicationId - Application ID
 * @param {String} options.applicantName - Name of applicant
 * @param {String} options.status - Application status
 */
const sendApplicationEmail = async (options) => {
  try {
    const { to, subject, applicationType, applicationId, applicantName, status } = options;
    
    // Generate email body
    const emailBody = {
      body: {
        name: options.recipientName || 'Admin',
        intro: options.intro || `A new ${applicationType} application has been submitted.`,
        action: {
          instructions: options.instructions || 'Application details:',
          button: {
            color: '#22BC66',
            text: options.buttonText || 'View Application',
            link: options.actionLink || `${process.env.FRONTEND_URL}/admin/applications/${applicationId}`
          }
        },
        table: {
          data: [
            {
              key: 'Application Type',
              value: applicationType
            },
            {
              key: 'Application ID',
              value: applicationId
            },
            {
              key: 'Applicant',
              value: applicantName
            },
            {
              key: 'Status',
              value: status
            },
            ...options.additionalData || []
          ]
        },
        outro: options.outro || 'Please review this application at your earliest convenience.'
      }
    };
    
    // Generate email HTML
    const emailHTML = mailGenerator.generate(emailBody);
    
    // Send email
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@grampanchayat.com',
      to,
      subject,
      html: emailHTML
    };
    
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

/**
 * Send notification to admin about new application
 */
const notifyAdminNewApplication = async (application, applicantName) => {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  if (!adminEmails.length){
    console.log(adminEmails);
    console.error('No admin email addresses found in environment variables.');
    return false;
  };
  
  return await sendApplicationEmail({
    to: adminEmails.join(','),
    subject: `New ${application.documentType.replace('_', ' ')} Application`,
    applicationType: application.documentType.replace('_', ' '),
    applicationId: application.applicationId,
    applicantName,
    status: application.status,
    intro: `A new ${application.documentType.replace('_', ' ')} application has been submitted and requires your review.`
  });
};

/**
 * Send application status update to user
 */
const notifyUserStatusUpdate = async (application, user) => {
  if (!user.email) return false;
  
  let subject, intro, outro;
  
  switch(application.status) {
    case 'approved':
      subject = 'Your Application Has Been Approved';
      intro = `Great news! Your ${application.documentType.replace('_', ' ')} application has been approved.`;
      outro = 'You can now proceed with the payment to receive your certificate.';
      break;
    case 'rejected':
      subject = 'Application Status Update';
      intro = `We regret to inform you that your ${application.documentType.replace('_', ' ')} application has been rejected.`;
      outro = 'Please check the admin remarks for more details on why your application was rejected.';
      break;
    case 'under_review':
      subject = 'Application Status Update';
      intro = `Your ${application.documentType.replace('_', ' ')} application is now under review.`;
      outro = 'We will notify you once the review process is complete.';
      break;
    case 'completed':
      subject = 'Certificate Ready for Download';
      intro = `Your ${application.documentType.replace('_', ' ')} certificate is now ready for download.`;
      outro = 'You can download your certificate from your dashboard.';
      break;
    default:
      subject = 'Application Status Update';
      intro = `Your ${application.documentType.replace('_', ' ')} application status has been updated to ${application.status}.`;
      outro = 'You can check the details on your dashboard.';
  }
  
  return await sendApplicationEmail({
    to: user.email,
    subject,
    recipientName: user.fullName,
    applicationType: application.documentType.replace('_', ' '),
    applicationId: application.applicationId,
    applicantName: user.fullName,
    status: application.status,
    intro,
    outro,
    actionLink: `${process.env.FRONTEND_URL}/dashboard/applications/${application.applicationId}`
  });
};

export { sendApplicationEmail, notifyAdminNewApplication, notifyUserStatusUpdate };