import { UserService } from './../modules/user/user.service';
import { Controller, Post, Body, UseFilters, BadRequestException, UseInterceptors, ClassSerializerInterceptor, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from 'src/utils/jwt';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { GenderEnum } from '@prisma/client';
import { TokenPayload } from 'src/utils/dto/util.dto';
import { v4 as uuidv4 } from 'uuid';


@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) { }
  // constructor(private readonly UserService: UserService ) {}
  @UseFilters(HttpExceptionFilter)
  @Post('/login')
  async logIn(@Body() { email, password }) {
    if (!email) throw new BadRequestException('Email is required')
    if (!password) throw new BadRequestException('Password is required')
    return await this.authService.logIn(email, password)
  }


  @UseFilters(HttpExceptionFilter)
  @Post('/refreshToken')
  // async refreshToken(@Body() { refreshToken }) {
  //   if (!refreshToken) {
  //     throw new BadRequestException('Missing refresh token.')
  //   }

  //   const payload = this.jwtService.verifyRefreshToken(refreshToken) as TokenPayload
  //   const saved_refeshTokenFromDb = await this.authService.findRefreshTokenById(payload.jti)

  //   if (!saved_refeshTokenFromDb) {
  //     console.log("Error: get refreshToken from database not valid or revoke == true");
  //     throw new UnauthorizedException(401, 'Unauthorized')
  //   }
  //   else if (!saved_refeshTokenFromDb) {
  //     console.log("Error: revoke == true");
  //     throw new UnauthorizedException(401, 'Unauthorized')
  //   }
  //   const hashedToken = this.jwtService.hashToken(refreshToken);
  //   if (hashedToken !== saved_refeshTokenFromDb.hashedToken) {
  //     console.log('Refresh Token inputed !== refreshToken from database');
  //     throw new UnauthorizedException(401, 'Unauthorized')
  //   }

  //   const user = await this.userService.findUserById(+payload.userId)
  //   if (!user) {
  //     console.log("Doesnt have user with this token");
  //     throw new UnauthorizedException(401, 'Unauthorized')
  //   }

  //   // this is just update reVoke to true
  //   await this.authService.deleteRefreshTokenById(saved_refeshTokenFromDb.id)
  //   const jti = uuidv4()
  //   const { accessToken, refreshToken: newRefreshToken } = await this.jwtService.generateToken(user, jti)
  //   await this.authService.addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, userId: user.id })
  //   return {
  //     accessToken: accessToken,
  //     refreshToken: newRefreshToken
  //   }
  // }
  async refreshToken(@Body() { refreshToken }) {
    if (!refreshToken) {
      throw new BadRequestException('Missing refresh token.');
    }

    try {
      const payload = this.jwtService.verifyRefreshToken(refreshToken) as TokenPayload;
      const savedRefreshTokenFromDb = await this.authService.findRefreshTokenById(payload.jti);
      console.log(savedRefreshTokenFromDb);
      if (!savedRefreshTokenFromDb || savedRefreshTokenFromDb.revoked) {
        throw new UnauthorizedException('Unauthorized');
      }

      const hashedToken = this.jwtService.hashToken(refreshToken);
      if (hashedToken !== savedRefreshTokenFromDb.hashedToken) {
        throw new UnauthorizedException('Unauthorized');
      }

      const user = await this.userService.findUserById(+payload.userId);
      if (!user) {
        throw new UnauthorizedException('Unauthorized');
      }

      // Update the revoked status of the refresh token
      await this.authService.deleteRefreshTokenById(savedRefreshTokenFromDb.id);

      const jti = uuidv4();
      const { accessToken, refreshToken: newRefreshToken } = await this.jwtService.generateToken(user, jti);
      await this.authService.addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, userId: user.id });

      return {
        accessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Expired Token');
      }

      throw new UnauthorizedException('Unauthorized');
    }
  }

}


@Controller('/register')
export class RegisterController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) { }

  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async register(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.name) throw new BadRequestException('Name is required');
    if (!createUserDto.email) throw new BadRequestException('Email is required');
    if (!createUserDto.password) throw new BadRequestException('Password is required');
    if (!createUserDto.gender) throw new BadRequestException('Gender is required');
    if (!Object.values(GenderEnum).includes(createUserDto.gender.toUpperCase() as GenderEnum)) throw new BadRequestException('Gender is not valid')
    if (createUserDto.password.length < 6) throw new BadRequestException('Password must be at least 6 characters');
    const isExist = await this.userService.findOneByEmail(createUserDto.email);
    if (isExist) {
      throw new BadRequestException('Email already exists');
    }
    createUserDto.role = 'USER'
    const user = await this.userService.createUser(createUserDto);
    const jti = uuidv4();
    const { accessToken, refreshToken } = await this.jwtService.generateToken(user, jti)
    await this.authService.addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });
    // return new UserEntity(user)
    return {
      accessToken,
      refreshToken,
    }
  }
}



// @Controller('/refreshToken')
// export class AuthController {
//   constructor(
//     private readonly userService: UserService,
//     private readonly authService: AuthService,
//     private readonly jwtService: JwtService,
//   ) { }
//   // constructor(private readonly UserService: UserService ) {}
//   @UseFilters(HttpExceptionFilter)
//   @Post()
//   async logIn(@Body() { email, password }) {
//     if (!email) throw new BadRequestException('Email is required')
//     if (!password) throw new BadRequestException('Password is required')
//     return await this.authService.logIn(email, password)
//   }
// }