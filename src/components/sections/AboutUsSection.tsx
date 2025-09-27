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
      <div className="grid items-center py-20 gap-12 lg:grid-cols-[1.15fr_minmax(0,1fr)]">
        <FadeInSection className="space-y-8 max-w-7xl" direction="up">
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700 shadow-sm">
            Our Story
          </span>

          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-slate-900 md:text-5xl">
              About Our{' '}
              <span className="bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">
                Community
              </span>
            </h2>
            <p className="text-base text-slate-600 md:text-lg">
              We are a vibrant community dedicated to celebrating culture, supporting each other, and creating lasting memories together. From sports events to social gatherings, we believe in the power of unity and shared experiences.
            </p>
            <p className="text-base text-slate-600 md:text-lg">
              Our platform serves as a digital home where we share achievements, upcoming events, and precious moments that define who we are as a community.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <FadeInSection
                  key={pillar.title}
                  delay={index * 120}
                  className="flex h-full flex-col rounded-3xl bg-white p-5 text-left shadow-[0_18px_45px_-30px_rgba(15,118,110,0.5)]"
                  direction="up"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{pillar.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{pillar.description}</p>
                </FadeInSection>
              );
            })}
          </div>

          {/* <FadeInSection delay={360} direction="up">
            <a
              href="/about"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
            >
              Learn More About Us
              <ArrowRight className="h-4 w-4" />
            </a>
          </FadeInSection> */}
        </FadeInSection>

        <FadeInSection className="relative w-full" direction="up">
          <div className="relative w-full">
            <div className="absolute -top-6 right-6 rounded-2xl bg-white px-4 py-3 text-center text-slate-700 shadow-[0_15px_40px_-20px_rgba(15,118,110,0.35)]">
              <p className="text-2xl font-semibold text-emerald-600">10+</p>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Years</p>
            </div>

            <img
              src={communityPhoto}
              alt="GAFC Rotterdam community members"
              className="h-[60dvh] w-full rounded-[32px] border border-white/60 object-cover shadow-[0_40px_90px_-45px_rgba(15,118,110,0.6)]"
            />

            <div className="absolute -bottom-6 left-6 rounded-2xl bg-white px-5 py-4 shadow-[0_18px_45px_-30px_rgba(15,118,110,0.5)]">
              <p className="text-2xl font-semibold text-blue-600">500+</p>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Members</p>
            </div>

            <div className="absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-[38px] bg-gradient-to-br from-emerald-100 via-white to-sky-100" />
          </div>
        </FadeInSection>
      </div>
    </Section>
  );
};

export default AboutUsSection;