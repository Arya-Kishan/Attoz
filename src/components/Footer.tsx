import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6'; // Using the specific icon for X/Twitter

const Footer = () => {
    return (
        <footer className="bg-black text-white px-4 py-8 md:px-12 lg:px-20 font-sans">
            <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-gray-700 pb-8 space-y-8 lg:space-y-0">
                {/* Left Section: Logo and Navigation */}
                <div className="flex flex-col md:flex-row lg:items-center space-y-6 md:space-y-0 md:space-x-10 lg:space-x-16 w-full">
                    {/* Logo Area */}
                    <div className="text-3xl font-bold tracking-tight">
                        <span className="italic">Attoz</span>
                        {/* <div className="text-sm font-light text-gray-400 mt-[-5px]">BY ZOMATO</div> */}
                        {/* <img src={logoTitle} alt="" srcSet="" /> */}
                    </div>

                    {/* Navigation Links */}
                    <nav className="w-full flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-8 lg:space-x-10 text-sm font-medium">
                        <a href="#" className="hover:text-gray-400 transition-colors">Terms & Conditions</a>
                        <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-400 transition-colors">Contact Us</a>
                    </nav>
                </div>

                {/* Right Section: QR Code */}
                <div className="flex flex-col items-start lg:items-end space-y-2 h-[100px] w-[10px]">
                </div>
            </div>

            {/* Bottom Section: Copyright and Social Icons */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-6 space-y-4 md:space-y-0">
                {/* Copyright Text */}
                <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
                    By accessing this page, you confirm that you have read, understood, and agreed to our Terms of Service, Cookie Policy, Privacy Policy, and Content Guidelines. All rights reserved.
                </p>

                {/* Social Media Icons */}
                <div className="flex space-x-4 text-xl">
                    <a href="#" aria-label="WhatsApp" className="hover:text-gray-400 transition-colors">
                        <FaWhatsapp />
                    </a>
                    <a href="#" aria-label="Facebook" className="hover:text-gray-400 transition-colors">
                        <FaFacebookF />
                    </a>
                    <a href="#" aria-label="Instagram" className="hover:text-gray-400 transition-colors">
                        <FaInstagram />
                    </a>
                    <a href="#" aria-label="X (Twitter)" className="hover:text-gray-400 transition-colors">
                        <FaXTwitter />
                    </a>
                    <a href="#" aria-label="Youtube" className="hover:text-gray-400 transition-colors">
                        <FaYoutube />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;