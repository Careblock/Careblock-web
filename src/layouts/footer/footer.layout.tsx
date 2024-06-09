import { socialMediaLinks } from '@/constants/app.const';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="bg-primary text-white px-[24px] flex items-center justify-between h-[52px]">
            <div className="flex items-center space-x-6">
                {socialMediaLinks.map((socialMedia, index) => (
                    <Link key={index} to={socialMedia.link} className="text-white">
                        {socialMedia.icon}
                    </Link>
                ))}
            </div>
            <h2>Copyright ©2024 - Designed by Careblock</h2>
        </div>
    );
};

export default Footer;
