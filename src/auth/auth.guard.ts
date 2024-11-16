import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor (private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()    
        try {
            const authHeader = req.headers.authorization
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]
            
            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: "Error validating token", error_id: 'user_token_error'})
            }

            const user = this.jwtService.verify(token)
            req.jwt_payload = user
            return true
        } catch (error) {
            console.log(error)
            throw new UnauthorizedException({message: "Forbidden", error_id: 'unauthorized'})
        }
    }
}