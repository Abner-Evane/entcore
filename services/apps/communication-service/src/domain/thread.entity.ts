import { v4 as uuidv4 } from 'uuid';

export class Thread {
  id: string;
  tenantId: string;
  subject: string;
  participantIds: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(params: { tenantId: string; subject: string; participantIds: string[] }) {
    this.id = uuidv4();
    this.tenantId = params.tenantId;
    this.subject = params.subject;
    this.participantIds = params.participantIds;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  addParticipant(userId: string): void {
    if (!this.participantIds.includes(userId)) {
      this.participantIds.push(userId);
      this.updatedAt = new Date();
    }
  }
}
