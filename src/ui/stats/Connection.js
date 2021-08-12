import { NETWORK_EVENTS } from "../../network/client";
import { ErrorIcon, QuestionMarkIcon, SuccessIcon } from "../icons";

const parseStatus = (status) => {
    switch (status) {
        case NETWORK_EVENTS.CONNECTED:
            return {
                className: 'success',
                message: 'online',
                Icon: () => <SuccessIcon />
            };
        case NETWORK_EVENTS.DISCONNECTED:
            return {
                className: 'error',
                message: 'offline',
                Icon: () => <ErrorIcon/> 
            }
        default:
            return {
                className: 'info',
                message: 'connecting..',
                Icon: () => <QuestionMarkIcon />
            };
    }
}

const Connection = ({ status, online, error }) => {
    const { className, Icon, message } = parseStatus(status);

    return (
        <span class={`connection status large ${className}`}>
            <Icon />
            <label>{ message }</label>
        </span>
    )
};

export default Connection;