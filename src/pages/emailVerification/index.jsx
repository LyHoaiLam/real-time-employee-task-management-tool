import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ButtonCus from '../../components/common/Button';

export default function EmailVerification() {
    return (
        <div className="container-sign-in">
            <div className="back-button">
                <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
                <p>Back</p>
            </div>
            <h1 className='container-sign-in-title'>Email verification</h1>
            <p className='container-sign-in-text-first'>Please enter your code that send to your email address</p>
            <input className='container-sign-in-input' placeholder='Your Email Address'></input>
            <ButtonCus text={"Submit"} className={"container-sign-in-button"} />
            <div className="container-sign-div">
                <p>Code not receive?</p>
                <p className='container-sign-in-signup'>Send again</p>
            </div>
        </div>
    )
}