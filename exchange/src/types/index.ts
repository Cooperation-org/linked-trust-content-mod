export interface Content {
  id: number;
  url: string;
  message?: string;
  jobId: number;
  status: string;
  updateHook: string;
  imgUrl: string;
  isThread?: boolean | null;
  fullThread?: string | { [key: string]: any };
  reviews: Review[];
}

export type Review = {
  id: number;
  contentId: number;
  reviewerId: number;
  status: string;
  risk: true;
  notRisk: false;
};

export interface JobDetailProps {
  id: number;
  title: string;
  description: string;
  groupId: number;
  contentId: null | number | string;
  reviewersRequired: number;
  fundAmount: number;
  escrowAddress: string;
  group: { [key: string]: any };
  content: Content;
}
