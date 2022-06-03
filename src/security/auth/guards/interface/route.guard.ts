import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export default interface RouteGuard {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean>;

  handleRequest(err, user, info): any;
}
