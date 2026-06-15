export interface Content {
  id: string;
  caption: string;
  imageUrl?: string;
  hashtags: string[];
  type: string;
  tone: string;
  style: string;
  createdAt: Date;
  scheduledDate?: string;
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
}
