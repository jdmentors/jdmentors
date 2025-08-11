import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const contactEmail = async (name, email, phone, service, message) => {
    try {
        const info = await transporter.sendMail({
            from: `"JD Mentors" <${process.env.EMAIL_USER}>`,
            to: `${process.env.EMAIL_USER}`,
            subject: `New Contact Query`,
            html: `
                    <p>You have received a new query. Please reach out to them. Here are the details:</p>
                    <p><b>Full Name:</b> ${name}</p>
                    <p><b>Email:</b> ${email}</p>
                    <p><b>Phone No.:</b> ${phone}</p>
                    <p><b>service (Interested):</b> ${service}</p>
                    
                    <p>
                        <b>Message:</b> <br />
                         ${message}
                    </p>
                    `,
        });

        if(info) return true;
    } catch (error) {
        throw new Error(error);
    }
}

const orderAdminEmail = async (fullName, phone, email, service, document, dateTime, price) => {
    try {
        const info = await transporter.sendMail({
            from: `"JD Mentors" <${process.env.EMAIL_USER}>`,
            to: `${process.env.EMAIL_USER}`,
            subject: `New Booking`,
            html: `
                    <p>You have received a new booking/order. Please check it out. Here is the summary:</p>
                    <p><b>Full Name:</b> ${fullName}</p>
                    <p><b>Phone No.:</b> ${phone}</p>
                    <p><b>Email:</b> ${email}</p>
                    <p><b>Service:</b> ${service}</p>
                    <p><b>Amount:</b> $${price}</p>
                    <p><b>Document:</b> ${document}</p>
                    <p><b>Preferred Time:</b> ${new Date(dateTime).toLocaleString()}</p>
                    `,
        });

        if(info) return true;
    } catch (error) {
        throw new Error(error);
    }
}

const orderUserEmail = async (email, service, document, dateTime, price) => {
    try {
        const info = await transporter.sendMail({
            from: `"JD Mentors" <${process.env.EMAIL_USER}>`,
            to: `${email}`,
            subject: `Booking Done`,
            html: `
                    <p>Your session on JD Mentors has been booked. We will reach out to you soon. Here is the booking summary:</p>
                    <p><b>Service:</b> ${service}</p>
                    <p><b>Amount:</b> $${price}</p>
                    <p><b>Document:</b> ${document}</p>
                    <p><b>Preferred Time:</b> ${new Date(dateTime).toLocaleString()}</p>
                    `,
        });

        if(info) return true;
    } catch (error) {
        throw new Error(error);
    }
}

export { orderAdminEmail, orderUserEmail, contactEmail }