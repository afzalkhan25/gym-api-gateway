import { Controller, Get, Post, Body, Patch, Param, Delete, Res, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) { }

  @Post()
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionService.create(createCollectionDto);
  }

  @Get()
  findAll() {
    return this.collectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCollectionDto: UpdateCollectionDto) {
    return this.collectionService.update(+id, updateCollectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collectionService.remove(+id);
  }


  // @Get('/invoice/:id')
  // getInvoice(@Res() res: Response) {
  //   const file = createReadStream(join(process.cwd(), 'package.json'));
  //   //file.pipe(res);
  //   return new StreamableFile(file);
  // }

  @Get('/invoice/:id')
  getInvoice(@Res() res: Response): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    //file.pipe(res);

    return new StreamableFile(file);
  }
}
