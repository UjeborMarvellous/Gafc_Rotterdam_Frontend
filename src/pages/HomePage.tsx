import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Users, Image as GalleryIcon, ArrowRight, Play, Trophy, ShieldCheck, Sparkles, Phone,
} from 'lucide-react';
import EventCard from '../components/EventCard';
import OrganizerCard from '../components/OrganizerCard';
import GalleryImage from '../components/GalleryImage';
import { useEventsStore } from '../stores/eventsStore';
import { useOrganizersStore } from '../stores/organizersStore';
import { useGalleryStore } from '../stores/galleryStore';
import { useCommentsStore } from '../stores/commentsStore';
import GlassCard from '../components/ui/GlassCard';
import DonationCallout from '../components/sections/DonationCallout';
import CommentSection from '../components/CommentSection';
import { Section, SectionHeader, SectionContent } from '../components/layout/Section';
import { formatDate } from '../utils';
import AnimatedText from '../components/ui/AnimatedText';
import FadeInSection from '../components/ui/FadeInSection';
import AboutUsSection from '../components/sections/AboutUsSection';

const heroStats = [
  { label: 'Active members', value: '450+' },
  { label: 'Flagship events yearly', value: '12' },
  { label: 'Youth scholarships granted', value: '35' },
];

const legacyHighlights = [
  {
    title: 'Culture in motion',
    description: 'Showcasing Our community heritage through football, food, art, and storytelling experiences.',
    icon: Sparkles,
  },
  {
    title: 'Champions made here',
    description: 'Elite training that turns local talent into regional contenders on and off the pitch.',
    icon: Trophy,
  },
  {
    title: 'Safe spaces for all',
    description: 'Mentorship programmes and wellness resources designed for every generation.',
    icon: ShieldCheck,
  },
];

const impactMetrics = [
  {
    label: 'Community initiatives hosted',
    value: '28+',
  },
  {
    label: 'Volunteer hours logged last year',
    value: '3.2k',
  },
  {
    label: 'Mentorship pairs formed',
    value: '90+',
  },
];

const heroTexts = [
  "Our Brotherhood",
  "Our Legacy",
  "Our Passion",
  "Our Unity",
  "Our Strength",
  "Our Journey",
  "Our Victory",
  "Our Community",
]

