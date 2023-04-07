import { Neo4jService } from '@brakebein/nest-neo4j';
import { HttpException, Injectable, ConflictException } from '@nestjs/common';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { Gym } from './entities/gym.entity';
import { resolve } from 'path';

@Injectable()
export class GymService {
  constructor(private neo: Neo4jService) {}
  async create(dto: CreateGymDto) {
    try {
      //step1: first check if the gym exists
      const gymExists = await this.neo
        .read(`MATCH (u:User {email:"${dto.createdBy}"})-[o:OWNS]->(g:Gym ) WHERE g.gymName="${dto.gymName}" AND g.email="${dto.email}" 
      AND g.gstNo="${dto.gstNo}" AND g.aadhar="${dto.aadhar}" return g `);

      console.log('gym=>', gymExists);
      if (gymExists.length > 0) {
        throw new ConflictException(
          'gym exists with the same name for the same user',
        );
      } else {
        let id: string;
        const res = await this.neo
          .write(`CREATE (n:Gym { id: apoc.create.uuid() ,gymName:"${dto.gymName}",
      email:"${dto.email}",panNo:"${dto.panNo}",gstNo:"${dto.gstNo}",aadhar:"${dto.aadhar}"})
      MERGE (a:Address {line1:"${dto.address.line1}", 
        line2:"${dto.address.line2}", locality:"${dto.address.locality}", 
        city:"${dto.address.city}",state:"${dto.address.state}",
        country:"${dto.address.country}",pinCode:"${dto.address.pinCode}"}) 
        MERGE (n)-[r:LOCATED_IN]->(a) return a,n
     `);
        res.map((r) => {
          id = r.n.id;
        });
        if (res) {
          const r = await this.neo
            .write(`MATCH (u:User{email:"${dto.createdBy}"}) 
        MATCH(g:Gym {id:"${id}"}) CREATE (u)-[o:OWNS]->(g) return o`);
          console.log('gym created successfully', res);
          return 'gym created successfully';
        } else {
          return 'failed to create gym due to invalid request';
        }
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 501);
    }
  }

  async findAll() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.neo.read(
          `MATCH (g:Gym)-[r:LOCATED_IN]->(a:Address) return g,a`,
        );

        const gyms: Gym[] = [];

        res.map((r) => {
          gyms.push({ ...r.g, address: r.a });
        });

        console.log(res);

        resolve(gyms);

        return gyms;
      } catch (error) {
        throw new HttpException('error encountered', error);
      }
    });
  }

  async findAllGymForCurrentUser(email: string) {
    try {
      console.log(email);

      const res = await this.neo.read(
        `MATCH (u:User)-[:OWNS]->(g:Gym) where u.email=$email return g;`,
        { email: email },
      );
      const gyms: Gym[] = [];
      res.map((r) => gyms.push(r.g));
      return gyms;
    } catch (error) {
      throw new HttpException('error encountered', error);
    }
  }

  async getGymAddress(id: string) {
    try {
      const res = await this.neo.read(
        `MATCH (g:Gym) where g.id=$id return g;`,
        { id: id },
      );
      const gyms: Gym[] = [];
      res.map((r) => gyms.push(r.g));
      return gyms;
    } catch (error) {
      throw new HttpException('error encountered', error);
    }
  }
  async findOne(id: string) {
    try {
      const res = await this.neo.read(`MATCH (g:Gym) WHERE g.id=$id return g`, {
        id: id,
      });
      let gym: Gym;
      res.map((r) => {
        gym = r.g;
      });
      return gym;
    } catch (error) {
      throw new HttpException('error encountered', error);
    }
  }

  async update(id: string, dto: UpdateGymDto) {
    try {
      const res = await this.neo.write(`MATCH (g:Gym) where g.id="${id}" 
      SET
      g.gymName="${dto.gymName}",
      g.email="${dto.email}",
      g.panNo="${dto.panNo}",
      g.aadhar="${dto.aadhar}"
      return g
      `);
      return 'gym updated successfully';
    } catch (error) {
      throw new HttpException('error updating gym', error);
    }
  }

  async updateAddress(id: string, dto: UpdateGymDto) {
    try {
      const res = await this.neo
        .write(`MATCH (g:Gym {id:"${id}"})-[r:LOCATED_IN]->(a:Address)
      SET
      a.line1="${dto.address.line1}",
      a.line2="${dto.address.line2}",
      a.locality="${dto.address.locality}",
      a.city="${dto.address.city}",
      a.state="${dto.address.state}",
      a.country="${dto.address.country}",
      a.pinCode="${dto.address.pinCode}"
      return a
      `);
      console.log(res);
      return 'gym address updated successfully';
    } catch (error) {
      console.log(error);
      throw new HttpException('error updating gym', error);
    }
  }

  async remove(id: string) {
    try {
      const res = await this.neo.write(
        `MATCH (g:Gym) WHERE g.id=$id
      SET g.deleted=true
      return g
      `,
        { id: id },
      );
      console.log(res);
      return 'gym deleted successfully';
    } catch (error) {
      console.log(error);
      throw new HttpException('error deleteing gym', error);
    }
  }
}
