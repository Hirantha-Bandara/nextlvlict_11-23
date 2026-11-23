// src/services/portfolioService.ts
import { apiFetch } from '@/lib/utils';
import { imageUploadService } from '@/services/imageUploadService';

export interface TestimonialDTO {
    id: number;
    name: string;
    role: string;
    image?: string | null;
    text: string;
}

export interface GalleryImageDTO {
    id: number;
    image_url: string;
    display_order: number;
    is_active?: boolean;
}

export interface BranchImageDTO {
    branch_name: string;
    image_url: string;
}

export interface FreeLessonDTO {
    id: number;
    unitLabel: string;
    title: string;
    youtubeUrl: string;
    displayOrder: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface EventDTO {
    id: number;
    title: string;
    description: string;
    image: string;
    date: string;
    location: string;
    fullDescription: string;
    fee: string;
}

export interface OLTimetableDTO {
    branch: string;
    grade10: TimetableItemDTO[];
    grade11: TimetableItemDTO[];
}

export interface ALTimetableDTO {
    id: number;
    branch: string;
    year: string;
    type: string;
    time: string;
}

export interface TimetableItemDTO {
    location: string;
    grade: string;
    time: string;
    group: string;
}

interface PortfolioDataResponse {
    testimonials: TestimonialDTO[];
    events: EventDTO[];
    olTimetable: OLTimetableDTO[];
    alTimetable: ALTimetableDTO[];
    freeLessons?: FreeLessonDTO[];
}

class PortfolioService {
    async getAllPortfolioData(): Promise<PortfolioDataResponse | null> {
        try {
            const response = await apiFetch('PortfolioServlet?action=getAllData');
            
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            
            const data: PortfolioDataResponse = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching portfolio data:', error);
            
            // Return a fallback structure if needed
            return {
                testimonials: [],
                events: [],
                olTimetable: [],
                alTimetable: []
            };
        }
    }

    async getTestimonials(): Promise<TestimonialDTO[]> {
        try {
            const response = await apiFetch('PortfolioServlet?action=getTestimonials');
            
            if (!response.ok) {
                throw new Error(`Failed to fetch testimonials: ${response.status}`);
            }
            
            const data: TestimonialDTO[] = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            return [];
        }
    }

    async getEvents(): Promise<EventDTO[]> {
        try {
            const response = await apiFetch('PortfolioServlet?action=getEvents');
            
            if (!response.ok) {
                throw new Error(`Failed to fetch events: ${response.status}`);
            }
            
            const data: EventDTO[] = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching events:', error);
            return [];
        }
    }

    async getOLTimetable(): Promise<OLTimetableDTO[]> {
        try {
            const response = await apiFetch('PortfolioServlet?action=getOLTimetable');
            
            if (!response.ok) {
                throw new Error(`Failed to fetch O/L timetable: ${response.status}`);
            }
            
            const data: OLTimetableDTO[] = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching O/L timetable:', error);
            return [];
        }
    }

    async getALTimetable(): Promise<ALTimetableDTO[]> {
        try {
            const response = await apiFetch('PortfolioServlet?action=getALTimetable');
            
            if (!response.ok) {
                throw new Error(`Failed to fetch A/L timetable: ${response.status}`);
            }
            
            const data: ALTimetableDTO[] = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching A/L timetable:', error);
            return [];
        }
    }

    async getGalleryImages(): Promise<GalleryImageDTO[]> {
        try { return await imageUploadService.listGalleryImages(); } catch { return []; }
    }

    async getBranchImages(): Promise<BranchImageDTO[]> {
        try { return await imageUploadService.listBranchImages(); } catch { return []; }
    }

    /**
     * Fetch public Free Lessons from backend.
     * Order by displayOrder ASC.
     */
    async getFreeLessons(): Promise<FreeLessonDTO[]> {
        try {
            const response = await apiFetch('PortfolioServlet?action=getFreeLessons');
            
            if (!response.ok) {
                throw new Error(`Failed to fetch free lessons: ${response.status}`);
            }
            
            const data = await response.json();
            const lessons: FreeLessonDTO[] = data.lessons || (Array.isArray(data) ? data : []);
            return lessons.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        } catch (error) {
            console.error('Error fetching free lessons:', error);
            return [];
        }
    }

    /**
     * Save/replace all free lessons (Admin).
     */
    async saveFreeLessons(lessons: FreeLessonDTO[]): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const response = await apiFetch('PortfolioServlet?action=saveFreeLessons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    lessons: JSON.stringify(lessons)
                }).toString(),
                credentials: 'include'
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error saving free lessons:', error);
            return { success: false, error: 'Network error saving free lessons' };
        }
    }

    /**
     * Update an individual free lesson by ID (Admin).
     */
    async updateFreeLesson(lesson: FreeLessonDTO): Promise<{ success: boolean; lesson?: FreeLessonDTO; error?: string; message?: string }> {
        try {
            const response = await apiFetch('PortfolioServlet?action=updateFreeLesson', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    lesson: JSON.stringify(lesson)
                }).toString(),
                credentials: 'include'
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error updating free lesson:', error);
            return { success: false, error: 'Network error updating free lesson' };
        }
    }

    /**
     * Delete a free lesson by ID (Admin).
     */
    async deleteFreeLesson(id: number): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const response = await apiFetch(`PortfolioServlet?action=deleteFreeLesson&id=${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'include'
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error deleting free lesson:', error);
            return { success: false, error: 'Network error deleting free lesson' };
        }
    }

    // Method to save data back to the server
    async saveTestimonials(testimonials: TestimonialDTO[]): Promise<boolean> {
        try {
            const response = await apiFetch('PortfolioServlet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'saveTestimonials',
                    testimonials: JSON.stringify(testimonials)
                })
            });
            
            const result = await response.json();
            return result.success === true;
        } catch (error) {
            console.error('Error saving testimonials:', error);
            return false;
        }
    }

    async saveEvents(events: EventDTO[]): Promise<boolean> {
        try {
            const response = await apiFetch('PortfolioServlet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'saveEvents',
                    events: JSON.stringify(events)
                })
            });
            
            const result = await response.json();
            return result.success === true;
        } catch (error) {
            console.error('Error saving events:', error);
            return false;
        }
    }

    async saveOLTimetable(timetable: OLTimetableDTO[]): Promise<boolean> {
        try {
            const response = await apiFetch('PortfolioServlet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'saveOLTimetable',
                    timetableData: JSON.stringify(timetable)
                })
            });
            
            const result = await response.json();
            return result.success === true;
        } catch (error) {
            console.error('Error saving O/L timetable:', error);
            return false;
        }
    }

    async saveALTimetable(timetable: ALTimetableDTO[]): Promise<boolean> {
        try {
            const response = await apiFetch('PortfolioServlet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'saveALTimetable',
                    timetableData: JSON.stringify(timetable)
                })
            });
            
            const result = await response.json();
            return result.success === true;
        } catch (error) {
            console.error('Error saving A/L timetable:', error);
            return false;
        }
    }

    // Upload image method (placeholder - you'll need to implement this properly)
    async uploadImage(file: File): Promise<string | null> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('action', 'uploadImage');
            
            const response = await apiFetch('PortfolioServlet', {
                method: 'POST',
                body: formData
                // Note: Don't set Content-Type header for FormData - browser will set it with boundary
            });
            
            const result = await response.json();
            return result.success ? result.url : null;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    }
}

export default new PortfolioService();
