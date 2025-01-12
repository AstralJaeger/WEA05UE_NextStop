import {
  HttpInterceptorFn,

} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthenticationService} from './services/authentication.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject AuthService to retrieve the token
  const authService = inject(AuthenticationService);
  const token = authService.getToken(); // Implement getToken in AuthService
  console.log("token: ", token);

  // Clone the request and add the Authorization header if the token exists
  const clonedRequest = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
    : req;

  // Pass the request to the next handler
  return next(clonedRequest);
};
