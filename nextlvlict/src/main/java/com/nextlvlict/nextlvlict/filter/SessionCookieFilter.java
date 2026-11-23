package com.nextlvlict.nextlvlict.filter;

import com.nextlvlict.nextlvlict.util.ConfigUtil;
import jakarta.servlet.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Filter to set SameSite attribute on session cookies for CSRF protection.
 * SameSite attribute cannot be set directly in web.xml for older servlet versions.
 * Registered in web.xml.
 */
public class SessionCookieFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Initialization if needed
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        // JSESSIONID cookie handling removed - using X-Auth-Token and X-Session-Id instead
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // Cleanup if needed
    }
}
