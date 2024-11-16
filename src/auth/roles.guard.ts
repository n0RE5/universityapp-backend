import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor (private jwtService: JwtService, private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass()
            ])
            if(!roles) {
                return true
            }
            const req = context.switchToHttp().getRequest()    
            const authHeader = req.headers.authorization            
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: "Error validating token", error_id: 'user_token_error'})
            }

            const user = this.jwtService.verify(token)
            req.user = user
            return user.roles.some(role => roles.includes(role.name))
        } catch (error) {
            console.log(error)
            throw new UnauthorizedException({message: "Forbidden", error_id: 'unauthorized'})
        }
    }
}