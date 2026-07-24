import React from 'react';

interface PanelHeaderProps {
  title: string;
  statusColor?: string;
  statusLabel?: string;
  rightContent?: React.ReactNode;
}

export function PanelHeader({ 
  title, 
  statusColor = 'rgba(0,240,255,0.7)', 
  statusLabel, 
  rightContent 
}: PanelHeaderProps) {
  return (
    <div className="h-[28px] bg-[rgba(0,0,0,0.4)] border-b border-[#262c33] flex flex-row items-center px-2 gap-2 flex-shrink-0">
      
      <div 
        className="w-[2px] h-[12px]" 
        style={{ backgroundColor: statusColor }}
      />
      
      <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 m-0">
        {title}
      </h2>
      
      <div className="ml-auto flex items-center gap-2">
        {statusLabel && (
          <span 
            className="font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 border"
            style={{ color: statusColor, borderColor: statusColor }}
          >
            {statusLabel}
          </span>
        )}
        {rightContent}
      </div>

    </div>
  );
}
