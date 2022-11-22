import { Injectable } from '@nestjs/common';
import { PasswordService, HashedPassword } from 'src/common/auth/password.service';
import { User, UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ArtistService } from 'src/artist/artist.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtTokenService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly userService: UserService,
    private readonly artistService: ArtistService,
  ) {}

  private async validatePassword(inputPassword: string, hashedPassword: HashedPassword): Promise<boolean> {
    return await this.passwordService.validatePassword(inputPassword, hashedPassword);
  }

  // TODO damn this return type is ugly
  async validateUser(email: string, password: string ): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      const isValidPassword = await this.validatePassword(password, user.password as HashedPassword);
      if (isValidPassword) {
        return user;
      }
    }
    return null;
  }

  async generateUserCredentials(user: User): Promise<string> {
    const artist = await this.artistService.findArtistByUserId(user.id);
    const payload = {
      sub: user.id,
      artistId: artist ? artist.id : null,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return this.jwtTokenService.sign(payload);
  }
}