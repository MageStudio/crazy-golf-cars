import { CloseIcon } from '../icons';

const Modal = ({
    visible,
    dismissable = true,
    type = 'info',
    title = '',
    onClose,
    onConfirm,
    onCancel,
    children
}) => {
    if (!visible) return null;

    const preventModalClick = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div
            className='modal-backdrop'
            onClick={onClose}>
            <div
                onClick={preventModalClick}
                className='modal'>
                <div className={`modal-head ${type}`}>
                    <span className='modal-title'>{ title }</span>
                    { dismissable &&
                        <span className='modal-close-btn' onClick={onClose}>
                            <CloseIcon/>
                        </span>
                    }
                </div>
                <div className='modal-body'>
                    { children }
                </div>
                <div className='modal-footer'>
                    { onCancel && <button className='button secondary small' onClick={onCancel}>Cancel</button> }
                    { onConfirm && <button className='button primary small' onClick={onConfirm}>Confirm</button> }
                </div>
            </div>
        </div>
    );
}

export default Modal;