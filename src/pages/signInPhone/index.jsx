import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ButtonCus from '../../components/common/Button';

export default function SignInPhone() {

    const navigate = useNavigate()
    const [phone, setPhone] = useState('')
    const [error, setError] = useState('')
    
    const handleSendPhone = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/access-code`,
                { phoneNumber: phone }
            )
            console.log('Response:', response.data)
            localStorage.setItem('phoneNumber', phone)
            setPhone('');
            toast.success(response.data.message || "Xác thực thành công")
            navigate('/phoneVerification');


        } catch (error) {
            console.error('Failed to send phone:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Lỗi xác thực");

        }
    }

    const handleChange = (e) => {
        const input = e.target.value;
        if (/^\d*$/.test(input)) {
            setPhone(input)
            setError('')
        } else {
            setError('Chỉ được nhập số');
        }
    }

    return (
        <div className='conatiner'>
            <form className="container-sign-in" onSubmit={(e) => {
                e.preventDefault();
                if (!phone) {
                    setError("Vui lòng nhập số điện thoại")
                    return
                }
                if (error) return
                handleSendPhone()
            }}>
                <div className="back-button">
                    <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
                    <p>Back</p>
                </div>
                <h1 className='container-sign-in-title'>Sign In</h1>
                <p className='container-sign-in-text-first'>Please enter your phone to sign in</p>
                <input type='text' placeholder='Your Phone Number' className='container-sign-in-input'
                    value={phone}
                    onChange={handleChange}
                />
                {error && <p style={{ color: 'red', marginTop: '4px' }}>{error}</p>}
                <ButtonCus type="submit" text="Next" className="container-sign-in-button" />
                <p className='container-sign-in-text-two'>passwordless authentication methods.</p>
                <div className="container-sign-div">
                    <p>Don't have an account?</p>
                    <p className='container-sign-in-signup'>Sign Up</p>
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
        </div>
    )
}
