package com.paradoks.agileproject.utils;

import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Component;

@Component
public class PasswordUtils {

    public String hashPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    public Boolean checkPassword(String passwd, String hash) {
        return BCrypt.checkpw(passwd, hash);
    }
}
