import { Neo4jService } from '@brakebein/nest-neo4j';
import { HttpException, Injectable, ConflictException } from '@nestjs/common';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { Gym } from './entities/gym.entity';

@Injectable()
export class GymService {
  constructor(private neo: Neo4jService) {

  }
  async create(dto: CreateGymDto) {
    try {
      //step1: first check if the gym exists 
      const gymExists = await this.neo.read(`MATCH (u:User {email:"${dto.createdBy}"})-[o:OWNS]->(g:Gym ) WHERE g.gymName="${dto.gymName}" AND g.email="${dto.email}" 
      AND g.gstNo="${dto.gstNo}" AND g.aadhar="${dto.aadhar}" return g `);

      console.log("gym=>", gymExists);
      if (gymExists.length > 0) {
        throw new ConflictException("gym exists with the same name for the same user");
      } else {

        let id: string;
        const res = await this.neo.write(`CREATE (n:Gym { id: apoc.create.uuid() ,gymName:"${dto.gymName}",
      email:"${dto.email}",panNo:"${dto.panNo}",gstNo:"${dto.gstNo}",aadhar:"${dto.aadhar}"})
      MERGE (a:Address {line1:"${dto.address.line1}", 
        line2:"${dto.address.line2}", locality:"${dto.address.locality}", 
        city:"${dto.address.city}",state:"${dto.address.state}",
        country:"${dto.address.country}",pinCode:"${dto.address.pinCode}"}) 
        MERGE (n)-[r:LOCATED_IN]->(a) return a,n
     `)
        res.map((r) => {
          id = r.n.id;
        })
        if (res) {
          const r = await this.neo.write(`MATCH (u:User{email:"${dto.createdBy}"}) 
        MATCH(g:Gym {id:"${id}"}) CREATE (u)-[o:OWNS]->(g) return o`);
          console.log("gym created successfully", r);
          return "gym created successfully"

        } else {
          return "failed to create gym due to invalid request"
        }
      }

    } catch (error) {
      console.log(error);
      throw new HttpException(error, 501);
    }

  }

  findAll() {
    return `This action returns all gym`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gym`;
  }

  update(id: number, updateGymDto: UpdateGymDto) {
    return `This action updates a #${id} gym`;
  }

  remove(id: number) {
    return `This action removes a #${id} gym`;
  }
}
