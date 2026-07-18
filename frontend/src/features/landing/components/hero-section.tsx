import { BookingForm } from './booking-form';

export const HeroSection = () => {
    return (
        <section className="bg-gradient-to-br from-[var(--primary)] to-[#0a5d7a] text-white py-24 px-8 min-h-[600px] relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,%3Csvg_width=%2260%22_height=%2260%22_viewBox=%220_0_60_60%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg_fill=%22none%22_fill-rule=%22evenodd%22%3E%3Cg_fill=%22%23ffffff%22_fill-opacity=%220.05%22%3E%3Cpath_d=%22M36_34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6_34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6_4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] before:opacity-50">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative z-10">
                <div>
                    <h1 className="font-poppins text-4xl md:text-5xl font-bold leading-tight mb-6 animate-[fadeInUp_0.8s_ease-out]">
                        Prenez soin de votre sourire
                    </h1>
                    <p className="text-xl opacity-90 mb-8 animate-[fadeInUp_0.8s_ease-out_0.2s_backwards]">
                        Réservez votre rendez-vous en quelques clics. Notre équipe de professionnels est là pour vous offrir les meilleurs soins dentaires.
                    </p>

                    <div className="flex gap-12 mt-12 justify-center lg:justify-start animate-[fadeInUp_0.8s_ease-out_0.4s_backwards]">
                        <div className="text-center">
                            <span className="font-poppins text-4xl font-bold block">15+</span>
                            <span className="text-sm opacity-80">Années d'expérience</span>
                        </div>
                        <div className="text-center">
                            <span className="font-poppins text-4xl font-bold block">5000+</span>
                            <span className="text-sm opacity-80">Patients satisfaits</span>
                        </div>
                        <div className="text-center">
                            <span className="font-poppins text-4xl font-bold block">98%</span>
                            <span className="text-sm opacity-80">Taux de satisfaction</span>
                        </div>
                    </div>
                </div>

                <BookingForm />
            </div>
        </section>
    );
};