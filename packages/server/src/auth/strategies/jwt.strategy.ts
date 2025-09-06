import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RoleDocument } from 'src/roles/role.schema';
import { RolesService } from 'src/roles/roles.service';
import { UsersService } from 'src/users/users.service';
import { AuthJwtPayload, AuthUser } from '../auth.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
    private roleService: RolesService,
  ) {
    // Passport automatically verifies the token (e.g., signature and expiration) using the secretOrKey and other configurations provided in the super call of the strategy.
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwtAccessSecret')!,
      ignoreExpiration: false,
    });
  }

  // payload is the decoded JWT token from the client request
  async validate(payload: AuthJwtPayload): Promise<AuthUser> {
    const userDoc = await this.usersService.findOne(payload.sub);
    if (!userDoc) {
      throw new UnauthorizedException();
    }
    const roleDoc = (await this.roleService.findOne(
      userDoc.role._id.toString(),
    )) as unknown as RoleDocument & {
      permissions: AuthUser['permissions'];
    };
    if (!roleDoc) throw new UnauthorizedException('Invalid role');
    // UserDocument is the Mongoose wrapper type that includes Mongoose document methods and internal fields
    // So we need to turn it to object instance
    return { ...userDoc.toObject(), permissions: roleDoc.permissions };
  }
}
