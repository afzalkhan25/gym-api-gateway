import { Injectable, NotFoundException, HttpException, NotAcceptableException } from '@nestjs/common';
import { SignUpDTO } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { Neo4jService } from '@brakebein/nest-neo4j';
import { User } from 'src/models/user.model';
@Injectable()
export class AuthService {

    constructor(private neo: Neo4jService, private jwtService: JwtService) {

    }


    async validateUser(email: string, password: string): Promise<any> {
        console.log('inside validateUser=>', email, password);
        const user = await this.getUser(email);
        console.log('user=>', user);
        if (!user) return null;
        const passwordValid = await bcrypt.compare(password, user.password)
        if (!user) {
            throw new NotAcceptableException('could not find the user');
        }
        if (user && passwordValid) {
            return user;
        }
        return null;
    }

    async login(user: User) {
        console.log('inside login=>', user)
        const payload = { user: user };
        return {
            access_token: this.jwtService.sign(payload),
        };



    }

    async signup(dto: SignUpDTO) {
        try {
            const encryptedPassword = bcrypt.hashSync(dto.password, 10);

            const query = `CREATE (u:User {firstName:"${dto.firstName}",lastName:"${dto.lastName}",email:"${dto.email}",
            mobileNo:"${dto.mobileNo}", password:"${encryptedPassword}"
        }) SET u.roles = $roles`;
            const params = { roles: dto.roles };
            const res = await this.neo.write(query, params);
            return "account created successfully"
        } catch (error) {
            return new HttpException(error, 503);
        }
    }

    async getUser(email: string) {
        const res = await this.neo.read(`MATCH (u:User) where u.email=$email return u;`, { email: email });
        console.log(res);
        if (res.length > 0) {
            let u: User;
            console.log(res);
            res.map(row => {
                console.log('row=>', row);
                u = row.u as User;
            })
            return u;
        } else {
            return null;
        }
    }

}