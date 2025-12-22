import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.PASSWORD_APP_MAIL
    }
})

export const sendMailToUser = async (email: string, name: string) => {
    await transporter.sendMail({
        from: `"TodoApp" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Welcome to our Application",
        html: `
            <h1>Xos gelmisiz, ${name}</h1>
            <p>Qeydiyyatiniz ugurla tamamlandi</p>
            <p>Artiq TodoApp-dan istifade ede bilersiniz</p>`
    })
}