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

        if (info) return true;
    } catch (error) {
        throw new Error(error);
    }
}

const orderAdminEmail = async (fullName, phone, email, service, addonsAndExtras = [], document, dateTime = 'No Date', notes = 'Not Specified', price) => {
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
                    <p><b>Add-ons & Extras:</b> ${addonsAndExtras.length > 0 ? addonsAndExtras
                    .map(addonAndExtra => addonAndExtra.split(',')[0])
                    .join(', ') : 'Not Included'
                }</p>
                    <p><b>Amount:</b> $${price}</p>
                    <p><b>Document(s):</b> ${document.length > 0 ? document.map((doc) => {
                    return doc + '<br /><br />'
                }) : 'Not Attached'}</p>
                     <p><b>Notes:</b> ${notes ? notes : 'Not Specified'}</p>
                    <p><b>Preferred Time:</b> ${dateTime ? new Date(dateTime).toDateString() + " " + `(${new Date(dateTime).toLocaleTimeString()})` : 'Not Specified'}</p>
                    `,
        });

        if (info) return true;
    } catch (error) {
        throw new Error(error);
    }
}

const orderUserEmail = async (email, service, addonsAndExtras = [], document, dateTime, notes = 'Not Specified', price, sessionId) => {
    try {
        const info = await transporter.sendMail({
            from: `"JD Mentors" <${process.env.EMAIL_USER}>`,
            to: `${email}`,
            subject: `Booking Done`,
            html: `
                    <p>Your session on JD Mentors has been booked. We will reach out to you soon. Here is the booking summary:</p>
                    <p><b>Service:</b> ${service}</p>
                    <p><b>Add-ons & Extras:</b> ${addonsAndExtras.length > 0 ? addonsAndExtras
                    .map(addonAndExtra => addonAndExtra.split(',')[0])
                    .join(', ') : 'Not Included'
                }</p>
                    <p><b>Amount:</b> $${price}</p>
                    <p><b>Document(s):</b> ${document.length > 0 ? document.map((doc) => {
                    return doc + '<br /><br />'
                }) : 'Not Attached'}</p>
                    <p><b>Notes:</b> ${notes ? notes : 'Not Specified'}</p>
                    <p><b>Preferred Time:</b> ${dateTime ? new Date(dateTime).toDateString() + " " + `(${new Date(dateTime).toLocaleTimeString()})` : 'Not Specified'}</p>
                    <p><b>Session ID:</b> ${sessionId}</p>
                    <p>To check the status of your session, please visit <a href='${process.env.FRONTEND_URL}/session-status'>${process.env.FRONTEND_URL}/session-status</a> and search the above session ID.</p><br />
                    <p>If you registered, then you can simply login to your account and visist the user dashboard page or can also use the above method.</p>
                    `,
        });

        if (info) return true;
    } catch (error) {
        throw new Error(error);
    }
}

const accommodationAdminEmail = async (fullName, email, phone, preferredContact = 'Not Specified', exam = 'Not Specified', document = 'Not Provided', dateTime = 'Not Specified', seekingAccommodations = 'Not Specified', supportingDocumentation = 'Not Specified', previousAccommodation = 'Not Specified', providedAccommodations = 'Not Specified', additionalInfomation = 'Not Specified', price, accommodationId, payment = 'Pending') => {
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
                    <p><b>Service:</b> ${'Accommodations'}</p>
                    <p><b>Preferred Contact Method:</b> ${(typeof preferredContact == 'object' && preferredContact.length > 0)
                    ?
                    preferredContact
                        .map(preferred => preferred.split(',')[0])
                        .join(', ')
                    :
                    'Not Specified'
                }</p>
                    <p><b>Exam/Program:</b> ${(typeof exam == 'object' && exam.length > 0)
                    ?
                    exam
                        .map(ex => ex.split(',')[0])
                        .join(', ')
                    :
                    'Not Specified'
                }</p>
                    <p><b>Exam/Test Date:</b> ${dateTime ? new Date(dateTime).toDateString() : 'Not Specified'}</p>
                    <p><b>Supporting Documentation:</b> ${supportingDocumentation ? supportingDocumentation : 'Not Specified'}</p>
                    <p><b>Previous Accommodation:</b> ${previousAccommodation ? previousAccommodation : 'Not Specified'}</p>
                    <p><b>Previously Received Accommodation:</b> ${providedAccommodations ? providedAccommodations : 'Not Specified'}</p>
                    <p><b>Seeking Accommodation For:</b> ${seekingAccommodations ? seekingAccommodations : 'Not Specified'}</p>
                    <p><b>Additional Information:</b> ${additionalInfomation ? additionalInfomation : 'Not Specified'}</p>
                    <p><b>Payment:</b> ${payment ? 'Done' : 'Pending'}</p>
                    <p><b>Amount:</b> $${price}</p>
                    <p><b>Document(s):</b> ${typeof document === 'object'
                    ?
                    document.map((doc) => {
                        return doc + '<br /><br />'
                    })
                    :
                    'Not Provided'
                }</p>
                    `,
        });

        if (info) return true;
    } catch (error) {
        throw new Error(error);
    }
}

