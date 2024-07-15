import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userServise = inject(UserService);
  const token = userServise.token;

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  console.log("req", req);

  return next(req);
};