const HomePage: React.FC = () => {
  const { events, fetchEvents, isLoading, error } = useEventsStore();
  const { organizers, fetchOrganizers, isLoading: orgLoading, error: orgError } = useOrganizersStore();
  const { images: galleryImages, fetchImages, isLoading: galleryLoading, error: galleryError } = useGalleryStore();
  const { comments, fetchComments, isLoading: commentsLoading, error: commentsError } = useCommentsStore();

  useEffect(() => {
    fetchEvents({ page: 1, limit: 6, active: true });
    fetchOrganizers({ active: true });
    fetchImages({ page: 1, limit: 9 });
    fetchComments({ approved: true, limit: 6 });
  }, [fetchEvents, fetchOrganizers, fetchImages, fetchComments]);

  const heroImageUrl = galleryImages && galleryImages.length > 0
    ? '../Images/CountryImages.png'
    : "";

  const heroImageUrls = galleryImages && galleryImages.length > 0
    ? galleryImages[0].imageUrl
    : 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2069&auto=format&fit=crop';

  const featuredEvents = events ? events.slice(0, 3) : [];
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Updated: full-bleed hero with brighter palette */}
      <Section
        padding="lg"
        variant="default"
        containerMode="full"
        className="h-screen "
        containerClassName="px-0"
      >
        <div className="relative -mt-[41px] w-full overflow-hidden h-screen">
          <img
            src={heroImageUrl}
            alt="Community background"
            className="absolute inset-0 h-screen w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/70 to-black/20" />
          <div className="relative mx-auto flex min-h-[85vh] mt-20 w-full max-w-[90%] flex-col gap-20 px-6 py-24 sm:px-10 lg:flex-row lg:items-center lg:px-10 xl:px-12">
            <div className="max-w-6xl space-y-8 text-grey-100 bg-white/60 shadow-2xl shadow-white/20 p-20 w-full rounded-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3px] text-slate-600">
                Welcome to Our Community Where
              </span>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                    <AnimatedText
                      texts={heroTexts}
                      className="bg-gradient-to-r from-black/70 via-green-700 to-gray-600 bg-clip-text text-transparent"
                    />
                  </h1>
                  <div className="text-3xl sm:text-5xl lg:text-6xl font-bold text-black/70">Defines Us</div>
                </div>
                <p className="max-w-xl text-base text-gray-800 md:text-lg">
                  Discover moments that ignite pride, purpose, and opportunity. From match days to mentorship, we celebrate the Rotterdam community with unforgettable experiences.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-green-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:bg-brand-green-700"
                >
                  <Calendar className="h-4 w-4" />
                  Explore Events
                </Link>
                <button type="button" onClick={() => setIsVideoOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-200 transition-transform duration-200 hover:-translate-y-1 hover:border-gray-400 hover:text-gray-100 hover:shadow-2xl hover:shadow-green-500"
                >
                  <Play className="h-4 w-4" />
                  Watch Highlights
                </button>
              </div>
              {/* <div className="grid gap-4 text-sm text-slate-700 md:grid-cols-3">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white px-4 pt-10 pb-4 shadow-sm hover:shadow-2xl hover:shadow-green-500">
                    <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                    <p className="mt-1 text-slate-600">{stat.label}</p>
                  </div>
                ))}
              </div> */}
            </div>

            <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Next on the calendar
              </p>
              <div className="mt-6 space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="h-20 rounded-2xl bg-slate-200/60 animate-pulse" />
                    ))}
                  </div>
                ) : featuredEvents.length > 0 ? (
                  <div className="space-y-4">
                    {featuredEvents.map((event) => (
                      <Link
                        key={event._id}
                        to={`/events/${event._id}`}
                        className="group block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-transform duration-200 hover:-translate-y-1 hover:border-brand-green-500/60"
                      >
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{formatDate(event.date)}</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900 group-hover:text-brand-green-600">{event.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{event.location}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600">{error ? error : 'No events scheduled yet. Check back soon.'}</p>
                )}
              </div>
              <Link
                to="/events"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-green-700 transition-colors hover:text-brand-green-800"
              >
                View all events
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Section>
      

      {/* Updated: curated storytelling spotlight with visual + narrative pairing */}
      <Section variant="light" padding="md" className="rounded-t-[3rem]">
        <div className="grid gap-8 w-full mx-auto lg:grid-cols-[minmax(0,_0.75fr)_minmax(0,_1.25fr)] lg:items-center">
          <GlassCard className="order-2 bg-white p-6 text-slate-900 shadow-soft lg:order-1">
            <SectionHeader
              eyebrow="Community Moments"
              title="Snapshots that tell our story"
              description="Every celebration, match, and cultural night documents the legacy we are building together."
              align="left"
              tone="light"
              className="text-left"
            />
            <div className="mt-8 grid gap-4 text-sm text-slate-600">
              {legacyHighlights.map(({ title, description, icon: Icon }, index) => (
                <FadeInSection
                  key={title}
                  delay={index * 120}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <Icon className="h-5 w-5 text-brand-green-600" />
                  <div>
                    <p className="text-base font-semibold text-slate-900">{title}</p>
                    <p className="mt-1 text-slate-600">{description}</p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </GlassCard>

          <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-[2.75rem] border border-slate-200 shadow-2xl lg:order-2">
            <img src={heroImageUrls} alt="Community highlight" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/20 via-transparent to-brand-green-500/30" />
          </div>
        </div>
      </Section>

      {/* Updated: quick impact metrics emphasising growth */}
      {/* <Section variant="subtle" padding="md" className="mb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {impactMetrics.map((stat, index) => (
            <FadeInSection
              key={stat.label}
              delay={index * 120}
              className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-800 shadow-sm"
            >
              <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
            </FadeInSection>
          ))}
        </div>
      </Section> */}

      {/* Updated: about us section with visual and narrative pairing */}
      <Section variant="light" className="w-full">
        <AboutUsSection />
      </Section>

      {/* Updated: refined events preview with modular layout */}
      <Section variant="light" className="mb-20">
        <SectionHeader
          className="text-center my-12"
          eyebrow="Upcoming Events"
          title="Match days, cultural nights, and learning spaces"
          description="Plan your calendar with experiences tailored for family, friends, and future leaders."
          tone="light"
        />
        <SectionContent className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-80 rounded-3xl border border-slate-200 bg-slate-50 animate-pulse" />
            ))
          ) : events && events.length > 0 ? (
            events.slice(0, 6).map((event) => (
              <EventCard key={event._id} event={event} />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
              {error ? error : 'No events to display yet.'}
            </div>
          )}
        </SectionContent>
        <div className="mt-12 mb-20 flex justify-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-green-500 hover:text-brand-green-600"
          >
            <span>View all events</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* Updated: dedicated donation band uses new modular component */}
      <Section variant="default" className="mb-20">
        <SectionHeader
          eyebrow="Community Fund"
          className="text-center mt-10"
          title="Build the future with us"
          description="Your support keeps programmes accessible, facilities thriving, and our next generation of leaders inspired."
        />
        <DonationCallout />
      </Section>

      {/* Updated: organisers grid with adaptive tiles */}
      <Section variant="light" className="mb-20">
        <SectionHeader
          eyebrow="Our Organisers"
          className="text-center mt-10"
          title="Meet the team driving every experience"
          description="Dedicated professionals and volunteers ensuring every initiative feels crafted with care."
          tone="light"
        />
        <SectionContent className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {orgLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-80 rounded-xl border border-slate-200 bg-slate-50 animate-pulse" />
            ))
          ) : organizers && organizers.length > 0 ? (
            organizers.slice(0, 6).map((organizer) => (
              <OrganizerCard key={organizer._id} organizer={organizer} />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
              {orgError ? orgError : 'No organisers to display yet.'}
            </div>
          )}
        </SectionContent>
        <div className="mt-12 mb-20 flex justify-center">
          <Link
            to="/organizers"
            className="inline-flex items-center gap-2 rounded-full bg-brand-green-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:bg-brand-green-600"
          >
            <span>Meet all organisers</span>
            <Users className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* Updated: gallery mosaic with elevated framing */}
      <Section variant="subtle">
        <SectionHeader
          eyebrow="Gallery"
          title="Moments we never stop talking about"
          description="Relive the energy of our favourite matches, festivals, and community launches."
        />
        <SectionContent className="my-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {galleryLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="aspect-square rounded-3xl border border-white/10 bg-white/10 animate-pulse" />
            ))
          ) : galleryImages && galleryImages.length > 0 ? (
            galleryImages.slice(0, 6).map((image) => (
              <GalleryImage key={image._id} image={image} />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70">
              {galleryError ? galleryError : 'No gallery images yet.'}
            </div>
          )}
        </SectionContent>
        <div className="my-20 flex justify-center">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 rounded-full border border-black/20 px-6 py-3 text-sm font-semibold text-black/70 transition-transform duration-200 hover:-translate-y-1 hover:border-white/40"
          >
            <span>View full gallery</span>
            <GalleryIcon className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* Community comment section */}
      <Section variant="light" padding="md">
        <SectionHeader
          eyebrow="Community Voices"
          title="What supporters are saying"
          description="Stories and reflections from neighbours who make GAFC Rotterdam feel like home."
          tone="light"
        />
        <div className="mt-12">
          {commentsError ? (
            <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
              {commentsError}
            </div>
          ) : (
            <CommentSection comments={comments} isLoading={commentsLoading} />
          )}
        </div>
      </Section>
      {/* Updated: closing CTA with dual conversion paths */}
      <Section variant="light" padding="md" className="rounded-b-[3rem]">
        <div className="grid gap-8 text-center">
          <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">Ready to join the movement?</h2>
          <p className="mx-auto max-w-2xl text-base text-slate-600 md:text-lg">
            From volunteering to cheering in the stands, there is a place for you at GAFC Rotterdam. Let's craft memories that echo across the city.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-full bg-brand-green-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:bg-brand-green-700"
            >
              <Calendar className="h-4 w-4" />
              Browse events
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-transform duration-200 hover:-translate-y-1 hover:border-brand-green-500 hover:text-brand-green-600"
            >
              <Phone className="h-4 w-4" />
              Connect with us
            </Link>
          </div>
        </div>
      </Section>
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Highlight video"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsVideoOpen(false)}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/60 px-4 py-2 text-sm font-medium text-white transition hover:bg-black/80"
              >
                Close
              </button>
            </div>
            <div className="mt-4 aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl">
              <iframe
                src="https://www.youtube.com/embed/1-7jUzKJe5g?autoplay=1"
                title="GAFC Rotterdam Highlights"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;




















