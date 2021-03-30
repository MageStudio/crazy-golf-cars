const Modal = ({
    visible,
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
                <div className='modal-head'>
                    <span className='modal-title'>{ title }</span>
                    <span className='modal-close-btn' onClick={onClose}>x</span>
                </div>
                <div className='modal-body'>
                    { children }
                </div>
                <div className='modal-footer'>
                    { onCancel && <button>Cancel</button> }
                    { onConfirm && <button>Confirm</button> }
                </div>
            </div>
        </div>
    );
}

export default Modal;