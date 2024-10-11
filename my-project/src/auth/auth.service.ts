import { BadRequestException, Injectable } from '@nestjs/common';
import { db } from '../drizzle/db';
import { refreshTokenTable, usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { SignUpDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { uuid } from 'uuidv4';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { SetPasswordDto } from './dtos/set-password.dto';

@Injectable()
export class AuthService {

    constructor(private readonly jwtService:JwtService){ }

    private async emailInUse(email: string): Promise<boolean> {
        const user = await db.select().from(usersTable).where(eq(usersTable.email, email)).execute();
        return user.length > 0;
    }

    async googleLogin(req): Promise<{ message: string; user?: any ; token?:string}> {
        if (!req.user) {
            return { message: 'No user from Google' };
        }

        console.log(req.user);

        const emailInUse = await this.emailInUse(req.user.email);
        if (emailInUse) {
            //token ver giriş yapsın
            console.log(req.user.id);
            const token= await this.CreateAccessToken(req.user.id)
            return { message: 'Email  already in use' ,token:token.accessToken};
        }

        const newUser = {
            id:uuid(),
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            picture: req.user.picture,
            googleAccessToken: req.user.accessToken,
        };

        await db.insert(usersTable).values(newUser);
        return {
            message: 'User registered successfully',
        };

    }

    async signUp(signUpDto:SignUpDto){
        const {email,firstName,lastName,password}=signUpDto;
        const emailInUse=await this.emailInUse(email);
        if(emailInUse){
            throw new BadRequestException('email already in use');
        }
        
        const hashedPassword= await bcrypt.hash(password,10);
        
        const newUser={
            id:uuid(),
            email:signUpDto.email,
            firstName:signUpDto.firstName,
            lastName:signUpDto.lastName,
            password:hashedPassword,   
        }    

        console.log(newUser);
        await db.insert(usersTable).values(newUser);
        return{
            newUser
        }   
    }

    async logIn(loginDto:LoginDto){
        const {email,password}=loginDto;
        const user= await db.query.usersTable.findFirst({
            where:eq(usersTable.email,email)
        }).execute();

        console.log(user);
        if(user==null){
            throw new BadRequestException('There is no user associated with this email');
        }

        const passwordMatch=await bcrypt.compare(password,user.password);

        if(!passwordMatch){
            throw new BadRequestException("Wrong credentials");
        }

        const token=await this.CreateAccessToken(user.id);
        return{
            user,
            accessToken:token.accessToken,
        }
    }

    private async CreateAccessToken(id:string){
        const user= await db.select().from(usersTable).where(eq(usersTable.id,id)).execute();
        if(user==null){
            throw new BadRequestException('there is no user associated with this userId');
        }


        const payload = { email: user[0].email,id:user[0].id};
        const accessToken=this.jwtService.sign({payload});
        const refreshToken=uuid();
        await this.storeRefreshToken(refreshToken,id);
        return {
            refreshToken,accessToken
        }
    }

    private async refreshTokens(refreshToken: string) {
        const token = await db.query.refreshTokenTable.findFirst({
            where: eq(refreshTokenTable.token, refreshToken),
        });
    
        if (!token) {
            throw new BadRequestException("Refresh token is invalid or expired");
        }
    
        if (!token || new Date(token.expiryDate) < new Date()) {
          throw new BadRequestException("Refresh token is invalid or expired");
        }
    
        return this.CreateAccessToken(token.userId);
    }

    private async storeRefreshToken(refreshToken: string, userId: string) {
        const expiryDate = new Date();
        const newExpiryDate = new Date(expiryDate.setDate(expiryDate.getDate() + 14)).toISOString();
    
        const existingToken = await db.select().from(refreshTokenTable).where(eq(refreshTokenTable.token,refreshToken)).execute()
    
        if (existingToken.length > 0) {
            await db.update(refreshTokenTable)
                .set({ expiryDate: newExpiryDate })
                .where(eq(refreshTokenTable.token,refreshToken))
                .execute();
        } else {
            await db.insert(refreshTokenTable).values({
                token: refreshToken,
                expiryDate: newExpiryDate,
                userId: userId,
            }).execute();
        }
    }

    //google ile girenler için password oluşturma
    async setPassword(setPasswordDto: SetPasswordDto) {
        const { email, password } = setPasswordDto;
    
        const user = await db.select().from(usersTable).where(eq(usersTable.email, email)).execute();
        if (user.length === 0) {
            throw new BadRequestException('There is no user associated with this email');
        }
    
        const hashedPassword:string = await bcrypt.hash(password, 10);
        await db.update(usersTable).set({password:hashedPassword}).where(eq(usersTable.email,email)).execute();
        return { message: 'Password set successfully' };
    }
    
   

    async changePassword(changePasswordDto:ChangePasswordDto){ //authorization ekle
        const{email,oldPassword,newPassword}=changePasswordDto;

        const user= await db.select().from(usersTable).where(eq(usersTable.email,email)).execute();
        if(user==null){
            throw new BadRequestException('there is no user associated with this email');
        }

        //console.log(user[0].email);

        const passwordMatch = await bcrypt.compare(oldPassword, user[0].password);

        if(!passwordMatch){
            throw new BadRequestException('Wrong credentials');
        }

        const hashedNewPassword=await bcrypt.hash(newPassword,10);

        await db.update(usersTable).set({password:hashedNewPassword}).where(eq(usersTable.email,email)).execute();
        return { message: 'Password changed successfully' }

    }


    //resetpassword,forgotpassword
    

}

