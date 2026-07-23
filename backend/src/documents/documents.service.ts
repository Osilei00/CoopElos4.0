import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class DocumentsService {
  private s3: S3Client;
  private bucketName: string;

  constructor(private prisma: PrismaService) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
    this.bucketName = process.env.S3_BUCKET_NAME || 'coopelos-documents';
  }

  async findAll(cooperadoId: string) {
    return this.prisma.document.findMany({
      where: { cooperado_id: cooperadoId, deleted_at: null },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string, cooperativeId: string) {
    const document = await this.prisma.document.findFirst({
      where: {
        id,
        cooperado: { cooperative_id: cooperativeId },
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async upload(cooperadoId: string, file: Express.Multer.File) {
    const fileKey = `cooperados/${cooperadoId}/${Date.now()}-${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return this.prisma.document.create({
      data: {
        cooperado_id: cooperadoId,
        name: file.originalname,
        file_key: fileKey,
        mime_type: file.mimetype,
        file_size: file.size,
      },
    });
  }

  async getSignedUrl(id: string, cooperativeId: string) {
    const document = await this.prisma.document.findFirst({
      where: {
        id,
        cooperado: { cooperative_id: cooperativeId },
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: document.file_key,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });

    await this.prisma.document.update({
      where: { id },
      data: { file_url: url },
    });

    return { url };
  }

  async remove(id: string, cooperativeId: string) {
    const document = await this.prisma.document.findFirst({
      where: {
        id,
        cooperado: { cooperative_id: cooperativeId },
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: document.file_key,
      }),
    );

    return this.prisma.document.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
