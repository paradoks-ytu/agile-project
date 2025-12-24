package com.paradoks.agileproject.middleware;

import com.paradoks.agileproject.service.ClubSessionService;
import com.paradoks.agileproject.service.UserSessionService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class AuthMiddleware extends OncePerRequestFilter {

    private final ClubSessionService clubSessionService;
    private final UserSessionService userSessionService;

    public AuthMiddleware(ClubSessionService clubSessionService, UserSessionService userSessionService) {
        this.clubSessionService = clubSessionService;
        this.userSessionService = userSessionService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Check user session first, then club session. 
        // Note: If both exist, the last one checked wins if it sets authentication.
        // Usually, a request is either for a user or a club, or we might need a more complex context.
        // For now, let's allow both but we need to be careful.
        
        boolean authenticated = false;

        // Check User Session
        if (checkToken(request, "USER_SESSION", false)) {
            authenticated = true;
        }

        // Check Club Session (if not already authenticated? or overwrite? Let's overwrite for now if club session exists, or keep simple)
        // Since the prompt asks for separate services, let's valid both.
        
        if (!authenticated) {
             checkToken(request, "CLUB_SESSION", true);
        }

        filterChain.doFilter(request, response);
    }

    private boolean checkToken(HttpServletRequest request, String name, boolean isClub) {
        Cookie sessionCookie = WebUtils.getCookie(request, name);

        if (sessionCookie != null) {
            String token = sessionCookie.getValue();
            boolean isValid;
            
            if (isClub) {
                isValid = clubSessionService.isSessionValid(token);
            } else {
                isValid = userSessionService.isSessionValid(token);
            }

            if (isValid) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(token, null, new ArrayList<>());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                return true;
            }
        }
        return false;
    }

}