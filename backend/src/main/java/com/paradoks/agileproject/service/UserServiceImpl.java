package com.paradoks.agileproject.service;

import com.paradoks.agileproject.dto.request.UserLoginRequest;
import com.paradoks.agileproject.dto.request.UserRegisterRequest;
import com.paradoks.agileproject.dto.response.ApiResponse;
import com.paradoks.agileproject.exception.BadRequestException;
import com.paradoks.agileproject.exception.NotFoundException;
import com.paradoks.agileproject.exception.UnauthorizedException;
import com.paradoks.agileproject.model.User;
import com.paradoks.agileproject.model.UserSession;
import com.paradoks.agileproject.model.VerificationCode;
import com.paradoks.agileproject.repository.UserRepository;
import com.paradoks.agileproject.repository.VerificationCodeRepository;
import com.paradoks.agileproject.utils.PasswordUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final VerificationCodeRepository verificationCodeRepository;
    private final UserSessionService userSessionService;
    private final PasswordUtils passwordUtils;

    public UserServiceImpl(UserRepository userRepository, VerificationCodeRepository verificationCodeRepository, UserSessionService userSessionService, PasswordUtils passwordUtils) {
        this.userRepository = userRepository;
        this.verificationCodeRepository = verificationCodeRepository;
        this.userSessionService = userSessionService;
        this.passwordUtils = passwordUtils;
    }

    @Override
    public ApiResponse register(UserRegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email already in use");
        }

        // Check for existing verification code
        Optional<VerificationCode> existingCodeOpt = verificationCodeRepository.findByEmail(registerRequest.getEmail());
        if (existingCodeOpt.isPresent()) {
            VerificationCode existingCode = existingCodeOpt.get();
            if (existingCode.getExpirationTime().isAfter(LocalDateTime.now())) {
                throw new BadRequestException("A valid verification code has already been sent to this email. Please check your inbox.");
            } else {
                // Delete expired code
                verificationCodeRepository.delete(existingCode);
            }
        }

        // Generate verification code
        String code = String.format("%06d", new Random().nextInt(999999));

        // Create VerificationCode entity
        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setEmail(registerRequest.getEmail());
        verificationCode.setCode(code);
        verificationCode.setExpirationTime(LocalDateTime.now().plusMinutes(15));
        verificationCode.setFirstName(registerRequest.getFirstName());
        verificationCode.setLastName(registerRequest.getSecondName());
        verificationCode.setPassword(passwordUtils.hashPassword(registerRequest.getPassword()));

        verificationCodeRepository.save(verificationCode);

        // Log the code as per requirements
        log.info("Verification code for {}: {}", registerRequest.getEmail(), code);

        return new ApiResponse(true, "Verification code sent to email");
    }

    @Override
    public ApiResponse verifyUser(String email, String code) {
        // Double check if user exists to prevent race conditions
        if (userRepository.existsByEmail(email)) {
            // Clean up any lingering verification code
            verificationCodeRepository.deleteByEmail(email);
            throw new BadRequestException("User already registered");
        }

        VerificationCode verificationCode = verificationCodeRepository.findByEmailAndCode(email, code)
                .orElseThrow(() -> new BadRequestException("Invalid email or verification code"));

        if (verificationCode.getExpirationTime().isBefore(LocalDateTime.now())) {
            verificationCodeRepository.delete(verificationCode);
            throw new BadRequestException("Verification code expired");
        }

        User user = new User();
        user.setEmail(verificationCode.getEmail());
        user.setFirstName(verificationCode.getFirstName());
        user.setLastName(verificationCode.getLastName());
        user.setPassword(verificationCode.getPassword());
        
        userRepository.save(user);
        verificationCodeRepository.delete(verificationCode);

        return new ApiResponse(true, "User registered successfully");
    }

    @Override
    public String login(UserLoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordUtils.checkPassword(loginRequest.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        UserSession session = userSessionService.createSession(user, 24);

        return session.getToken();
    }

    @Override
    public User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    @Override
    public ApiResponse deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new NotFoundException("User not found");
        }
        userRepository.deleteById(userId);
        return new ApiResponse(true, "User deleted successfully");
    }
}