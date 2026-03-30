import { hubspotConfig } from '@sociolume/config';

const HS_API_KEY = hubspotConfig.apiKey;
const HS_PORTAL_ID = hubspotConfig.portalId;
const HS_BASE_URL = 'https://api.hubapi.com';

// HubSpot CRM client
export class HubSpotClient {
  private apiKey: string;
  private portalId: string;
  private baseUrl: string;

  constructor(apiKey = HS_API_KEY, portalId = HS_PORTAL_ID) {
    this.apiKey = apiKey;
    this.portalId = portalId;
    this.baseUrl = HS_BASE_URL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Contact operations
  async createContact(contact: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    company?: string;
  }): Promise<HubSpotContact> {
    return this.request<HubSpotContact>('/crm/v3/objects/contacts', {
      method: 'POST',
      body: JSON.stringify({
        properties: {
          email: contact.email,
          firstname: contact.firstName,
          lastname: contact.lastName,
          phone: contact.phone,
          company: contact.company,
        },
      }),
    });
  }

  async getContact(contactId: string): Promise<HubSpotContact> {
    return this.request<HubSpotContact>(`/crm/v3/objects/contacts/${contactId}`);
  }

  async updateContact(
    contactId: string,
    properties: Partial<{
      firstName: string;
      lastName: string;
      phone: string;
      company: string;
    }>
  ): Promise<HubSpotContact> {
    const updateProperties: Record<string, string> = {};
    if (properties.firstName) updateProperties.firstname = properties.firstName;
    if (properties.lastName) updateProperties.lastname = properties.lastName;
    if (properties.phone) updateProperties.phone = properties.phone;
    if (properties.company) updateProperties.company = properties.company;

    return this.request<HubSpotContact>(`/crm/v3/objects/contacts/${contactId}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties: updateProperties }),
    });
  }

  async searchContacts(query: string): Promise<HubSpotContactSearchResult> {
    return this.request<HubSpotContactSearchResult>('/crm/v3/objects/contacts/search', {
      method: 'POST',
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'CONTAINS_TOKEN',
                value: query,
              },
            ],
          },
        ],
      }),
    });
  }

  // Company operations
  async createCompany(company: { name: string; domain?: string }): Promise<HubSpotCompany> {
    return this.request<HubSpotCompany>('/crm/v3/objects/companies', {
      method: 'POST',
      body: JSON.stringify({
        properties: {
          name: company.name,
          domain: company.domain,
        },
      }),
    });
  }

  async getCompany(companyId: string): Promise<HubSpotCompany> {
    return this.request<HubSpotCompany>(`/crm/v3/objects/companies/${companyId}`);
  }

  // Deal operations
  async createDeal(deal: {
    name: string;
    stage: string;
    amount?: number;
    pipeline?: string;
  }): Promise<HubSpotDeal> {
    return this.request<HubSpotDeal>('/crm/v3/objects/deals', {
      method: 'POST',
      body: JSON.stringify({
        properties: {
          dealname: deal.name,
          dealstage: deal.stage,
          amount: deal.amount,
          pipeline: deal.pipeline || 'default',
        },
      }),
    });
  }

  async updateDeal(
    dealId: string,
    properties: Partial<{
      name: string;
      stage: string;
      amount: number;
    }>
  ): Promise<HubSpotDeal> {
    const updateProperties: Record<string, string | number> = {};
    if (properties.name) updateProperties.dealname = properties.name;
    if (properties.stage) updateProperties.dealstage = properties.stage;
    if (properties.amount) updateProperties.amount = properties.amount;

    return this.request<HubSpotDeal>(`/crm/v3/objects/deals/${dealId}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties: updateProperties }),
    });
  }

  // Note operations
  async createNote(note: {
    content: string;
    associationTargetId?: string;
    associationType?: string;
  }): Promise<HubSpotNote> {
    return this.request<HubSpotNote>('/crm/v3/objects/notes', {
      method: 'POST',
      body: JSON.stringify({
        properties: {
          hs_note_body: note.content,
        },
        associations: note.associationTargetId
          ? [
              {
                to: { id: note.associationTargetId },
                types: [
                  {
                    associationCategory: 'HUBSPOT_DEFINED',
                    associationTypeId: note.associationType || 10,
                  },
                ],
              },
            ]
          : undefined,
      }),
    });
  }

  // Webhook verification
  verifyWebhook(payload: string, signature: string, secret: string): boolean {
    // HubSpot webhook signature verification would go here
    // For now, return true for development
    return true;
  }
}

// Default client instance
let hsClient: HubSpotClient | null = null;

export function getHubSpotClient(): HubSpotClient {
  if (!hsClient) {
    hsClient = new HubSpotClient();
  }
  return hsClient;
}

// TypeScript interfaces for HubSpot API responses
export interface HubSpotContact {
  id: string;
  properties: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface HubSpotContactSearchResult {
  total: number;
  results: HubSpotContact[];
}

export interface HubSpotCompany {
  id: string;
  properties: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface HubSpotDeal {
  id: string;
  properties: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface HubSpotNote {
  id: string;
  properties: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

// Deal stages
export const dealStages = {
  new: 'appointmentscheduled',
  qualified: 'qualifiedtobuy',
  proposal: 'presentationscheduled',
  negotiation: 'decisionmakerboughtin',
  closed: 'contractsent',
  won: 'closedwon',
  lost: 'closedlost',
} as const;

export type DealStage = keyof typeof dealStages;
