package com.paradoks.agileproject.middleware;

import com.paradoks.agileproject.service.SessionService;
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

    private final SessionService sessionService;

    public AuthMiddleware(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        checkToken(request,"USER_SESSION");
        checkToken(request,"CLUB_SESSION");

        filterChain.doFilter(request, response);
    }

    private void checkToken(HttpServletRequest request, String name) {
        Cookie sessionCookie = WebUtils.getCookie(request, name);

        if (sessionCookie != null) {
            String token = sessionCookie.getValue();
            if (sessionService.isSessionValid(token)) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(token, null, new ArrayList<>());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

    }

}
