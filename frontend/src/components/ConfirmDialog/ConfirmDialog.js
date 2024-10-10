import React from 'react';
import './ConfirmDialog.css';

const ConfirmationDialog = ({ isOpen, onConfirm, onCancel, message }) => {
    if (!isOpen) return null;

    return (
        <div className="confirmation-dialog">
            <div className="dialog-content">
                <p>{message}</p>
                <div className="dialog-actions">
                    <button className="confirm-button" onClick={onConfirm}>Oui</button>
                    <button className="cancel-button" onClick={onCancel}>Non</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;