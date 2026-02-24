import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { envs } from 'src/config/envs.config';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { File } from './entities/file.entity';

@Injectable()
export class S3AwsService {
  private readonly s3Client: S3Client;
  private readonly bucketName = envs.key.aws.bucket;

  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {
    this.s3Client = new S3Client({
      region: 'us-east-2', // O la región que uses
      credentials: {
        accessKeyId: envs.key.aws.key,
        secretAccessKey: envs.key.aws.secret,
      },
    });
  }
  async uploadFile(file: Express.Multer.File) {
    const { originalname, mimetype, buffer } = file;

    // Generamos un nombre único para evitar colisiones
    const fileKey = `${Date.now()}-${originalname.replace(' ', '_')}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      Body: buffer,
      ContentType: mimetype,
      // Nota: Ya no incluimos ACL: 'public-read' para evitar el error anterior
    });

    try {
      const response = await this.s3Client.send(command);

      const fileAws = new CreateFileDto(
        fileKey,
        `https://${this.bucketName}.s3.amazonaws.com/${fileKey}`,
      );
      return this.saveInDB(fileAws);
    } catch (error) {
      console.error('Error al subir a S3:', error);
      throw error;
    }
  }

  async deleteFile(fileKey: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    try {
      const response = await this.s3Client.send(command);
      await this.deleteFileInDB(fileKey);
      return {
        requestId: response.$metadata.requestId,
      };
    } catch (error) {
      console.error('Error al eliminar de S3:', error);
      // Podrías lanzar una excepción de NestJS aquí
      throw error;
    }
  }

  saveInDB(fileAws: CreateFileDto) {
    const file = this.fileRepository.create(fileAws);
    return this.fileRepository.save(file);
  }

  async deleteFileInDB(fileKey: string) {
    const file = await this.fileRepository.findOne({ where: { key: fileKey } });
    if (!file) {
      throw new Error('Archivo no encontrado');
    }
    return this.fileRepository.remove(file);
  }
}
