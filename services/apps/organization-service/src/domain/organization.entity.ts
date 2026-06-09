import { v4 as uuidv4 } from 'uuid';

export class Organization {
  id: string;
  tenantId: string;
  name: string;
  uai: string; // Unité Administrative Immatriculée (French school ID)
  type: 'school' | 'college' | 'lycee' | 'other';
  address?: string;
  createdAt: Date;

  constructor(params: {
    tenantId: string;
    name: string;
    uai: string;
    type: 'school' | 'college' | 'lycee' | 'other';
    address?: string;
  }) {
    this.id = uuidv4();
    this.tenantId = params.tenantId;
    this.name = params.name;
    this.uai = params.uai;
    this.type = params.type;
    this.address = params.address;
    this.createdAt = new Date();
  }
}
