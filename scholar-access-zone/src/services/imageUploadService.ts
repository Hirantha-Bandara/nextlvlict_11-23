import { apiFetch } from '@/lib/utils';

export interface GalleryImage { id: number; image_url: string; display_order: number; is_active?: boolean; }
export interface BranchImage { id?: number; branch_name: string; image_url: string; }
export type GalleryImageOrder = { id: number; displayOrder: number };
export type UploadResult = { success: boolean; message?: string; imageUrl?: string; id?: number; displayOrder?: number };

async function request(action: string, body: BodyInit, method: 'POST' = 'POST'): Promise<any> {
  const response = await apiFetch('ImageUploadServlet', { method, body, credentials: 'include' });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) throw new Error(data.message || 'Image request failed');
  return data;
}
async function upload(action: string, fields: Record<string, string>, image: File): Promise<UploadResult> {
  const form = new FormData(); form.append('action', action);
  Object.entries(fields).forEach(([key, value]) => form.append(key, value)); form.append('image', image);
  return request(action, form, 'POST');
}
function actionForm(action: string, fields: Record<string, string> = {}) {
  const form = new FormData();
  form.append('action', action);
  Object.entries(fields).forEach(([key, value]) => form.append(key, value));
  return form;
}
export const imageUploadService = {
  uploadRecordingThumbnail: (recordingId: number, image: File) => upload('uploadRecordingThumbnail', { recordingId: String(recordingId) }, image),
  deleteRecordingThumbnail: (recordingId: number) => request('deleteRecordingThumbnail', actionForm('deleteRecordingThumbnail', { recordingId: String(recordingId) }), 'POST'),
  uploadTuteCover: (tuteId: number, image: File) => upload('uploadTuteCover', { tuteId: String(tuteId) }, image),
  deleteTuteCover: (tuteId: number) => request('deleteTuteCover', actionForm('deleteTuteCover', { tuteId: String(tuteId) }), 'POST'),
  uploadTestimonialImage: (testimonialId: number, image: File) => upload('uploadTestimonialImage', { testimonialId: String(testimonialId) }, image),
  uploadEventImage: (eventId: number, image: File) => upload('uploadEventImage', { eventId: String(eventId) }, image),
  deleteEventImage: (eventId: number) => request('deleteEventImage', actionForm('deleteEventImage', { eventId: String(eventId) }), 'POST'),
  uploadGalleryImage: (image: File) => upload('uploadGalleryImage', {}, image),
  listGalleryImages: async (): Promise<GalleryImage[]> => { const data = await request('listGalleryImages', actionForm('listGalleryImages'), 'POST'); return (data.images || []).map((x: any) => ({ id: x.id, image_url: x.image_url || x.imageUrl, display_order: x.display_order ?? x.displayOrder ?? 0, is_active: x.is_active ?? x.isActive })).sort((a: GalleryImage, b: GalleryImage) => a.display_order - b.display_order); },
  deleteGalleryImage: (imageId: number) => request('deleteGalleryImage', actionForm('deleteGalleryImage', { imageId: String(imageId) }), 'POST'),
  reorderGalleryImages: (orderData: GalleryImageOrder[]) => request('reorderGalleryImages', actionForm('reorderGalleryImages', { orderData: JSON.stringify(orderData) }), 'POST'),
  uploadBranchImage: (branchName: string, image: File) => upload('uploadBranchImage', { branchName }, image),
  deleteBranchImage: (branchName: string) => request('deleteBranchImage', actionForm('deleteBranchImage', { branchName }), 'POST'),
  listBranchImages: async (): Promise<BranchImage[]> => { const data = await request('listBranchImages', actionForm('listBranchImages'), 'POST'); return (data.images || []).map((x: any) => ({ id: x.id, branch_name: x.branch_name || x.branchName, image_url: x.image_url || x.imageUrl })); },
};
