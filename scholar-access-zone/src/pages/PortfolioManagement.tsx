import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Trash2, 
  Save, 
  Edit, 
  Upload, 
  User,
  Calendar,
  Clock,
  Building,
  CalendarDays,
  CheckCircle,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Video,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/utils';
import { isValidYouTubeUrl, getYouTubeEmbedUrl } from '@/lib/youtube';
import { AdminNavbar } from '@/components/AdminNavbar';
import { ImageUploader } from '@/components/ImageUploader';
import { imageUploadService, type GalleryImage, type BranchImage } from '@/services/imageUploadService';
import portfolioService, { type FreeLessonDTO } from '@/services/portfolioService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// Types
interface Testimonial {
  id: number;
  name: string;
  role: string;
  image?: string | null;
  text: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  fullDescription: string;
  fee?: string;
}

interface TimetableItem {
  location: string;
  grade: string;
  time: string;
  group?: string;
}

interface OLTimetable {
  branch: string;
  grade10: TimetableItem[];
  grade11: TimetableItem[];
}

interface ALTimetable {
  id: number;
  branch: string;
  year: string;
  type: string;
  time: string;
}

interface PortfolioData {
  testimonials: Testimonial[];
  events: Event[];
  olTimetable: OLTimetable[];
  alTimetable: ALTimetable[];
}

