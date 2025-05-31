export default function ButtonCus({ onClick, text, className, type = "button" }) {
    return (
        <button type={type} onClick={onClick} className={className}>
            {text}
        </button>
    )
}
