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

  async findAll(collaboratorId: string) {
    return this.prisma.document.findMany({
      where: { collaborator_id: collaboratorId },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async upload(collaboratorId: string, file: Express.Multer.File) {
    const fileKey = `collaborators/${collaboratorId}/${Date.now()}-${file.originalname}`;

    // Upload to S3
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    // Save metadata to database
    return this.prisma.document.create({
      data: {
        collaborator_id: collaboratorId,
        name: file.originalname,
        file_key: fileKey,
        mime_type: file.mimetype,
        file_size: file.size,
      },
    });
  }

  async getSignedUrl(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: document.file_key,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });

    // Update the file_url in database
    await this.prisma.document.update({
      where: { id },
      data: { file_url: url },
    });

    return { url };
  }

  async remove(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Delete from S3
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: document.file_key,
      }),
    );

    // Delete from database
    return this.prisma.document.delete({
      where: { id },
    });
  }
}
