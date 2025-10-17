import React from 'react';
import { Users2, Heart, Star, ArrowRight } from 'lucide-react';
import { Section } from '../layout/Section';
import FadeInSection from '../ui/FadeInSection';
import communityPhoto from '../../Images/hero-sports-team.jpg';

const pillars = [
  {
    title: 'Strong Brotherhood',
    description: 'A tight-knit community of athletes, organisers, and supporters.',
    icon: Users2,
  },
  {
    title: 'Shared Passion',
    description: 'United by our love for football, culture, and healthy competition.',
    icon: Heart,
  },
  {
    title: 'Excellence',
    description: 'Chasing growth on and off the pitch with integrity and joy.',
    icon: Star,
  },
];

const AboutUsSection: React.FC = () => {
  return (
    <Section variant="light">
      {/* Container with responsive margins */}
      <div className="lg:-mx-[16%]">
        <div className="grid items-center py-24 gap-16 lg:grid-cols-[1.2fr_minmax(0,1fr)]">
          <FadeInSection className="space-y-10 " direction="up">
            {/* Enhanced Our Story Badge */}
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 px-6 py-2 text-sm font-semibold text-emerald-700 shadow-lg border border-emerald-200/50">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              Our Story
            </span>

            {/* Enhanced Heading Section */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-slate-900 md:text-6xl leading-tight">
                About Our{' '}
                <span className="bg-gradient-to-r from-blue-600 via-emerald-600 to-yellow-500 bg-clip-text text-transparent">
                  Community
                </span>
              </h2>
              <div className="space-y-5">
                <p className="text-lg text-slate-600 md:text-xl leading-relaxed">
                  We are a vibrant community dedicated to celebrating culture, supporting each other, and creating lasting memories together. From sports events to social gatherings, we believe in the power of unity and shared experiences.
                </p>
                <p className="text-lg text-slate-600 md:text-xl leading-relaxed">
                  Our platform serves as a digital home where we share achievements, upcoming events, and precious moments that define who we are as a community.
                </p>
              </div>
            </div>

            {/* Enhanced Value Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              {pillars.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <FadeInSection
                    key={pillar.title}
                    delay={index * 150}
                    className="group flex h-full flex-col rounded-2xl bg-white p-3 sm:px-3 sm:py-3 text-left shadow-[0_20px_50px_-30px_rgba(15,118,110,0.3)] hover:shadow-[0_25px_60px_-25px_rgba(15,118,110,0.4)] transition-all duration-300 hover:-translate-y-1 border border-slate-100/50"
                    direction="up"
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">{pillar.title}</h3>
                    <p className="text-xs text-slate-600 ">{pillar.description}</p>
                  </FadeInSection>
                );
              })}
            </div>

            {/* Enhanced CTA Button */}
            <FadeInSection delay={450} direction="up">
              <a
                href="/about"
                className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:from-blue-700 hover:to-emerald-700"
              >
                Learn More About Us
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </FadeInSection>
          </FadeInSection>

          {/* Enhanced Image Section */}
          <FadeInSection className="relative w-full" direction="up">
            <div className="relative w-full">
              {/* Enhanced Years Badge */}
              <div className="absolute -top-8 right-8 rounded-3xl bg-white px-6 py-4 text-center text-slate-700 shadow-[0_20px_50px_-25px_rgba(15,118,110,0.4)] border border-emerald-100/50">
                <p className="text-3xl font-bold text-emerald-600">10+</p>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Years</p>
              </div>

              {/* Enhanced Image */}
              <img
                src={communityPhoto}
                alt="GAFC Rotterdam community members"
                className="h-[65dvh] w-full rounded-[40px] border-2 border-white/80 object-cover shadow-[0_50px_100px_-50px_rgba(15,118,110,0.7)] hover:shadow-[0_60px_120px_-45px_rgba(15,118,110,0.8)] transition-all duration-500"
              />

              {/* Enhanced Members Badge */}
              <div className="absolute -bottom-8 left-8 rounded-3xl bg-white px-6 py-5 shadow-[0_25px_60px_-30px_rgba(15,118,110,0.6)] border border-blue-100/50">
                <p className="text-3xl font-bold text-blue-600">500+</p>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Members</p>
              </div>

              {/* Enhanced Background Decoration */}
              <div className="absolute inset-0 -z-10 translate-x-8 translate-y-8 rounded-[48px] bg-gradient-to-br from-emerald-100/80 via-white/60 to-sky-100/80 blur-sm" />
              <div className="absolute inset-0 -z-20 translate-x-4 translate-y-4 rounded-[44px] bg-gradient-to-br from-blue-100/40 via-emerald-100/40 to-yellow-100/40" />
            </div>
          </FadeInSection>
        </div>
      </div>
    </Section>
  );
};

export default AboutUsSection;