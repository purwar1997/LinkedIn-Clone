import { Space, Spin } from 'antd';
import LinkedInLogo from '../assets/LinkedInLogo.png';
import '../styles/Loader.css';

export default function Loader() {
  return (
    <div className='loader'>
      <img src={LinkedInLogo} alt='linkedin-logo' />

      <Space>
        <Spin size='large' />
      </Space>
    </div>
  );
}