const PortfolioManagement = () => {
  const [activeTab, setActiveTab] = useState('testimonials');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [branchImages, setBranchImages] = useState<BranchImage[]>([]);
  const [freeLessons, setFreeLessons] = useState<FreeLessonDTO[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [testimonialImage, setTestimonialImage] = useState<File | null>(null);
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [branchFile, setBranchFile] = useState<File | null>(null);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [reorderingGallery, setReorderingGallery] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<{ type: 'gallery'; id: number } | { type: 'branch'; branchName: string } | null>(null);
  
  // Data states
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    testimonials: [],
    events: [],
    olTimetable: [],
    alTimetable: []
  });

  // Form states
  const [testimonialForm, setTestimonialForm] = useState<Testimonial>({
    id: 0,
    name: '',
    role: '',
    image: 'https://placehold.co/70x70/3c6299/FFFFFF?text=ST',
    text: ''
  });

  const [eventForm, setEventForm] = useState<Event>({
    id: 0,
    title: '',
    description: '',
    image: 'https://placehold.co/400x300/3c6299/FFFFFF?text=Event',
    date: '',
    location: '',
    fullDescription: '',
    fee: ''
  });

  const [freeLessonForm, setFreeLessonForm] = useState<{
    id: number;
    unitLabel: string;
    title: string;
    youtubeUrl: string;
    displayOrder: number;
  }>({
    id: 0,
    unitLabel: '',
    title: '',
    youtubeUrl: '',
    displayOrder: 1
  });

  const [freeLessonErrors, setFreeLessonErrors] = useState<{
    unitLabel?: string;
    title?: string;
    youtubeUrl?: string;
    displayOrder?: string;
  }>({});

  const [olTimetableForm, setOlTimetableForm] = useState({
    branch: '',
    grade10Time: '',
    grade10Group: '',
    grade11Time: '',
    grade11Group: ''
  });

  const [alTimetableForm, setAlTimetableForm] = useState({
    branch: '',
    year: '2026',
    type: 'Theory',
    time: ''
  });
  const [isCustomYear, setIsCustomYear] = useState(false);

  // Dialog states
  const [showTestimonialDialog, setShowTestimonialDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showFreeLessonDialog, setShowFreeLessonDialog] = useState(false);
  const [showOLTimetableDialog, setShowOLTimetableDialog] = useState(false);
  const [showALTimetableDialog, setShowALTimetableDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingFreeLessonId, setEditingFreeLessonId] = useState<number | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<FreeLessonDTO | null>(null);
  const [editingOLBranchIndex, setEditingOLBranchIndex] = useState<number | null>(null);
  const [editingALClassIndex, setEditingALClassIndex] = useState<number | null>(null);

  useEffect(() => {
    loadPortfolioData();
    loadImages();
  }, []);

  const loadImages = async () => { try { const [galleryData, branchData] = await Promise.all([imageUploadService.listGalleryImages(), imageUploadService.listBranchImages()]); setGallery(galleryData.sort((a, b) => a.display_order - b.display_order)); setBranchImages(branchData); } catch (error) { console.error(error); toast.error('Failed to load image data'); } };

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      const [response, lessons] = await Promise.all([
        apiFetch('PortfolioServlet?action=getAllData', { credentials: 'include' }),
        portfolioService.getFreeLessons()
      ]);
      
      if (response.ok) {
        const data: PortfolioData = await response.json();
        setPortfolioData(data);
      }
      setFreeLessons(lessons || []);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      toast.error('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await Promise.all([loadPortfolioData(), loadImages()]);
      toast.success('Data refreshed from database');
    } finally {
      setRefreshing(false);
    }
  };

  const saveData = async (section: string, data: any) => {
    try {
      setSaving(true);
      let action = '';
      let paramName = '';
      
      const actions: Record<string, [string, string]> = {
        testimonials: ['saveTestimonials', 'testimonials'],
        events: ['saveEvents', 'events'],
        freeLessons: ['saveFreeLessons', 'lessons'],
        olTimetable: ['saveOLTimetable', 'timetableData'],
        alTimetable: ['saveALTimetable', 'timetableData']
      };

      if (actions[section]) {
        [action, paramName] = actions[section];
      } else {
        toast.error('Invalid section');
        return;
      }

      const response = await apiFetch(`PortfolioServlet?action=${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          [paramName]: JSON.stringify(data)
        }).toString(),
        credentials: 'include'
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message || 'Data saved successfully');
        await loadPortfolioData();
      } else {
        toast.error(result.error || 'Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSection = () => {
    if (activeTab === 'freeLessons') {
      saveData('freeLessons', freeLessons);
      return;
    }
    const sectionData = portfolioData[activeTab as keyof PortfolioData];
    if (sectionData) {
      saveData(activeTab, sectionData);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      
      // Save all sections sequentially
      const sections = ['testimonials', 'events', 'olTimetable', 'alTimetable'];

      for (const section of sections) {
        const data = portfolioData[section as keyof PortfolioData];
        await saveData(section, data);
      }
      await saveData('freeLessons', freeLessons);
      
      toast.success('All portfolio data saved successfully');
    } catch (error) {
      console.error('Error saving all data:', error);
      toast.error('Failed to save all data');
    } finally {
      setSaving(false);
    }
  };

  // Testimonial Functions
  const openTestimonialDialog = (testimonial?: Testimonial) => {
    setTestimonialImage(null);
    if (testimonial) {
      setTestimonialForm({ ...testimonial });
      setEditingId(testimonial.id);
    } else {
      setTestimonialForm({
        id: 0,
        name: '',
        role: '',
        image: 'https://placehold.co/70x70/3c6299/FFFFFF?text=ST',
        text: ''
      });
      setEditingId(null);
    }
    setShowTestimonialDialog(true);
  };

  const saveTestimonial = async () => {
    if (!testimonialForm.name || !testimonialForm.text) {
      toast.error('Name and testimonial text are required');
      return;
    }

    const newTestimonials = [...portfolioData.testimonials];
    
    if (editingId !== null) {
      const index = newTestimonials.findIndex(t => t.id === editingId);
      if (index !== -1) {
        newTestimonials[index] = testimonialForm;
      }
    } else {
      const newId = Math.max(...newTestimonials.map(t => t.id), 0) + 1;
      newTestimonials.push({ 
        ...testimonialForm, 
        id: newId 
      });
    }

    // Update local state immediately
    setPortfolioData({ ...portfolioData, testimonials: newTestimonials });
    
    // Save to database
    await saveData('testimonials', newTestimonials);
    const testimonialId = editingId ?? newTestimonials[newTestimonials.length - 1]?.id;
    if (testimonialImage && testimonialId) {
      try { setUploading(true); await imageUploadService.uploadTestimonialImage(testimonialId, testimonialImage); toast.success('Profile image uploaded'); } catch (error) { toast.error(error instanceof Error ? error.message : 'Testimonial saved but image upload failed'); } finally { setUploading(false); }
    }
    
    setShowTestimonialDialog(false);
    toast.success(editingId !== null ? 'Testimonial updated' : 'Testimonial added');
  };

  const deleteTestimonial = async (id: number) => {
    const newTestimonials = portfolioData.testimonials.filter(t => t.id !== id);
    setPortfolioData({ ...portfolioData, testimonials: newTestimonials });
    await saveData('testimonials', newTestimonials);
    toast.success('Testimonial deleted');
  };

  const uploadGallery = async () => {
    if (!galleryFiles.length) return;
    setUploading(true); const results = await Promise.allSettled(galleryFiles.map(file => imageUploadService.uploadGalleryImage(file)));
    const failed = results.filter(result => result.status === 'rejected');
    if (failed.length) toast.error(`${failed.length} image${failed.length === 1 ? '' : 's'} failed to upload`); else toast.success(`${galleryFiles.length} image${galleryFiles.length === 1 ? '' : 's'} uploaded`);
    setGalleryFiles([]); setUploading(false); await loadImages();
  };
  const moveGalleryImage = async (from: number, to: number) => {
    if (to < 0 || to >= gallery.length || reorderingGallery) return;
    const previous = gallery;
    const next = [...gallery];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    const ordered = next.map((image, displayOrder) => ({ ...image, display_order: displayOrder }));
    setGallery(ordered); setReorderingGallery(true);
    try {
      await imageUploadService.reorderGalleryImages(ordered.map(({ id, display_order }) => ({ id, displayOrder: display_order })));
      toast.success('Gallery order saved');
    } catch (error) {
      setGallery(previous);
      toast.error(error instanceof Error ? error.message : 'Failed to save gallery order');
    } finally { setReorderingGallery(false); }
  };
  const uploadBranch = async () => { if (!selectedBranch || !branchFile) return toast.error('Select a branch and image'); try { setUploading(true); await imageUploadService.uploadBranchImage(selectedBranch, branchFile); toast.success('Branch image uploaded'); setBranchFile(null); await loadImages(); } catch (error) { toast.error(error instanceof Error ? error.message : 'Failed to upload branch image'); } finally { setUploading(false); } };
  const branchNames = Array.from(new Set([...portfolioData.olTimetable.map(x => x.branch), ...portfolioData.alTimetable.map(x => x.branch)])).filter(Boolean).sort();

  // Event Functions
  const openEventDialog = (event?: Event) => {
    setEventImage(null);
    if (event) {
      setEventForm({ ...event });
      setEditingId(event.id);
    } else {
      setEventForm({
        id: 0,
        title: '',
        description: '',
        image: 'https://placehold.co/400x300/3c6299/FFFFFF?text=Event',
        date: '',
        location: '',
        fullDescription: '',
        fee: ''
      });
      setEditingId(null);
    }
    setShowEventDialog(true);
  };

  const saveEvent = async () => {
    if (!eventForm.title || !eventForm.description || !eventForm.date) {
      toast.error('Title, description, and date are required');
      return;
    }

    const newEvents = [...portfolioData.events];

    if (editingId !== null) {
      const index = newEvents.findIndex(e => e.id === editingId);
      if (index !== -1) {
        newEvents[index] = eventForm;
      }
    } else {
      const newId = Math.max(...newEvents.map(e => e.id), 0) + 1;
      newEvents.push({
        ...eventForm,
        id: newId
      });
    }

    setPortfolioData({ ...portfolioData, events: newEvents });

    const response = await apiFetch(`PortfolioServlet?action=saveEvents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        events: JSON.stringify(newEvents)
      }).toString(),
      credentials: 'include'
    });

    const result = await response.json();
    if (result.success) {
      const oldEventId = editingId ?? newEvents[newEvents.length - 1]?.id;
      // Get the new database ID from the mapping
      const newEventId = result.idMapping?.[oldEventId] || oldEventId;

      if (eventImage && newEventId) {
        try {
          setUploading(true);
          await imageUploadService.uploadEventImage(newEventId, eventImage);
          toast.success('Event image uploaded');
          await loadPortfolioData();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Event saved but image upload failed');
        } finally {
          setUploading(false);
        }
      } else {
        await loadPortfolioData();
      }

      setShowEventDialog(false);
      toast.success(editingId !== null ? 'Event updated' : 'Event added');
    } else {
      toast.error(result.error || 'Failed to save event');
    }
  };

  const deleteEvent = async (id: number) => {
    const newEvents = portfolioData.events.filter(e => e.id !== id);
    setPortfolioData({ ...portfolioData, events: newEvents });
    await saveData('events', newEvents);
    toast.success('Event deleted');
  };

  // O/L Timetable Functions
  const openOLTimetableDialog = (branchIndex?: number) => {
    if (branchIndex !== undefined) {
      const branch = portfolioData.olTimetable[branchIndex];
      setOlTimetableForm({
        branch: branch.branch,
        grade10Time: branch.grade10[0]?.time || '',
        grade10Group: branch.grade10[0]?.group || '',
        grade11Time: branch.grade11[0]?.time || '',
        grade11Group: branch.grade11[0]?.group || ''
      });
      setEditingOLBranchIndex(branchIndex);
    } else {
      setOlTimetableForm({
        branch: '',
        grade10Time: '',
        grade10Group: '',
        grade11Time: '',
        grade11Group: ''
      });
      setEditingOLBranchIndex(null);
    }
    setShowOLTimetableDialog(true);
  };

  const saveOLTimetable = async () => {
    if (!olTimetableForm.branch || !olTimetableForm.grade10Time || !olTimetableForm.grade11Time) {
      toast.error('Branch name and both grade times are required');
      return;
    }

    const newTimetables = [...portfolioData.olTimetable];
    const newBranch: OLTimetable = {
      branch: olTimetableForm.branch,
      grade10: [{
        location: olTimetableForm.branch,
        grade: 'Grade 10',
        time: olTimetableForm.grade10Time,
        group: olTimetableForm.grade10Group || undefined
      }],
      grade11: [{
        location: olTimetableForm.branch,
        grade: 'Grade 11',
        time: olTimetableForm.grade11Time,
        group: olTimetableForm.grade11Group || undefined
      }]
    };

    if (editingOLBranchIndex !== null) {
      newTimetables[editingOLBranchIndex] = newBranch;
    } else {
      newTimetables.push(newBranch);
    }

    setPortfolioData({ ...portfolioData, olTimetable: newTimetables });
    await saveData('olTimetable', newTimetables);
    
    setShowOLTimetableDialog(false);
    toast.success(editingOLBranchIndex !== null ? 'Branch updated' : 'Branch added');
  };

  const deleteOLTimetableBranch = async (index: number) => {
    const newTimetables = [...portfolioData.olTimetable];
    newTimetables.splice(index, 1);
    setPortfolioData({ ...portfolioData, olTimetable: newTimetables });
    await saveData('olTimetable', newTimetables);
    toast.success('Branch deleted');
  };

  const addOLClassToBranch = async (branchIndex: number, grade: 'grade10' | 'grade11') => {
    const newTimetables = [...portfolioData.olTimetable];
    const branch = newTimetables[branchIndex];
    
    branch[grade].push({
      location: branch.branch,
      grade: grade === 'grade10' ? 'Grade 10' : 'Grade 11',
      time: 'New Time',
      group: `Group ${branch[grade].length + 1}`
    });
    
    setPortfolioData({ ...portfolioData, olTimetable: newTimetables });
    await saveData('olTimetable', newTimetables);
    toast.success('Class added');
  };

  const deleteOLClass = async (branchIndex: number, grade: 'grade10' | 'grade11', classIndex: number) => {
    const newTimetables = [...portfolioData.olTimetable];
    newTimetables[branchIndex][grade].splice(classIndex, 1);
    
    if (newTimetables[branchIndex].grade10.length === 0 && 
        newTimetables[branchIndex].grade11.length === 0) {
      newTimetables.splice(branchIndex, 1);
    }
    
    setPortfolioData({ ...portfolioData, olTimetable: newTimetables });
    await saveData('olTimetable', newTimetables);
    toast.success('Class deleted');
  };

  // A/L Timetable Functions
  const openALTimetableDialog = (classIndex?: number) => {
    if (classIndex !== undefined) {
      const timetable = portfolioData.alTimetable[classIndex];
      setAlTimetableForm({
        branch: timetable.branch,
        year: timetable.year,
        type: timetable.type,
        time: timetable.time
      });
      setIsCustomYear(!['2026', '2027', 'Grade 11'].includes(timetable.year));
      setEditingALClassIndex(classIndex);
    } else {
      setAlTimetableForm({
        branch: '',
        year: '2026',
        type: 'Theory',
        time: ''
      });
      setIsCustomYear(false);
      setEditingALClassIndex(null);
    }
    setShowALTimetableDialog(true);
  };

  const saveALTimetable = async () => {
    if (!alTimetableForm.branch || !alTimetableForm.time) {
      toast.error('Branch and time are required');
      return;
    }

    const newTimetables = [...portfolioData.alTimetable];
    const newClass: ALTimetable = {
      id: editingALClassIndex !== null ? portfolioData.alTimetable[editingALClassIndex].id : 0,
      branch: alTimetableForm.branch,
      year: alTimetableForm.year,
      type: alTimetableForm.type,
      time: alTimetableForm.time
    };

    if (editingALClassIndex !== null) {
      newTimetables[editingALClassIndex] = newClass;
    } else {
      newTimetables.push(newClass);
    }

    setPortfolioData({ ...portfolioData, alTimetable: newTimetables });
    await saveData('alTimetable', newTimetables);
    
    setShowALTimetableDialog(false);
    toast.success(editingALClassIndex !== null ? 'Class updated' : 'Class added');
  };

  const deleteALTimetableClass = async (index: number) => {
    const newTimetables = [...portfolioData.alTimetable];
    newTimetables.splice(index, 1);
    setPortfolioData({ ...portfolioData, alTimetable: newTimetables });
    await saveData('alTimetable', newTimetables);
    toast.success('Class deleted');
  };

  // Free Lessons Functions
  const openFreeLessonDialog = (lesson?: FreeLessonDTO) => {
    setFreeLessonErrors({});
    if (lesson) {
      setFreeLessonForm({
        id: lesson.id,
        unitLabel: lesson.unitLabel || '',
        title: lesson.title || '',
        youtubeUrl: lesson.youtubeUrl || '',
        displayOrder: lesson.displayOrder || 1
      });
      setEditingFreeLessonId(lesson.id);
    } else {
      const nextOrder = freeLessons.length > 0 
        ? Math.max(...freeLessons.map(l => l.displayOrder || 0)) + 1 
        : 1;
      setFreeLessonForm({
        id: 0,
        unitLabel: '',
        title: '',
        youtubeUrl: '',
        displayOrder: nextOrder
      });
      setEditingFreeLessonId(null);
    }
    setShowFreeLessonDialog(true);
  };

  const validateFreeLessonForm = (): boolean => {
    const errors: { unitLabel?: string; title?: string; youtubeUrl?: string; displayOrder?: string } = {};

    if (!freeLessonForm.unitLabel.trim()) {
      errors.unitLabel = 'Unit label is required (e.g. UNIT 02)';
    } else if (freeLessonForm.unitLabel.trim().length > 100) {
      errors.unitLabel = 'Unit label cannot exceed 100 characters';
    }

    if (!freeLessonForm.title.trim()) {
      errors.title = 'Lesson title is required';
    } else if (freeLessonForm.title.trim().length > 255) {
      errors.title = 'Title cannot exceed 255 characters';
    }

    if (!freeLessonForm.youtubeUrl.trim()) {
      errors.youtubeUrl = 'YouTube video URL is required';
    } else if (!isValidYouTubeUrl(freeLessonForm.youtubeUrl.trim())) {
      errors.youtubeUrl = 'Please enter a valid YouTube video URL (e.g. https://www.youtube.com/watch?v=...)';
    }

    if (!freeLessonForm.displayOrder || freeLessonForm.displayOrder < 1) {
      errors.displayOrder = 'Display order must be a positive number (> 0)';
    }

    setFreeLessonErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveFreeLesson = async () => {
    if (!validateFreeLessonForm()) {
      toast.error('Please fix the validation errors in the form');
      return;
    }

    try {
      setSaving(true);
      const lessonData: FreeLessonDTO = {
        id: editingFreeLessonId || 0,
        unitLabel: freeLessonForm.unitLabel.trim(),
        title: freeLessonForm.title.trim(),
        youtubeUrl: freeLessonForm.youtubeUrl.trim(),
        displayOrder: Number(freeLessonForm.displayOrder)
      };

      if (editingFreeLessonId !== null) {
        // Update existing lesson
        const result = await portfolioService.updateFreeLesson(lessonData);
        if (result.success) {
          toast.success('Free lesson updated successfully');
          setShowFreeLessonDialog(false);
          const updatedLessons = await portfolioService.getFreeLessons();
          setFreeLessons(updatedLessons);
        } else {
          // Fallback to saveFreeLessons if endpoint handles batch
          const updatedList = freeLessons.map(l => l.id === editingFreeLessonId ? { ...l, ...lessonData } : l);
          const saveResult = await portfolioService.saveFreeLessons(updatedList);
          if (saveResult.success) {
            toast.success('Free lesson updated successfully');
            setShowFreeLessonDialog(false);
            setFreeLessons(updatedList.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
          } else {
            toast.error(result.error || saveResult.error || 'Failed to update free lesson');
          }
        }
      } else {
        // Create new lesson
        const updatedList = [...freeLessons, lessonData].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        const result = await portfolioService.saveFreeLessons(updatedList);
        if (result.success) {
          toast.success(result.message || 'Free lesson created successfully');
          setShowFreeLessonDialog(false);
          const refreshed = await portfolioService.getFreeLessons();
          setFreeLessons(refreshed);
        } else {
          toast.error(result.error || 'Failed to create free lesson');
        }
      }
    } catch (error) {
      console.error('Error saving free lesson:', error);
      toast.error('Failed to save free lesson');
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteLesson = async () => {
    if (!lessonToDelete) return;

    try {
      setSaving(true);
      const result = await portfolioService.deleteFreeLesson(lessonToDelete.id);
      if (result.success) {
        toast.success(result.message || 'Free lesson deleted successfully');
        const updated = freeLessons.filter(l => l.id !== lessonToDelete.id);
        setFreeLessons(updated);
        setLessonToDelete(null);
      } else {
        // If delete endpoint failed, fallback to saveFreeLessons with filtered list
        const updated = freeLessons.filter(l => l.id !== lessonToDelete.id);
        const saveResult = await portfolioService.saveFreeLessons(updated);
        if (saveResult.success) {
          toast.success('Free lesson deleted successfully');
          setFreeLessons(updated);
          setLessonToDelete(null);
        } else {
          toast.error(result.error || saveResult.error || 'Failed to delete free lesson');
        }
      }
    } catch (error) {
      console.error('Error deleting free lesson:', error);
      toast.error('Failed to delete free lesson');
    } finally {
      setSaving(false);
    }
  };

  const handleMoveLessonOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= freeLessons.length) return;

    const updated = [...freeLessons];
    const tempOrder = updated[index].displayOrder;
    updated[index].displayOrder = updated[targetIndex].displayOrder;
    updated[targetIndex].displayOrder = tempOrder;

    // Swap positions
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    // Re-index displayOrders cleanly (1, 2, 3, ...)
    const normalized = updated.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1
    }));

    setFreeLessons(normalized);
    const result = await portfolioService.saveFreeLessons(normalized);
    if (result.success) {
      toast.success('Lesson order updated');
    } else {
      toast.error(result.error || 'Failed to save lesson order');
      // Reload on error
      const original = await portfolioService.getFreeLessons();
      setFreeLessons(original);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <AdminNavbar />
      <div className="container mx-auto space-y-6 py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
          <p className="text-gray-600 mt-2">
            Manage testimonials, events, and timetables for your portfolio
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={refreshData} 
            variant="outline"
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button 
            onClick={handleSaveSection} 
            disabled={saving}
            variant="outline"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </Button>
          <Button onClick={handleSaveAll} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Save All to Database
          </Button>
        </div>
      </div>

      <Alert>
        <AlertDescription>
          Manage your portfolio content. All changes are saved to the database.
        </AlertDescription>
      </Alert>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 mb-8">
          <TabsTrigger value="testimonials">
            <User className="h-4 w-4 mr-2" />
            Testimonials
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger value="freeLessons">
            <Video className="h-4 w-4 mr-2" />
            Free Lessons
          </TabsTrigger>
          <TabsTrigger value="gallery"><Upload className="h-4 w-4 mr-2" />Gallery</TabsTrigger>
          <TabsTrigger value="branches"><Building className="h-4 w-4 mr-2" />Branch Images</TabsTrigger>
          <TabsTrigger value="olTimetable">
            <Clock className="h-4 w-4 mr-2" />
            O/L Timetable
          </TabsTrigger>
          <TabsTrigger value="alTimetable">
            <CalendarDays className="h-4 w-4 mr-2" />
            A/L Timetable
          </TabsTrigger>
        </TabsList>

        {/* Testimonials Tab */}
        <TabsContent value="testimonials">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Testimonials ({portfolioData.testimonials.length})</CardTitle>
                <Button onClick={() => openTestimonialDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Testimonial
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolioData.testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/70x70/3c6299/FFFFFF?text=ST';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">{testimonial.role}</p>
                          <p className="mt-2 text-gray-700">
                            {testimonial.text.length > 200 
                              ? `${testimonial.text.substring(0, 200)}...` 
                              : testimonial.text}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openTestimonialDialog(testimonial)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteTestimonial(testimonial.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery"><Card><CardHeader><CardTitle>Portfolio Gallery</CardTitle></CardHeader><CardContent className="space-y-6"><ImageUploader multiple uploading={uploading} onFilesChange={setGalleryFiles} /><Button onClick={uploadGallery} disabled={uploading || !galleryFiles.length}>{uploading ? 'Uploading...' : `Upload ${galleryFiles.length || ''} Image${galleryFiles.length === 1 ? '' : 's'}`}</Button><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{gallery.map(image => <div key={image.id} className="overflow-hidden rounded-lg border"><img src={image.image_url} alt="Gallery item" className="aspect-square w-full object-cover" /><div className="p-2"><Button size="sm" variant="destructive" className="w-full" onClick={() => setImageToDelete({ type: 'gallery', id: image.id })}>Delete</Button></div></div>)}</div>{!gallery.length && <p className="text-sm text-muted-foreground">No gallery images yet.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="branches"><Card><CardHeader><CardTitle>Branch Images</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid gap-4 md:grid-cols-2"><div><Label>Branch</Label><Select value={selectedBranch} onValueChange={setSelectedBranch}><SelectTrigger><SelectValue placeholder="Select a branch" /></SelectTrigger><SelectContent>{branchNames.map(branch => <SelectItem key={branch} value={branch}>{branch}</SelectItem>)}</SelectContent></Select></div><div><Label>Image</Label><ImageUploader uploading={uploading} onFilesChange={files => setBranchFile(files[0] || null)} /></div></div><Button onClick={uploadBranch} disabled={uploading || !selectedBranch || !branchFile}>{uploading ? 'Uploading...' : 'Upload Branch Image'}</Button><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{branchImages.map(image => <div key={image.branch_name} className="overflow-hidden rounded-lg border"><img src={image.image_url} alt={image.branch_name} className="aspect-square w-full object-cover" /><div className="flex items-center justify-between gap-2 p-2 text-sm"><span className="truncate">{image.branch_name}</span><Button size="sm" variant="destructive" onClick={() => setImageToDelete({ type: 'branch', branchName: image.branch_name })}>Delete</Button></div></div>)}</div></CardContent></Card></TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Events ({portfolioData.events.length})</CardTitle>
                <Button onClick={() => openEventDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolioData.events.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{event.title}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEventDialog(event)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Date</Label>
                          <p>{event.date}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Location</Label>
                          <p>{event.location}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Fee</Label>
                          <Badge variant="outline">
                            {event.fee || 'Free'}
                          </Badge>
                        </div>
                      </div>
                      {event.image && (
                        <div className="mt-4">
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Free Lessons Tab */}
        <TabsContent value="freeLessons">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Free Lessons ({freeLessons.length})</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage YouTube video lessons displayed on the public Portfolio page
                  </p>
                </div>
                <Button onClick={() => openFreeLessonDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Free Lesson
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {freeLessons.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-xl">
                  <Video className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                  <h3 className="text-lg font-semibold text-gray-800">No Free Lessons Added Yet</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto mt-1 mb-4">
                    Add YouTube video lessons that students can watch for free on the portfolio page.
                  </p>
                  <Button onClick={() => openFreeLessonDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Lesson
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto rounded-lg border">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="w-24">Order</TableHead>
                          <TableHead className="w-32">Unit</TableHead>
                          <TableHead>Lesson Title</TableHead>
                          <TableHead className="w-64">YouTube Video</TableHead>
                          <TableHead className="w-28 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {freeLessons.map((lesson, index) => (
                          <TableRow key={lesson.id || index}>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Badge variant="outline" className="font-mono text-xs font-semibold">
                                  #{lesson.displayOrder}
                                </Badge>
                                <div className="flex flex-col">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 p-0 text-slate-400 hover:text-slate-700"
                                    disabled={index === 0}
                                    onClick={() => handleMoveLessonOrder(index, 'up')}
                                    title="Move Up"
                                  >
                                    <ChevronUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 p-0 text-slate-400 hover:text-slate-700"
                                    disabled={index === freeLessons.length - 1}
                                    onClick={() => handleMoveLessonOrder(index, 'down')}
                                    title="Move Down"
                                  >
                                    <ChevronDown className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold text-primary text-xs bg-primary/10 px-2.5 py-1 rounded-md">
                                {lesson.unitLabel}
                              </span>
                            </TableCell>
                            <TableCell className="font-medium text-slate-800">
                              {lesson.title}
                            </TableCell>
                            <TableCell>
                              <a
                                href={lesson.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs text-red-600 hover:text-red-700 hover:underline gap-1.5 max-w-[240px] truncate"
                                title={lesson.youtubeUrl}
                              >
                                <i className="fab fa-youtube text-red-600"></i>
                                <span className="truncate">{lesson.youtubeUrl}</span>
                                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                              </a>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openFreeLessonDialog(lesson)}
                                  title="Edit Lesson"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setLessonToDelete(lesson)}
                                  title="Delete Lesson"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="grid grid-cols-1 gap-4 md:hidden">
                    {freeLessons.map((lesson, index) => (
                      <div key={lesson.id || index} className="border rounded-xl p-4 bg-white shadow-sm space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-xs">
                              #{lesson.displayOrder}
                            </Badge>
                            <span className="font-semibold text-primary text-xs bg-primary/10 px-2 py-0.5 rounded">
                              {lesson.unitLabel}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => openFreeLessonDialog(lesson)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 w-8 p-0"
                              onClick={() => setLessonToDelete(lesson)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-800 text-sm">{lesson.title}</h4>
                          <a
                            href={lesson.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-red-600 hover:underline gap-1 mt-1 break-all"
                          >
                            <i className="fab fa-youtube"></i>
                            <span>Watch on YouTube</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* O/L Timetable Tab */}
        <TabsContent value="olTimetable">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>O/L Timetable ({portfolioData.olTimetable.length} branches)</CardTitle>
                <Button onClick={() => openOLTimetableDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Branch
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {portfolioData.olTimetable.map((branch, branchIndex) => (
                  <Card key={branchIndex}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center">
                          <Building className="h-5 w-5 mr-2 text-primary" />
                          {branch.branch}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openOLTimetableDialog(branchIndex)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteOLTimetableBranch(branchIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Grade 10 Classes */}
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-green-600 flex items-center">
                              Grade 10 Classes
                            </h4>
                            <Button
                              size="sm"
                              onClick={() => addOLClassToBranch(branchIndex, 'grade10')}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {branch.grade10.map((item, classIndex) => (
                              <div key={classIndex} className="flex justify-between items-center p-2 bg-green-50 rounded">
                                <div>
                                  <p className="font-medium">{item.time}</p>
                                  {item.group && (
                                    <Badge variant="outline">{item.group}</Badge>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteOLClass(branchIndex, 'grade10', classIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Grade 11 Classes */}
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-orange-600 flex items-center">
                              Grade 11 Classes
                            </h4>
                            <Button
                              size="sm"
                              onClick={() => addOLClassToBranch(branchIndex, 'grade11')}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {branch.grade11.map((item, classIndex) => (
                              <div key={classIndex} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                                <div>
                                  <p className="font-medium">{item.time}</p>
                                  {item.group && (
                                    <Badge variant="outline">{item.group}</Badge>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteOLClass(branchIndex, 'grade11', classIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* A/L Timetable Tab */}
        <TabsContent value="alTimetable">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>A/L Timetable ({portfolioData.alTimetable.length} classes)</CardTitle>
                <Button onClick={() => openALTimetableDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Class
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Branch</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolioData.alTimetable.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium flex items-center">
                        <Building className="h-4 w-4 mr-2 text-gray-400" />
                        {item.branch}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          item.year === '2026' || item.year === '2027' 
                            ? 'destructive' 
                            : 'default'
                        }>
                          {item.year}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          item.type === 'Theory' 
                            ? 'default' 
                            : 'secondary'
                        }>
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        {item.time}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openALTimetableDialog(index)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteALTimetableClass(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Testimonial Dialog */}
      <Dialog open={showTestimonialDialog} onOpenChange={setShowTestimonialDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId !== null ? 'Edit Testimonial' : 'Add New Testimonial'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Student Name *</Label>
                <Input
                  id="name"
                  value={testimonialForm.name}
                  onChange={(e) => setTestimonialForm({...testimonialForm, name: e.target.value})}
                  placeholder="Sehan Dinusara"
                />
              </div>
              <div>
                <Label htmlFor="role">Student Role *</Label>
                <Input
                  id="role"
                  value={testimonialForm.role}
                  onChange={(e) => setTestimonialForm({...testimonialForm, role: e.target.value})}
                  placeholder="Royal College, Colombo 07 - Index No. 40127258"
                />
              </div>
            </div>
            
            <div>
              <Label>Profile Image</Label>
              <ImageUploader currentImage={testimonialForm.image} uploading={uploading} onFilesChange={files => setTestimonialImage(files[0] || null)} />
            </div>
            
            <div>
              <Label htmlFor="text">Testimonial Text *</Label>
              <Textarea
                id="text"
                value={testimonialForm.text}
                onChange={(e) => setTestimonialForm({...testimonialForm, text: e.target.value})}
                placeholder="Enter testimonial text..."
                rows={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                {testimonialForm.text.length} characters
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTestimonialDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveTestimonial}>
              {editingId !== null ? 'Update Testimonial' : 'Add Testimonial'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={imageToDelete !== null} onOpenChange={open => !open && setImageToDelete(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete this image?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={async () => { if (!imageToDelete) return; try { if (imageToDelete.type === 'gallery') { await imageUploadService.deleteGalleryImage(imageToDelete.id); setGallery(current => current.filter(image => image.id !== imageToDelete.id)); } else { await imageUploadService.deleteBranchImage(imageToDelete.branchName); setBranchImages(current => current.filter(image => image.branch_name !== imageToDelete.branchName)); } toast.success('Image deleted'); } catch (error) { toast.error(error instanceof Error ? error.message : 'Failed to delete image'); } finally { setImageToDelete(null); } }}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>

      {/* Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId !== null ? 'Edit Event' : 'Add New Event'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="eventTitle">Event Title *</Label>
              <Input
                id="eventTitle"
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                placeholder="ICT Exam Preparation Seminar"
              />
            </div>
            
            <div>
              <Label htmlFor="eventDescription">Description *</Label>
              <Textarea
                id="eventDescription"
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                placeholder="Intensive one-day seminar covering essential O/L exam topics..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventDate">Date *</Label>
                <Input
                  id="eventDate"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                  placeholder="15th June 2023"
                />
              </div>
              
              <div>
                <Label htmlFor="eventLocation">Location *</Label>
                <Input
                  id="eventLocation"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                  placeholder="Colombo"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="eventImage">Event Image</Label>
              <div className="space-y-2">
                <Input
                  id="eventImage"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setEventImage(file);
                  }}
                  disabled={uploading}
                />
                {eventForm.image && !eventImage && (
                  <div className="mt-2">
                    <img
                      src={eventForm.image}
                      alt="Current event image"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                {eventImage && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(eventImage)}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="eventFee">Fee (Optional)</Label>
              <Input
                id="eventFee"
                value={eventForm.fee || ''}
                onChange={(e) => setEventForm({...eventForm, fee: e.target.value})}
                placeholder="Rs. 2,500"
              />
            </div>
            
            <div>
              <Label htmlFor="fullDescription">Full Description (HTML supported)</Label>
              <Textarea
                id="fullDescription"
                value={eventForm.fullDescription}
                onChange={(e) => setEventForm({...eventForm, fullDescription: e.target.value})}
                placeholder="Enter detailed event description..."
                rows={8}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveEvent}>
              {editingId !== null ? 'Update Event' : 'Add Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* O/L Timetable Dialog */}
      <Dialog open={showOLTimetableDialog} onOpenChange={setShowOLTimetableDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingOLBranchIndex !== null ? 'Edit Branch' : 'Add New Branch'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="branch">Branch Name *</Label>
              <Input
                id="branch"
                value={olTimetableForm.branch}
                onChange={(e) => setOlTimetableForm({...olTimetableForm, branch: e.target.value})}
                placeholder="e.g., OVIDMA - MAHARAGAMA"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border p-4 rounded-lg">
                <h4 className="font-medium mb-3 text-green-600">Grade 10</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="grade10Time">Time *</Label>
                    <Input
                      id="grade10Time"
                      value={olTimetableForm.grade10Time}
                      onChange={(e) => setOlTimetableForm({...olTimetableForm, grade10Time: e.target.value})}
                      placeholder="e.g., Wednesday 3.30PM - 5.30PM"
                    />
                  </div>
                  <div>
                    <Label htmlFor="grade10Group">Group (Optional)</Label>
                    <Input
                      id="grade10Group"
                      value={olTimetableForm.grade10Group}
                      onChange={(e) => setOlTimetableForm({...olTimetableForm, grade10Group: e.target.value})}
                      placeholder="e.g., Group 1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="border p-4 rounded-lg">
                <h4 className="font-medium mb-3 text-orange-600">Grade 11</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="grade11Time">Time *</Label>
                    <Input
                      id="grade11Time"
                      value={olTimetableForm.grade11Time}
                      onChange={(e) => setOlTimetableForm({...olTimetableForm, grade11Time: e.target.value})}
                      placeholder="e.g., Saturday 8.00AM - 10.00AM"
                    />
                  </div>
                  <div>
                    <Label htmlFor="grade11Group">Group (Optional)</Label>
                    <Input
                      id="grade11Group"
                      value={olTimetableForm.grade11Group}
                      onChange={(e) => setOlTimetableForm({...olTimetableForm, grade11Group: e.target.value})}
                      placeholder="e.g., Group 2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOLTimetableDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveOLTimetable}>
              {editingOLBranchIndex !== null ? 'Update Branch' : 'Add Branch'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* A/L Timetable Dialog */}
      <Dialog open={showALTimetableDialog} onOpenChange={setShowALTimetableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingALClassIndex !== null ? 'Edit Class' : 'Add New Class'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="alBranch">Branch *</Label>
              <Input
                id="alBranch"
                value={alTimetableForm.branch}
                onChange={(e) => setAlTimetableForm({...alTimetableForm, branch: e.target.value})}
                placeholder="e.g., SESIRA - PILIYANDALA"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="alYear">Year *</Label>
                {isCustomYear ? (
                  <Input
                    id="alYear"
                    value={alTimetableForm.year}
                    onChange={(e) => setAlTimetableForm({...alTimetableForm, year: e.target.value})}
                    placeholder="Enter year (e.g., 2028)"
                  />
                ) : (
                  <Select 
                    value={alTimetableForm.year} 
                    onValueChange={(value) => {
                      if (value === 'custom') {
                        setIsCustomYear(true);
                        setAlTimetableForm({...alTimetableForm, year: ''});
                      } else {
                        setAlTimetableForm({...alTimetableForm, year: value});
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2026">2026 Batch</SelectItem>
                      <SelectItem value="2027">2027 Batch</SelectItem>
                      <SelectItem value="Grade 11">Grade 11</SelectItem>
                      <SelectItem value="custom">+ Add Custom Year</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {isCustomYear && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 text-xs"
                    onClick={() => {
                      setIsCustomYear(false);
                      setAlTimetableForm({...alTimetableForm, year: '2026'});
                    }}
                  >
                    Use preset options
                  </Button>
                )}
              </div>
              
              <div>
                <Label htmlFor="alType">Class Type *</Label>
                <Select 
                  value={alTimetableForm.type} 
                  onValueChange={(value) => setAlTimetableForm({...alTimetableForm, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Theory">Theory</SelectItem>
                    <SelectItem value="Revision + Paper">Revision + Paper</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="alTime">Time *</Label>
              <Input
                id="alTime"
                value={alTimetableForm.time}
                onChange={(e) => setAlTimetableForm({...alTimetableForm, time: e.target.value})}
                placeholder="e.g., Saturday 1.00PM - 3.00PM"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowALTimetableDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveALTimetable}>
              {editingALClassIndex !== null ? 'Update Class' : 'Add Class'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Free Lesson Add/Edit Dialog */}
      <Dialog open={showFreeLessonDialog} onOpenChange={setShowFreeLessonDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {editingFreeLessonId !== null ? 'Edit Free Lesson' : 'Add New Free Lesson'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Label htmlFor="lessonUnit">Unit Label *</Label>
                <Input
                  id="lessonUnit"
                  value={freeLessonForm.unitLabel}
                  onChange={(e) => {
                    setFreeLessonForm({ ...freeLessonForm, unitLabel: e.target.value });
                    if (freeLessonErrors.unitLabel) setFreeLessonErrors({ ...freeLessonErrors, unitLabel: undefined });
                  }}
                  placeholder="e.g., UNIT 02"
                  className={freeLessonErrors.unitLabel ? 'border-red-500' : ''}
                />
                {freeLessonErrors.unitLabel && (
                  <p className="text-xs text-red-500 mt-1">{freeLessonErrors.unitLabel}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lessonOrder">Display Order *</Label>
                <Input
                  id="lessonOrder"
                  type="number"
                  min="1"
                  value={freeLessonForm.displayOrder}
                  onChange={(e) => {
                    setFreeLessonForm({ ...freeLessonForm, displayOrder: parseInt(e.target.value) || 1 });
                    if (freeLessonErrors.displayOrder) setFreeLessonErrors({ ...freeLessonErrors, displayOrder: undefined });
                  }}
                  className={freeLessonErrors.displayOrder ? 'border-red-500' : ''}
                />
                {freeLessonErrors.displayOrder && (
                  <p className="text-xs text-red-500 mt-1">{freeLessonErrors.displayOrder}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="lessonTitle">Lesson Title *</Label>
              <Input
                id="lessonTitle"
                value={freeLessonForm.title}
                onChange={(e) => {
                  setFreeLessonForm({ ...freeLessonForm, title: e.target.value });
                  if (freeLessonErrors.title) setFreeLessonErrors({ ...freeLessonErrors, title: undefined });
                }}
                placeholder="e.g., Data Representation — Number Systems"
                className={freeLessonErrors.title ? 'border-red-500' : ''}
              />
              {freeLessonErrors.title && (
                <p className="text-xs text-red-500 mt-1">{freeLessonErrors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lessonUrl">YouTube Video URL *</Label>
              <Input
                id="lessonUrl"
                value={freeLessonForm.youtubeUrl}
                onChange={(e) => {
                  setFreeLessonForm({ ...freeLessonForm, youtubeUrl: e.target.value });
                  if (freeLessonErrors.youtubeUrl) setFreeLessonErrors({ ...freeLessonErrors, youtubeUrl: undefined });
                }}
                placeholder="e.g., https://www.youtube.com/watch?v=XXXXXXXXXXX"
                className={freeLessonErrors.youtubeUrl ? 'border-red-500' : ''}
              />
              {freeLessonErrors.youtubeUrl && (
                <p className="text-xs text-red-500 mt-1">{freeLessonErrors.youtubeUrl}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Supports standard watch URLs, youtu.be short links, and embed URLs.
              </p>
            </div>

            {/* Live Video Preview */}
            {isValidYouTubeUrl(freeLessonForm.youtubeUrl) && (
              <div className="mt-2 rounded-lg overflow-hidden border border-slate-200">
                <div className="bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <i className="fab fa-youtube text-red-600"></i>
                  Live Preview
                </div>
                <div className="aspect-video w-full">
                  <iframe
                    src={getYouTubeEmbedUrl(freeLessonForm.youtubeUrl)}
                    title="Video Preview"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFreeLessonDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveFreeLesson}>
              {editingFreeLessonId !== null ? 'Update Lesson' : 'Add Lesson'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Free Lesson Delete Confirmation Dialog */}
      <AlertDialog open={!!lessonToDelete} onOpenChange={(open) => !open && setLessonToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Free Lesson</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold text-slate-900">"{lessonToDelete?.title}"</span> ({lessonToDelete?.unitLabel})? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDeleteLesson}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {portfolioData.testimonials.length}
              </div>
              <p className="text-sm text-gray-600">Testimonials</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {portfolioData.events.length}
              </div>
              <p className="text-sm text-gray-600">Events</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {freeLessons.length}
              </div>
              <p className="text-sm text-gray-600">Free Lessons</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {portfolioData.olTimetable.length}
              </div>
              <p className="text-sm text-gray-600">O/L Branches</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">
                {portfolioData.alTimetable.length}
              </div>
              <p className="text-sm text-gray-600">A/L Classes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Source Indicator */}
      <div className="mt-4 text-center">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Data Source: Database
        </Badge>
        <p className="text-xs text-gray-500 mt-1">
          All data is stored in and retrieved from the database
        </p>
      </div>
      </div>
    </div>
  );
};

export default PortfolioManagement;
