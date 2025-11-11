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

const accommodationAdminEmail = async (fullName, email, phone, preferredContact = 'Not Specified', otherContactMethod = '', exam = 'Not Specified', document = 'Not Provided', dateTime = 'Not Specified', seekingAccommodations = 'Not Specified', supportingDocumentation = 'Not Specified', previousAccommodation = 'Not Specified', providedAccommodations = 'Not Specified', additionalInfomation = 'Not Specified', price, accommodationId, payment = 'Pending') => {
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
                     ${otherContactMethod && `<p><b>Other Contact Method: </b>${otherContactMethod}</p>`}
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
                    <p><b>Document(s):</b> ${Array.isArray(document) && document.length > 0
                    ?
                    document.map((doc) => {
                        return doc + '<br /><br />'
                    })
                    :
                    'Not Attached'
                }</p>
                    `,
        });

        if (info) return true;
    } catch (error) {
        throw new Error(error);
    }
}

const accommodationUserEmail = async (fullName, email, phone, preferredContact = 'Not Specified', otherContactMethod = '', exam = 'Not Specified', document = 'Not Provided', dateTime = 'Not Specified', seekingAccommodations = 'Not Specified', supportingDocumentation = 'Not Specified', previousAccommodation = 'Not Specified', providedAccommodations = 'Not Specified', additionalInfomation = 'Not Specified', price, accommodationId, payment = 'Pending') => {
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
                ${otherContactMethod && `<p><b>Other Contact Method: </b>${otherContactMethod}</p>`}
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
                    <p><b>Document(s):</b> ${Array.isArray(document) && document.length > 0
                    ?
                    document.map((doc) => {
                        return doc + '<br /><br />'
                    })
                    :
                    'Not Attached'
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

const lsatSessionAdminEmail = async (fullName, email, phone, sessionType, tutorName, tutorSchool, currentScore, targetScore, weakAreas, studyMaterials, previousTutoring, specificGoals, dateTime, notes, numberOfStudents, price, pricePerPerson, document, sessionId, payment = 'Pending') => {
    try {
        const info = await transporter.sendMail({
            from: `"JD Mentors" <${process.env.EMAIL_USER}>`,
            to: `${process.env.EMAIL_USER}`,
            subject: `New LSAT ${sessionType === 'free' ? 'Consultation' : sessionType === 'one-on-one' ? '1-on-1' : 'Group'} Session Booking`,
            html: `
                    <p>You have received a new LSAT tutoring session booking. Please check it out. Here is the summary:</p>
                    
                    <h3 style="color: #1e40af; margin-bottom: 10px;">Student Information</h3>
                    <p><b>Full Name:</b> ${fullName}</p>
                    <p><b>Email:</b> ${email}</p>
                    <p><b>Phone:</b> ${phone}</p>
                    
                    <h3 style="color: #1e40af; margin-bottom: 10px; margin-top: 20px;">Session Details</h3>
                    <p><b>Session Type:</b> ${sessionType === 'free' ? 'Free Consultation' : sessionType === 'one-on-one' ? '1-on-1 Tutoring' : 'Group Class'}</p>
                    <p><b>Assigned Tutor:</b> ${tutorName}${tutorSchool ? ` (${tutorSchool})` : ''}</p>
                    <p><b>Scheduled Date & Time:</b> ${dateTime ? new Date(dateTime).toLocaleString() : 'Not Specified'}</p>
                    <p><b>Duration:</b> ${sessionType === 'free' ? '30 minutes' : '60 minutes'}</p>
                    ${sessionType === 'class' ? `<p><b>Number of Students:</b> ${numberOfStudents}</p>` : ''}
                    
                    <h3 style="color: #1e40af; margin-bottom: 10px; margin-top: 20px;">LSAT Background & Goals</h3>
                    <p><b>Current Score:</b> ${currentScore || 'Not specified'}</p>
                    <p><b>Target Score:</b> ${targetScore}</p>
                    <p><b>Challenging Areas:</b> ${weakAreas}</p>
                    <p><b>Study Materials:</b> ${studyMaterials || 'Not specified'}</p>
                    <p><b>Previous Tutoring:</b> ${previousTutoring}</p>
                    <p><b>Session Goals:</b> ${specificGoals}</p>
                    ${notes ? `<p><b>Additional Notes:</b> ${notes}</p>` : ''}
                    
                    <h3 style="color: #1e40af; margin-bottom: 10px; margin-top: 20px;">Payment Information</h3>
                    <p><b>Payment Status:</b> ${payment ? 'Paid' : 'Pending'}</p>
                    <p><b>Amount:</b> $${price}</p>
                    ${sessionType === 'class' && pricePerPerson ? `<p><b>Price per Person:</b> $${pricePerPerson}</p>` : ''}
                    
                    <h3 style="color: #1e40af; margin-bottom: 10px; margin-top: 20px;">Documents</h3>
                    <p><b>Uploaded Documents:</b> ${Array.isArray(document) && document.length > 0
                    ?
                    document.map((doc) => {
                        return `<a href="${doc}" style="color: #2563eb; text-decoration: underline;">${doc.split('/').pop()}</a><br />`
                    }).join('')
                    :
                    'Not Attached'
                }</p>
                    
                    <p><b>Session ID:</b> ${sessionId}</p>
                    `,
        });

        if (info) return true;
    } catch (error) {
        throw new Error(error);
    }
}

const lsatSessionUserEmail = async (fullName, email, phone, sessionType, tutorName, tutorSchool, currentScore, targetScore, weakAreas, studyMaterials, previousTutoring, specificGoals, dateTime, notes, numberOfStudents, price, pricePerPerson, document, sessionId, payment = 'Pending') => {
    try {
        const sessionTypeDisplay = sessionType === 'free' ? 'Free Consultation' : sessionType === 'one-on-one' ? '1-on-1 Tutoring' : 'Group Class';
        const duration = sessionType === 'free' ? '30 minutes' : '60 minutes';

        const info = await transporter.sendMail({
            from: `"JD Mentors" <${process.env.EMAIL_USER}>`,
            to: `${email}`,
            subject: `LSAT ${sessionTypeDisplay} Session Confirmation`,
            html: `
                    <p>Your LSAT ${sessionTypeDisplay.toLowerCase()} session has been booked successfully! We will reach out to you soon. Here is your booking summary:</p>
                    
                    <h3 style="color: #1e40af; margin-bottom: 10px;">Your Session Details</h3>
                    <p><b>Session Type:</b> ${sessionTypeDisplay}</p>
                    <p><b>Your Tutor:</b> ${tutorName}${tutorSchool ? ` (${tutorSchool})` : ''}</p>
                    <p><b>Scheduled Date & Time:</b> ${dateTime ? new Date(dateTime).toLocaleString() : 'Not Specified'}</p>
                    <p><b>Duration:</b> ${duration}</p>
                    ${sessionType === 'class' ? `<p><b>Number of Students in Group:</b> ${numberOfStudents}</p>` : ''}
                    
                    <h3 style="color: #1e40af; margin-bottom: 10px; margin-top: 20px;">LSAT Goals</h3>
                    <p><b>Target Score:</b> ${targetScore}</p>
                    <p><b>Focus Areas:</b> ${weakAreas}</p>
                    <p><b>Session Goals:</b> ${specificGoals}</p>
                    ${notes ? `<p><b>Your Notes:</b> ${notes}</p>` : ''}
                    
                    <h3 style="color: #1e40af; margin-bottom: 10px; margin-top: 20px;">Payment Information</h3>
                    <p><b>Payment Status:</b> ${payment ? 'Paid' : 'Pending'}</p>
                    <p><b>Amount:</b> $${price}</p>
                    ${sessionType === 'class' && pricePerPerson ? `<p><b>Price per Person:</b> $${pricePerPerson}</p>` : ''}
                    ${sessionType === 'free' ? `<p><b>Note:</b> This is a free consultation session - no payment required.</p>` : ''}
                    ${sessionType === 'one-on-one' && price === 0 ? `<p><b>Note:</b> This session uses your package credits.</p>` : ''}
                    
                    <h3 style="color: #1e40af; margin-bottom: 10px; margin-top: 20px;">Next Steps</h3>
                    <p>• Your tutor ${tutorName} will contact you before the session</p>
                    <p>• Prepare any questions you have about your LSAT preparation</p>
                    <p>• Have your study materials ready for the session</p>
                    ${sessionType === 'class' ? `<p>• Be ready to interact with other students in your group</p>` : ''}
                    
                    <h3 style="color: #1e40af; margin-bottom: 10px; margin-top: 20px;">Session Information</h3>
                    <p><b>Session ID:</b> ${sessionId}</p>
                    <p>To check the status of your session, please visit <a href='${process.env.FRONTEND_URL}/user/dashboard' style="color: #2563eb; text-decoration: underline;">your dashboard</a>.</p>
                    
                    <p style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border-left: 4px solid #2563eb;">
                        <b>Important:</b> If you need to reschedule or have any questions, please contact us at ${process.env.EMAIL_USER}
                    </p>
                    `,
        });

        if (info) return true;
    } catch (error) {
        throw new Error(error);
    }
}

const lsatSessionTutorEmail = async (tutorEmail, tutorName, studentName, studentEmail, studentPhone, sessionType, currentScore, targetScore, weakAreas, studyMaterials, previousTutoring, specificGoals, dateTime, notes, numberOfStudents, document, sessionId) => {
    try {
        const sessionTypeDisplay = sessionType === 'free' ? 'Free Consultation' : sessionType === 'one-on-one' ? '1-on-1 Tutoring' : 'Group Class';
        const duration = sessionType === 'free' ? '30 minutes' : '60 minutes';

        const info = await transporter.sendMail({
            from: `"JD Mentors" <${process.env.EMAIL_USER}>`,
            to: `${tutorEmail}`,
            subject: `New LSAT ${sessionTypeDisplay} Session Assigned - ${studentName}`,
            html: `
                    <p>You have been assigned a new LSAT ${sessionTypeDisplay.toLowerCase()} session. Please review the student details and prepare for the session.</p>
                    
                    <h3 style="color: #1e40af; margin-bottom: 10px;">Session Details</h3>
                    <p><b>Session Type:</b> ${sessionTypeDisplay}</p>
                    <p><b>Student Name:</b> ${studentName}</p>
                    <p><b>Scheduled Date & Time:</b> ${dateTime ? new Date(dateTime).toLocaleString() : 'Not Specified'}</p>
                    <p><b>Duration:</b> ${duration}</p>
                    ${sessionType === 'class' ? `<p><b>Number of Students:</b> ${numberOfStudents}</p>` : ''}
                    
                    <h3 style="color: #1e40af; margin-bottom: 10px; margin-top: 20px;">Student Contact Information</h3>
                    <p><b>Email:</b> <a href="mailto:${studentEmail}" style="color: #2563eb; text-decoration: underline;">${studentEmail}</a></p>
                    <p><b>Phone:</b> ${studentPhone}</p>
                    
                    <h3 style="color: #1e40af; margin-bottom: 10px; margin-top: 20px;">Student's LSAT Background & Goals</h3>
                    <p><b>Current Score:</b> ${currentScore || 'Not specified'}</p>
                    <p><b>Target Score:</b> ${targetScore}</p>
                    <p><b>Challenging Areas:</b> ${weakAreas}</p>
                    <p><b>Study Materials:</b> ${studyMaterials || 'Not specified'}</p>
                    <p><b>Previous Tutoring Experience:</b> ${previousTutoring}</p>
                    <p><b>Session Goals:</b> ${specificGoals}</p>
                    ${notes ? `<p><b>Student Notes:</b> ${notes}</p>` : ''}
                    
                    <h3 style="color: #1e40af; margin-bottom: 10px; margin-top: 20px;">Preparation Materials</h3>
                    <p><b>Uploaded Documents:</b> ${Array.isArray(document) && document.length > 0
                    ?
                    document.map((doc) => {
                        return `<a href="${doc}" style="color: #2563eb; text-decoration: underline;">${doc.split('/').pop()}</a><br />`
                    }).join('')
                    :
                    'No documents uploaded'
                }</p>
                    
                    <h3 style="color: #1e40af; margin-bottom: 10px; margin-top: 20px;">Action Required</h3>
                    <p>• Please contact the student before the session to introduce yourself</p>
                    <p>• Review the student's goals and challenging areas</p>
                    <p>• Prepare customized materials based on their needs</p>
                    ${sessionType === 'class' ? `<p>• Prepare group activities and materials for ${numberOfStudents} students</p>` : ''}
                    <p>• Confirm the session timing with the student</p>
                    
                    <h3 style="color: #1e40af; margin-bottom: 10px; margin-top: 20px;">Session Information</h3>
                    <p><b>Session ID:</b> ${sessionId}</p>
                    <p>You can view and manage this session in your <a href='${process.env.FRONTEND_URL}/tutor/dashboard' style="color: #2563eb; text-decoration: underline;">tutor dashboard</a>.</p>
                    
                    <p style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border-left: 4px solid #2563eb;">
                        <b>Important:</b> Please mark the session as completed in your dashboard after conducting the session.
                    </p>
                    
                    <div style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border-radius: 8px;">
                        <h4 style="color: #1e40af; margin-bottom: 10px;">Session Preparation Tips:</h4>
                        <p>• Focus on the student's identified weak areas: ${weakAreas}</p>
                        <p>• Help them work towards their target score of ${targetScore}</p>
                        <p>• Address their specific goals: ${specificGoals}</p>
                        ${studyMaterials ? `<p>• Incorporate their existing study materials: ${studyMaterials}</p>` : ''}
                    </div>
                    `,
        });

        if (info) return true;
    } catch (error) {
        throw new Error(error);
    }
}

export { orderAdminEmail, orderUserEmail, contactEmail, resetPasswordEmail, accommodationAdminEmail, accommodationUserEmail, lsatSessionAdminEmail, lsatSessionUserEmail, lsatSessionTutorEmail, }