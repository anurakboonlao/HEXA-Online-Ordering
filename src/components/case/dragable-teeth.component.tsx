import React from 'react';

import SVG from 'react-inlinesvg';
import { TeethEnum } from '../../constants/caseManagement';

interface IDragableTeeth {
    seleceted : boolean;
    src: string;
    fillColor: string;
    teeth: TeethEnum;
    className: string;
    highlightColor?: string;
    draggable?: boolean;
    onSelectTeeth: (teeth: TeethEnum) => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, id: TeethEnum) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>, id: TeethEnum) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, id: TeethEnum) => void;
}

const DragableTeeth: React.FC<IDragableTeeth> = ({seleceted, src, fillColor, teeth, className, highlightColor, draggable = false, onSelectTeeth, onDragStart, onDragOver, onDrop}) => {

    return (
        <div draggable={draggable} onDragStart={e => onDragStart(e, teeth)} onDragOver={e => onDragOver(e, teeth)} onDrop={e => onDrop(e, teeth)}>
            <SVG src={src} style={seleceted ? { fill: highlightColor ? highlightColor : fillColor } : undefined} className={(seleceted ? "selected " : "") + `svg-click ${className}`} onClick={() => onSelectTeeth(teeth)}></SVG>
        </div>
    )
}

export default DragableTeeth;