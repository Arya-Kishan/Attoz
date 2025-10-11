import { ArrowRight, Heart, MessageCircle, Upload, Video, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/images/attozLogo.png";
import { setShowAuthGuard } from '../store/slices/userSlice';
import { useAppDispatch } from '../store/storeHooks';

export default function SignUpModal() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleClose = () => {
        dispatch(setShowAuthGuard(false));
    }

    const features = [
        {
            icon: <Video className="w-5 h-5" />,
            title: "Watch & Discover",
            description: "Explore endless videos"
        },
        {
            icon: <Heart className="w-5 h-5" />,
            title: "Like & Cheer",
            description: "Curate your favorites"
        },
        {
            icon: <MessageCircle className="w-5 h-5" />,
            title: "Comment & Discuss",
            description: "Join the conversation"
        },
        {
            icon: <Upload className="w-5 h-5" />,
            title: "Upload & Share",
            description: "Share your creativity"
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 relative overflow-hidden">
                {/* Subtle background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-white"></div>

                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Content */}
                <div className="relative p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
                            <img src={logo} alt="" srcSet="" />
                        </div>
                        <h2 className="text-3xl font-bold text-purple-500 mb-2">
                            Login to Continue
                        </h2>
                        <p className="text-gray-600">
                            Unlock all features and start your journey
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 hover:scale-105"
                            >
                                <div className="text-blue-600 mb-2">
                                    {feature.icon}
                                </div>
                                <h3 className="text-gray-800 font-semibold text-sm mb-1">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-xs">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                navigate("/signup");
                                handleClose();
                            }}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 flex items-center justify-center group">
                            Create Account
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={() => {
                                navigate("/login");
                                handleClose();
                            }}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/30">
                            Sign In
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-gray-400 text-xs mt-6">
                        By signing up, you agree to our{' '}
                        <span className="text-purple-400 hover:text-purple-300 cursor-pointer">
                            Terms & Privacy Policy
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}