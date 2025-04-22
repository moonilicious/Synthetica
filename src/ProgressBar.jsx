import React from "react";
import './ProgressBar.css';

const ProgressBar = ({ completed = 100 }) => {
    const background = 'linear-gradient(90deg, rgba(144,74,216,1) 23%, rgba(65,148,213,1) 92%)';
    
    // Round off completed value to 2 decimal places
    const roundedCompleted = Math.round(completed * 100) / 100;

    const containerStyles = {
        height: '30px',
        width: '100%',
        backgroundColor: "#00000",
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        margin: '20px 0',
    };

    const fillerStyles = {
        height: '100%',
        width: `${roundedCompleted}%`,
        background: background,
        transition: 'width 0.5s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'inherit',
    };

    const labelStyles = {
        padding: '5px 10px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '14px',
        letterSpacing: '0.5px',
        position: 'absolute',
        marginLeft: '150px'
    };

    return (
        <div className='progressbar' style={containerStyles}>
            <div style={fillerStyles}>
                <span style={labelStyles}>{`${roundedCompleted}%AI`}</span>
            </div>
        </div>
    );
};

export default ProgressBar;
