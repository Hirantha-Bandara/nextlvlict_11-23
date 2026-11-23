import React, { useEffect, useState, useMemo } from 'react';
import { resources as mockResources } from '@/data/mockData';
import AccessBadge from '@/components/ui/AccessBadge';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/utils';

interface FreeResource {
  id: number;
  title: string;
  description?: string;
  downloadLink?: string;
  download_url?: string;
  link?: string;
  icon?: string;
  resourceTypeName?: string;
  tuteTypeName?: string;
  tute_type_name?: string;
  tuteType?: { id: number; name: string } | string;
  cover_image_url?: string | null;
}

const Resources: React.FC = () => {
    const [fetchedResources, setFetchedResources] = useState<FreeResource[]>([]);

    useEffect(() => {
        const loadFreeResources = async () => {
            try {
                const response = await apiFetch('TutesServlet?action=getTutes&accessType=FREE');
                if (response.ok) {
                    const data = await response.json();
                    const items = data.tutes || (Array.isArray(data) ? data : []);
                    if (items && items.length > 0) {
                        setFetchedResources(items);
                    }
                }
            } catch (error) {
                console.error('Error fetching public free resources:', error);
            }
        };

        loadFreeResources();
    }, []);

    const allFreeResources = useMemo(() => {
        if (fetchedResources.length > 0) {
            return fetchedResources;
        }
        return mockResources.map(r => ({
            id: r.id,
            title: r.title,
            description: r.description,
            downloadLink: r.downloadLink,
            icon: r.icon,
            tuteTypeName: r.title.toLowerCase().includes('paper') ? 'Question Paper' : 'Tute'
        }));
    }, [fetchedResources]);

    const freeTutes = useMemo(() => {
        return allFreeResources.filter(r => {
            const name = (typeof r.tuteType === 'object' ? r.tuteType?.name : r.tuteType) || r.tuteTypeName || r.tute_type_name || r.resourceTypeName || '';
            if (name) return name.toLowerCase().includes('tute');
            return !r.title.toLowerCase().includes('paper');
        });
    }, [allFreeResources]);

    const freeQuestionPapers = useMemo(() => {
        return allFreeResources.filter(r => {
            const name = (typeof r.tuteType === 'object' ? r.tuteType?.name : r.tuteType) || r.tuteTypeName || r.tute_type_name || r.resourceTypeName || '';
            if (name) return name.toLowerCase().includes('paper') || name.toLowerCase().includes('question');
            return r.title.toLowerCase().includes('paper');
        });
    }, [allFreeResources]);

    const renderCard = (resource: FreeResource, index: number, defaultType: string) => {
        const typeName = (typeof resource.tuteType === 'object' ? resource.tuteType?.name : resource.tuteType) || resource.tuteTypeName || resource.tute_type_name || resource.resourceTypeName || defaultType;
        const link = resource.downloadLink || resource.download_url || resource.link || '#';

        return (
            <div key={resource.id} className="col-md-6 col-lg-4 mb-4" data-aos="fade-up" data-aos-duration="800" data-aos-delay={index * 100}>
                <div className="resource-card border rounded p-4 h-100 shadow-sm bg-white flex flex-col justify-between">
                    {resource.cover_image_url && <img src={resource.cover_image_url} alt={`${resource.title} cover`} className="w-100 rounded mb-3" style={{ height: 180, objectFit: 'cover' }} />}
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <i className={`${resource.icon || 'fa-solid fa-file-lines'} fa-2x text-primary`}></i>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                    {typeName}
                                </Badge>
                                <AccessBadge accessType="FREE" />
                            </div>
                        </div>
                        <h5>{resource.title}</h5>
                        {resource.description && <p className="text-muted text-sm">{resource.description}</p>}
                    </div>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary mt-3 w-100 font-semibold">
                        Download Free {typeName}
                    </a>
                </div>
            </div>
        );
    };

    return (
        <section id="resources" className="section-padding bg-light-custom">
            <div className="container">
                <div className="text-center mb-5" data-aos="fade-up">
                    <h2 className="section-title text-center">Free Learning Resources</h2>
                    <p className="lead text-center mb-4">
                        Access free tutes, question papers, and study materials to support your ICT education journey.
                    </p>
                </div>

                {/* FREE TUTES SECTION */}
                <div className="mb-5" data-aos="fade-up">
                    <h3 className="h4 font-bold text-slate-800 mb-3 border-bottom pb-2">
                        <i className="fa-solid fa-book-open text-primary me-2"></i>
                        Free Tutes ({freeTutes.length})
                    </h3>
                    <div className="row">
                        {freeTutes.length === 0 ? (
                            <div className="col-12 text-center py-4 text-muted">
                                <p>No free tutes available at the moment.</p>
                            </div>
                        ) : (
                            freeTutes.map((res, i) => renderCard(res, i, 'Tute'))
                        )}
                    </div>
                </div>

                {/* FREE QUESTION PAPERS SECTION */}
                <div data-aos="fade-up">
                    <h3 className="h4 font-bold text-slate-800 mb-3 border-bottom pb-2">
                        <i className="fa-solid fa-file-pen text-primary me-2"></i>
                        Free Question Papers ({freeQuestionPapers.length})
                    </h3>
                    <div className="row">
                        {freeQuestionPapers.length === 0 ? (
                            <div className="col-12 text-center py-4 text-muted">
                                <p>No free question papers available at the moment.</p>
                            </div>
                        ) : (
                            freeQuestionPapers.map((res, i) => renderCard(res, i, 'Question Paper'))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Resources;
