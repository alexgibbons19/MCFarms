import 'dotenv/config';
import nodemailer from "nodemailer";
import cron from "node-cron";

// Adjusted Email sending function to accept tasks and an email address
const sendEmail = async (email, tasks, test = false) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // Your SMTP user
      pass: process.env.EMAIL_PASS, // Your SMTP password
    },
  });

  // Generate tasks content for email
  let tasksHtml = tasks.length ? tasks.map(task => `<li>${task}</li>`).join('') : "<li>No specific tasks for today.</li>";
  let tasksText = tasks.length ? tasks.join(', ') : "No specific tasks for today.";

  let emailSubject = test ? "Test Email" : "Your Daily Tasks";
  let emailTextBody = test ? "This is a test email. " : "Here are your tasks for today: ";
  emailTextBody += tasksText;
  let emailHtmlBody = test ? "<b>This is a test email.</b> " : "<b>Here are your tasks for today:</b><ul>";
  emailHtmlBody += `${tasksHtml}</ul>`;

  let info = await transporter.sendMail({
    from: '"MCGardens" <mcgardens.reminders@gmail.com>',
    to: email, // Use the dynamically provided email address
    subject: emailSubject,
    text: emailTextBody,
    html: emailHtmlBody,
  });

  console.log("Message sent: %s", info.messageId);
};

// Function that fetches user-specific tasks and email addresses
// This is a placeholder function; replace it with your actual data fetching logic
const fetchUserTasksAndEmails = async () => {
  // Example users with tasks
  return [
    { email: "user1@example.com", tasks: ["Task 1 for User 1", "Task 2 for User 1"] },
    { email: "user2@example.com", tasks: ["Task 1 for User 2", "Task 2 for User 2"] },
    // Add more users and tasks as needed
  ];
};

// Schedule the task to send an email every day at 8 AM
cron.schedule("0 8 * * *", async () => {
  console.log("Fetching user tasks and scheduling emails...");
  const usersWithTasks = await fetchUserTasksAndEmails();

  usersWithTasks.forEach(user => {
    sendEmail(user.email, user.tasks);
  });
});

// Function to send personalized tasks email, accepts email and tasks as parameters
const sendPersonalizedTasksEmail = (email, tasks) => {
  console.log(`Preparing to send personalized tasks email to ${email}...`);
  sendEmail(email, tasks);
};

// Function to send a test email, now accepts an email address and tasks
const sendTestEmail = (email, tasks) => {
  console.log(`Sending test email to ${email}...`);
  sendEmail(email, tasks, true);
};

// Example usage:
// For sending a test email with tasks:
sendTestEmail("example@gmail.com", ["Test task 1", "Test task 2"]);

// For sending personalized daily tasks (could be triggered by specific events in your application):
// sendPersonalizedTasksEmail("example@gmail.com", ["Complete project report", "Call back the clients", "Review meeting notes"]);
