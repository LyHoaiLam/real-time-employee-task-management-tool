import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ButtonCus from '../../components/common/Button';
import { ToastContainer, toast } from 'react-toastify';

export default function PhoneVerification() {

    const [code, setCode] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async () => {
        const phoneNumber = localStorage.getItem('phoneNumber');
        if (!phoneNumber) {
            setError("Không tìm thấy số điện thoại. Vui lòng quay lại bước trước.");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/access-code/verify`,
                { phoneNumber, code }
            );
            console.log('Xác thực thành công:', response.data);

            toast.success(response.data.message || "Xác thực thành công");

            setError('');
            setCode('');
        } catch (err) {
            console.error('Lỗi xác thực:', err.response?.data || err.message);
            setError('Mã không đúng hoặc đã hết hạn');

            toast.error(err.response?.data?.message || "Lỗi xác thực");
        }
    };


    return (
        <form className="container-phoneVerification">
            <div className="back-button">
                <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
                <p>Back</p>
            </div>

            <h1 className='container-phoneVerification-in-title'>Phone verification</h1>
            <p className='container-phoneVerification-in-text'>Please enter your code that was sent to your phone</p>

            <input placeholder='Enter your code' className='container-phoneVerification-in-input'
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            {error && <p style={{ color: 'red', marginTop: 4 }}>{error}</p>}

            <ButtonCus text={"Submit"} className={"container-sign-in-button"}
                onClick={handleSubmit}
            />

            <div className="container-phoneVerification-div">
                <p>Code not received?</p>
                <p className='container-phoneVerification-in-signup'>Send again</p>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </form>
    )
}
