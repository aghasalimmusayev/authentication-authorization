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

export const sendCodeToMail = async (email: string, code: string) => {
    await transporter.sendMail({
        from: `"TodoApp" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Welcome to our Application",
        html: `
            <h2>Email dogrulamasi</h2>
            <h3>Sizin dogrulama codunuz</h3>
            <h1>${code}</h1>
            <p>Istifade muddeti: 5 deqiqe</p>`
    })
}

export const sendVerificatedMailToUser = async (email: string, name: string) => {
    await transporter.sendMail({
        from: `"TodoApp" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "From TodoApp",
        html: `
            <h1>Hormetli ${name}</h1>
            <p>Email dogrulamasi ugurla tamamlandi</p>
            <p>TodoApp-dan sitifade etdiyiniz ucun tesekkurler!!!</p>`
    })
}

export const resetPasswordLink = async (email: string, code: string) => {
    await transporter.sendMail({
        from: `"TodoApp" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "From TodoApp",
        html: `
            <h3>Aşağıdakı linkə daxil olaraq parolunuzu sıfırlaya bilərsiz</h3>
            <a href="http://localhost:3014/api/auth/reset-password=${code}">reset your password</a>`
    })
}