const accommodationUserEmail = async (fullName, email, phone, preferredContact = 'Not Specified', exam = 'Not Specified', document = 'Not Provided', dateTime = 'Not Specified', seekingAccommodations = 'Not Specified', supportingDocumentation = 'Not Specified', previousAccommodation = 'Not Specified', providedAccommodations = 'Not Specified', additionalInfomation = 'Not Specified', price, accommodationId, payment = 'Pending') => {
    try {
        const info = await transporter.sendMail({
            from: `"JD Mentors" <${process.env.EMAIL_USER}>`,
            to: `${email}`,
            subject: `Booking Done`,
            html: `
                    <p>Your session on JD Mentors has been booked. We will reach out to you soon. Here is the booking summary:</p>
                    <p><b>Full Name:</b> ${fullName}</p>
                    <p><b>Phone No.:</b> ${phone}</p>
                    <p><b>Email:</b> ${email}</p>
                    <p><b>Service:</b> ${'Accommodations'}</p>
                    <p><b>Preferred Contact Method:</b> ${(typeof preferredContact == 'object' && preferredContact.length > 0)
                    ?
                    preferredContact
                        .map(preferred => preferred.split(',')[0])
                        .join(', ')
                    :
                    'Not Specified'
                }</p>
                    <p><b>Exam/Program:</b> ${(typeof exam == 'object' && exam.length > 0)
                    ?
                    exam
                        .map(ex => ex.split(',')[0])
                        .join(', ')
                    :
                    'Not Specified'
                }</p>
                    <p><b>Exam/Test Date:</b> ${dateTime ? new Date(dateTime).toDateString() : 'Not Specified'}</p>
                    <p><b>Supporting Documentation:</b> ${supportingDocumentation ? supportingDocumentation : 'Not Specified'}</p>
                    <p><b>Previous Accommodation:</b> ${previousAccommodation ? previousAccommodation : 'Not Specified'}</p>
                    <p><b>Previously Received Accommodation:</b> ${providedAccommodations ? providedAccommodations : 'Not Specified'}</p>
                    <p><b>Seeking Accommodation For:</b> ${seekingAccommodations ? seekingAccommodations : 'Not Specified'}</p>
                    <p><b>Additional Information:</b> ${additionalInfomation ? additionalInfomation : 'Not Specified'}</p>
                    <p><b>Payment:</b> ${payment ? 'Done' : 'Pending'}</p>
                    <p><b>Amount:</b> $${price}</p>
                    <p><b>Document(s):</b> ${typeof document === 'object'
                    ?
                    document.map((doc) => {
                        return doc + '<br /><br />'
                    })
                    :
                    document
                }</p>
                    <p><b>Accommodation Session ID:</b> ${accommodationId}</p>
                    <p>To check the status of your session, please visit <a href='${process.env.FRONTEND_URL}/session-status'>${process.env.FRONTEND_URL}/session-status</a> and search the above session ID.</p><br />
                    <p>If you registered, then you can simply login to your account and visist the user dashboard page or can also use the above method.</p>
                    `,
        });

        if (info) return true;
    } catch (error) {
        throw new Error(error);
    }
}

const resetPasswordEmail = async (email, url) => {
    try {
        const info = await transporter.sendMail({
            from: `"JD Mentors" <${process.env.EMAIL_USER}>`,
            to: `${email}`,
            subject: `Reset Password Request`,
            html: `
                    <p>Forgot your password? Click on the following link to reset your password:</p>
                    <br />
                    <a href='${url}'>${url}</a>
                    <br />
                    `,
        });

        if (info) return true;
    } catch (error) {
        throw new Error(error);
    }
}

export { orderAdminEmail, orderUserEmail, contactEmail, resetPasswordEmail, accommodationAdminEmail, accommodationUserEmail }