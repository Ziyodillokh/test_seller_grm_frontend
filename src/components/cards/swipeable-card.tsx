import { Trash2 } from 'lucide-react';
import React, { useEffect,useRef, useState } from 'react';

interface SwipeableCardProps {
    children: React.ReactNode;
  onDelete: () => void;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  onDelete,
  children
}) => {
  const [offset, setOffset] = useState<number>(0);
  const [startX, setStartX] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const deleteThreshold = -80;
  
  const handleMouseDown = (e: React.MouseEvent): void => {
    setStartX(e.clientX);
  };
  
  const handleTouchStart = (e: React.TouchEvent): void => {
    setStartX(e.touches[0].clientX);
  };
  
  const handleMouseMove = (e: MouseEvent): void => {
    if (startX === null) return;
    const diff = e.clientX - startX;
    handleSwipe(diff);
  };
  
  const handleTouchMove = (e: React.TouchEvent): void => {
    if (startX === null) return;
    const diff = e.touches[0].clientX - startX;
    handleSwipe(diff);
  };
  
  const handleSwipe = (diff: number): void => {
    if (diff <= 0) {
      setOffset(Math.max(diff, deleteThreshold));
    } else if (offset < 0) {
      setOffset(Math.min(0, offset + diff / 3));
      setStartX(prev => prev !== null ? prev + diff / 3 : null);
    }
  };
  
  // Handle end of interaction
  const handleEnd = (): void => {
    if (startX === null) return;
    
    if (offset < deleteThreshold / 2) {
      setOffset(deleteThreshold);
    } else {
      setOffset(0);
    }
    
    setStartX(null);
  };
  
  const handleDelete = (): void => {
    onDelete();
    setIsDeleting(true);
    
    setTimeout(() => {
      setIsDeleting(false);
      setOffset(0);
    }, 300);
  };
  
  // Add and remove event listeners
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    const mouseMoveHandler = (e: MouseEvent) => handleMouseMove(e);
    const mouseUpHandler = () => handleEnd();
    
    // Mouse events
    card.addEventListener('mousedown', handleMouseDown as unknown as EventListener);
    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mouseup', mouseUpHandler);
    
    // Cleanup
    return () => {
      card.removeEventListener('mousedown', handleMouseDown as unknown as EventListener);
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
    };
  }, [startX, offset]);
  
  return (
    <div className="relative w-full touch-none">
      <div className="absolute inset-0 flex items-center justify-end bg-red-500 text-white">
        <div className="px-6">
          <Trash2 size={24} />
        </div>
      </div>
      
      <div 
        ref={cardRef}
        className={`relative w-full bg-white transition-all duration-150 ${
          isDeleting ? 'opacity-0 translate-x-full' : ''
        }`}
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
      >
        {children}
       
      </div>
      
      {offset <= deleteThreshold / 1.5 && (
        <button
          onClick={handleDelete}
          className="absolute top-0 right-0 h-full px-4 bg-red-500 text-white flex items-center"
          aria-label="Delete"
        >
          <Trash2 size={24} />
        </button>
      )}
    </div>
  );
};

export default SwipeableCard;