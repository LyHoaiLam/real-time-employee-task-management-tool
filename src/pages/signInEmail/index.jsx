import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ButtonCus from '../../components/common/Button';

export default function SignInEmail() {
    return (
        <div className="container-sign-in">
            <div className="back-button">
                <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
                <p>Back</p>
            </div>
            <h1 className='container-sign-in-title'>Sign In</h1>
            <p className='container-sign-in-text-first'>Please enter your email to sign in</p>
            <input className='container-sign-in-input' placeholder='Your Email Address'></input>
            <ButtonCus text={"Next"} className={"container-sign-in-button"} />
            <p className='container-sign-in-text-two'>passwordless authentication methods.</p>
            <div className="container-sign-div">
                <p>Don't having account?</p>
                <p className='container-sign-in-signup'>Sign Up</p>
            </div>
        </div>
    )
}