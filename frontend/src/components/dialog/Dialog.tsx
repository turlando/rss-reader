import React from 'react';
import './Dialog.css';


const Dialog: React.FC = ({ children }) => {
    return (
        <div className="Dialog">
            { children }
        </div>
    );
}


export default Dialog;
