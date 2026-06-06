import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import { PdfService } from './pdf.service';
import { PrismaService } from '../prisma/prisma.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

interface PdfJobData {
  type: 'payroll' | 'timesheet_hospital' | 'timesheet_sad';
  id: string;
  cooperativeId: string;
  userId: string;
}

@Injectable()
export class PdfWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PdfWorker.name);
  private worker: Worker;
  private s3: S3Client;
  private bucketName: string;

  constructor(
    private pdfService: PdfService,
    private prisma: PrismaService,
  ) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
    this.bucketName = process.env.S3_BUCKET_NAME || 'coopelos-documents';
  }

  onModuleInit() {
    this.worker = new Worker('pdf-generation', this.processJob.bind(this), {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    });

    this.worker.on('completed', (job) => {
      this.logger.log(`PDF job ${job.id} completed for ${job.data.type}`);
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(`PDF job ${job?.id} failed: ${err.message}`);
    });

    this.logger.log('PDF Worker started');
  }

  async onModuleDestroy() {
    if (this.worker) {
      await this.worker.close();
    }
  }

  private async processJob(job: Job<PdfJobData>) {
    const { type, id, cooperativeId } = job.data;

    this.logger.log(`Processing PDF job for ${type}: ${id}`);

    let pdfBuffer: Buffer;

    switch (type) {
      case 'payroll':
        pdfBuffer = await this.pdfService.generatePayrollPdf(id, cooperativeId);
        break;
      case 'timesheet_hospital':
        pdfBuffer = await this.pdfService.generateTimesheetPdf(id, 'hospital', cooperativeId);
        break;
      case 'timesheet_sad':
        pdfBuffer = await this.pdfService.generateTimesheetPdf(id, 'sad', cooperativeId);
        break;
      default:
        throw new Error(`Unknown PDF type: ${type}`);
    }

    // Upload to S3
    const fileKey = `pdfs/${type}/${id}/${Date.now()}.pdf`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: pdfBuffer,
        ContentType: 'application/pdf',
      }),
    );

    // Generate signed URL
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 });

    // Save to database (optional - you can track generated PDFs)
    // For now, we'll just return the URL

    return { url: signedUrl, fileKey };
  }
}
