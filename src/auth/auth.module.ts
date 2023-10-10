import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports:[
    ConfigModule,
    UsersModule,
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>({
          secret:configService.get('JWT_SECRET'),
          signOptions:{
            expiresIn:'4h'
          }
      })
    })
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports:[JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
