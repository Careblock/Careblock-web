import { socialMediaLinks } from '@/constants/app.const';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="bg-primary text-white px-[24px] flex items-center justify-between h-[44px]">
            <h2 className="text-[13px]">Copyright © Careblock 2024</h2>
            <div className="flex items-center space-x-6">
                {socialMediaLinks.map((socialMedia, index) => (
                    <Link key={index} to={socialMedia.link} className="text-white">
                        {socialMedia.icon}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Footer;
