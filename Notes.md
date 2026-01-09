* User1 {id: 4, password_hash: "11485abs"}
### verification email
    1.  email adresi yazib post edilir: {email}=req.body
        otp code yaradilir - utils/otp.ts
        expires teyin edilir
        db-de update gedir: email_verification_code -a otp code yazilir(default null-dir) - services/verification.servicee.ts
        db-de update gedir: email_expires_code -a vaxt yazilir(default null-dir) - services/verification.servicee.ts
        hemin email-e expires vaxt-da varification code gonderilir - services/verification.servicee.ts

    2.  hemin codu-u email-den goturub post edirik: {email, code} = req.body
        user-in login oldugunu yoxlanilir
        verified olub olmadigi yoxlanilir
        codu-un dogrulugu yoxlanilir
        vaxti bitib bitmediyi yoxlanilir
        db-de update gedir: is_verified - true olur
        db-de update gedir: email_verification_code -a null yazilir
        db-de update gedir: email_expires_code -a null yazilir
        email-e tesdiq mesaji gonderilir
