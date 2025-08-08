import React, { useState, useEffect } from 'react';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetch('/projects.txt')
      .then(response => response.text())
      .then(text => {
        const contentMatch = text.match(/\[Content\]\n(.*)/s);

        if (contentMatch) {
          const entries = contentMatch[1].split(/\n\n(?=Name:)/);
          const parsedEntries = entries.map(entry => {
            const lines = entry.split('\n').filter(line => line.trim() !== '');
            const projectData = lines.reduce((acc, line) => {
              const [key, ...valueParts] = line.split(': ');
              if (key && valueParts.length > 0) {
                const value = valueParts.join(': ').trim();
                acc[key.trim().toLowerCase().replace(' ', '_')] = value;
              }
              return acc;
            }, {});
            
            // Parse CTA if available
            if (projectData.cta) {
              const ctaMatch = projectData.cta.match(/^(.*?): (.*)/);
              if (ctaMatch) {
                projectData.ctaLabel = ctaMatch[1].trim();
                projectData.ctaUrl = ctaMatch[2].trim();
              }
            }
            
            return projectData;
          });
          setProjects(parsedEntries);
        }
      });
  }, []);

  const openModal = (project) => {
    const imagePath = project.image || '/default-project.jpg';
    const isVideo = imagePath.includes('.mp4') || imagePath.includes('.webm') || imagePath.includes('.mov');
    
    setModalContent({
      src: imagePath,
      alt: project.name,
      isVideo: isVideo,
      title: project.name,
      description: project.description
    });
    setIsModalOpen(true);
    setIsFullscreen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      const modalElement = document.querySelector('.modal-content');
      if (modalElement.requestFullscreen) {
        modalElement.requestFullscreen();
      } else if (modalElement.webkitRequestFullscreen) {
        modalElement.webkitRequestFullscreen();
      } else if (modalElement.msRequestFullscreen) {
        modalElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('msfullscreenchange', handleFullscreenChange);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, [isModalOpen]);

  const getFileType = (filePath) => {
    if (!filePath) return 'image';
    const extension = filePath.split('.').pop().toLowerCase();
    
    if (['mp4', 'webm', 'mov', 'avi'].includes(extension)) {
      return 'video';
    } else if (['pdf'].includes(extension)) {
      return 'pdf';
    } else if (['gif'].includes(extension)) {
      return 'gif';
    }
    return 'image';
  };

  const renderMediaPreview = (project, index) => {
    const imagePath = project.image || '/default-project.jpg';
    const fileType = getFileType(imagePath);

    switch (fileType) {
      case 'video':
        return (
          <div className="project-media clickable" onClick={() => openModal(project)}>
            <video 
              src={imagePath} 
              poster={imagePath.replace(/\.(mp4|webm|mov|avi)$/, '.jpg')}
              muted
              loop
              playsInline
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <img 
              src="/default-project.jpg" 
              alt={`${project.name} fallback`}
              style={{ display: 'none' }}
            />
            <div className="media-overlay">
              <span className="play-icon">▶</span>
              <span className="media-type">VIDEO</span>
            </div>
          </div>
        );
      case 'pdf':
        return (
          <div className="project-media clickable" onClick={() => openModal(project)}>
            <div className="pdf-preview">
              <div className="pdf-icon">📄</div>
              <span className="media-type">PDF</span>
            </div>
            <div className="media-overlay">
              <span className="view-icon">👁</span>
              <span className="media-type">VIEW PDF</span>
            </div>
          </div>
        );
      case 'gif':
      case 'image':
      default:
        return (
          <div className="project-media clickable" onClick={() => openModal(project)}>
            <img 
              src={imagePath} 
              alt={project.name} 
              onError={(e) => {
                e.target.src = '/default-project.jpg';
              }} 
            />
            <div className="media-overlay">
              <span className="zoom-icon">🔍</span>
              <span className="media-type">{fileType.toUpperCase()}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="projects-container">
      <h2>Projects</h2>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div className="project-card" key={index}>
            <h3 className="project-name">{project.name}</h3>
            <p className="project-description">{project.description}</p>
            
            {renderMediaPreview(project, index)}
            
            <div className="project-tech-stack">
              {(project.tags || project.tech_stack)?.split(', ').map((tech, i) => (
                <span className="tech-item" key={i}>{tech}</span>
              ))}
            </div>
            
            {project.ctaLabel && project.ctaUrl && (
              <div className="project-cta">
                <a href={project.ctaUrl} className="project-cta-button" target="_blank" rel="noopener noreferrer">
                  {project.ctaLabel}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && modalContent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{modalContent.title}</h3>
              <div className="modal-controls">
                <button 
                  className="modal-control-btn fullscreen-btn" 
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                  {isFullscreen ? "⤡" : "⤢"}
                </button>
                <button 
                  className="modal-control-btn close-btn" 
                  onClick={closeModal}
                  title="Close"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="modal-body">
              {modalContent.src.includes('.pdf') ? (
                <div className="pdf-viewer">
                  <embed 
                    src={modalContent.src} 
                    type="application/pdf"
                    width="100%" 
                    height="600px"
                  />
                  <div className="pdf-fallback">
                    <p>PDF cannot be displayed in browser.</p>
                    <a href={modalContent.src} target="_blank" rel="noopener noreferrer" className="download-link">
                      Download PDF
                    </a>
                  </div>
                </div>
              ) : modalContent.isVideo ? (
                <video 
                  src={modalContent.src}
                  controls 
                  autoPlay
                  loop
                  className="modal-video"
                  onLoadedMetadata={(e) => {
                    const video = e.target;
                    const aspectRatio = video.videoWidth / video.videoHeight;
                    const orientation = aspectRatio > 1 ? 'landscape' : 'portrait';
                    video.setAttribute('data-orientation', orientation);
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : (
                <img 
                  src={modalContent.src} 
                  alt={modalContent.alt}
                  className="modal-image"
                  onError={(e) => {
                    e.target.src = '/default-project.jpg';
                  }}
                />
              )}
              
              {modalContent.isVideo && (
                <div className="video-error-fallback" style={{ display: 'none' }}>
                  <p>Video could not be loaded</p>
                  <img src="/default-project.jpg" alt="Fallback" />
                </div>
              )}
            </div>
            
            {modalContent.description && (
              <div className="modal-footer">
                <p className="modal-description">{modalContent.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;