### Reset password
    - forget password kliklenir
        - POST/forgot-password
        - email required
        - Bu email-ə uyğun user varmı yoxlanilir
        - Reset token (və ya OTP code) yaradılır
        - Token hash edilir DB-də saxlanılır
        - Expires time teyin edilir, vaxtı limitli olur (məs: 5–15 dəq), DB-də saxlanılır
        - Email-ə link və ya kod göndərilir
        - User email-dən gələn linkden kodu goturur "https://frontend/reset-password?token=abc123"
        - User yeni şifrəni göndərir
            {
                "token": "abc123",
                "newPassword": "newStrongPass123"
            }
        - Token DB-də varmı? Expire olmayıb? yoxlanilir
        - Yeni şifrə hash edilir
        - User-in password_hash update olunur
        - Token DB-den silinir

### Update Todo status
        Endpoint - patch('/todo/:id', authMiddleware, updateStatusTodo)
        userId = req.user?.id
        todoId = req.params.id
        completeTodoService(todoId, userId)
        DB-de is_completed - eger true-dursa false olur, false-dursa true olur


