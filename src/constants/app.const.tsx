import { Images } from '@/assets/images';
import { SocialMediaLink } from '@/types/common.type';

export const socialMediaLinks: SocialMediaLink[] = [
    { platform: 'Facebook', icon: <Images.FaFacebook className="w-[16px] h-[16px]" title="Facebook" />, link: '/' },
    { platform: 'X', icon: <Images.FaXTwitter className="w-[16px] h-[16px]" title="X" />, link: '/' },
    { platform: 'Google', icon: <Images.FaGoogle className="w-[16px] h-[16px]" title="Google" />, link: '/' },
];
