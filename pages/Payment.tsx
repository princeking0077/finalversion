
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { api, User } from '../utils/api';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Copy, MessageCircle, ScanLine } from 'lucide-react';
import { COURSES } from '../constants';
import { Logo } from '../components/Logo';

export const Payment = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const regId = searchParams.get('regId');
    const courseId = searchParams.get('courseId');

    const UPI_ID = "9975900664@ptyes";
    const WHATAPP_NUMBER = "919975900664";

    useEffect(() => {
        const init = async () => {
            // If user is logged in (from local storage after reg), use that.
            // Or fetch by ID if we had a dedicated endpoint, but valid session is better.
            let currentUser = api.getCurrentUser();

            // If accessed directly without login, redirect to login
            if (!currentUser) {
                navigate('/login');
                return;
            }

            // If query params exist, use them to verify context, but rely on user object
            if (!currentUser.registrationId && regId) {
                // edge case: user obj in storage might be stale
                const users = await api.getUsers();
                const freshUser = users.find(u => u.id === currentUser?.id);
                if (freshUser) {
                    currentUser = freshUser;
                    localStorage.setItem('epa_user', JSON.stringify(freshUser));
                }
            }

            setUser(currentUser);

            // Find Course
            const allCourses = await api.getCourses();
            const selectedCourse = allCourses.find(c => c.id === (courseId || currentUser?.enrolledCourses[0])); // Fallback to first enrolled or query
            setCourse(selectedCourse || COURSES[0]); // Fallback to dummy if empty

            setLoading(false);
        };
        init();
    }, [navigate, regId, courseId]);

    const handleWhatsAppClick = async () => {
        if (!user || !course) return;

        // Save pending course intent to backend
        try {
            await api.updateUser(user.id, {
                pendingCourseId: course.id,
                screenshotSubmitted: true,
                screenshotSubmittedAt: new Date().toISOString()
            });
        } catch (e) {
            console.error("Failed to update user payment intent", e);
        }

        const message = `Hello! I have completed payment for course registration.

Registration Details:
- Registration ID: ${user.registrationId || 'PENDING'}
- Name: ${user.name}
- Email: ${user.email}
- Phone: N/A 

Course: ${course.title}
Amount Paid: ₹${course.price}

Please find my payment screenshot attached. Kindly verify and activate my course access.

Thank you!`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${WHATAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    };

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

    if (!user) return null;

    // UPI String
    const upiString = `upi://pay?pa=${UPI_ID}&pn=EnlightenAcademy&am=${course?.price}&tn=${user.registrationId}&cu=INR`;

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in relative z-10">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-30 pattern-grid-lg"></div>
                    <Logo className="h-8 w-8 mx-auto mb-3 text-white" />
                    <h1 className="text-2xl font-bold text-white mb-1">Complete Your Payment</h1>
                    <p className="text-indigo-200 text-sm">Scan QR to pay and verify registration</p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Course Details */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Course</p>
                        <h3 className="font-bold text-slate-800 text-lg mb-1">{course?.title}</h3>
                        <div className="flex justify-between items-center mt-2 border-t border-slate-200 pt-2">
                            <span className="text-slate-500 text-sm">Amount to Pay</span>
                            <span className="text-xl font-bold text-indigo-600">₹{course?.price}</span>
                        </div>
                    </div>

                    {/* Registration Info */}
                    <div className="flex justify-between text-sm">
                        <div className="text-slate-500">Reg ID:</div>
                        <div className="font-mono font-bold text-slate-700">{user.registrationId || 'Generating...'}</div>
                    </div>

                    {/* QR Code Section */}
                    <div className="flex flex-col items-center justify-center space-y-4 py-4">
                        <div className="p-2 bg-white rounded-2xl shadow-lg border-2 border-indigo-100 relative group">
                            <img
                                src="/assets/payment-qr.jpg"
                                alt="Payment QR Code"
                                className="w-64 h-auto rounded-xl"
                            />
                            {/* Scan Indicator */}
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1 whitespace-nowrap">
                                <ScanLine className="w-3 h-3 text-teal-400" /> SCAN TO PAY
                            </div>
                        </div>
                        <div className="text-center pt-2">
                            <p className="text-sm font-medium text-slate-600 mb-2">Scan with any UPI App</p>
                            <div className="flex gap-2 justify-center opacity-70 grayscale hover:grayscale-0 transition-all">
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold text-slate-500">Paytm</span>
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold text-slate-500">PhonePe</span>
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold text-slate-500">GPay</span>
                            </div>
                        </div>
                    </div>

                    {/* UPI ID Copy */}
                    <div className="bg-slate-100 p-3 rounded-xl flex justify-between items-center border border-slate-200">
                        <div className="text-slate-500 text-xs font-mono">{UPI_ID}</div>
                        <button
                            onClick={() => { navigator.clipboard.writeText(UPI_ID); }}
                            className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition"
                            title="Copy UPI ID"
                        >
                            <Copy className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-3 pt-2">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Instructions</div>
                        <ul className="text-sm text-slate-600 space-y-2 pl-4 list-disc marker:text-indigo-500">
                            <li>Scan the QR code above.</li>
                            <li>Pay <strong>₹{course?.price}</strong>.</li>
                            <li>Take a <strong>screenshot</strong> of the success screen.</li>
                            <li>Click the button below to send screenshot.</li>
                        </ul>
                    </div>

                    {/* Verification Button */}
                    <button
                        onClick={handleWhatsAppClick}
                        className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-1 active:scale-95"
                    >
                        <MessageCircle className="h-5 w-5 fill-current" />
                        Send Screenshot on WhatsApp
                    </button>

                    <div className="text-center text-xs text-slate-400">
                        Registration will be verified within 24 hours.
                    </div>
                </div>
            </div>

            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[100px] rounded-full"></div>
            </div>
        </div>
    );
};
