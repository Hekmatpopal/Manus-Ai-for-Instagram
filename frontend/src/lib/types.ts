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

export interface GenerateContentRequest {
  topic: string;
  contentType: string;
  tone: string;
  style: string;
  includeImage: boolean;
}

export interface ContentDraft extends Content {
  original?: GenerateContentRequest;
}
