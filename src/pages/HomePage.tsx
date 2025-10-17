import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Users, Image as GalleryIcon, ArrowRight, Play, Trophy, ShieldCheck, Sparkles, Phone,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
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
import { useScrollAnimation, useStaggerAnimation } from '../hooks/useScrollAnimation';
import heroImage from '../Images/CountryImages.png';

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

  // Animation hooks
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const eventsAnimation = useScrollAnimation({ threshold: 0.1 });
  const { ref: galleryRef, visibleItems: visibleGalleryItems } = useStaggerAnimation(6, 80);
  const organizersAnimation = useScrollAnimation({ threshold: 0.1 });

  useEffect(() => {
    // TEMPORARY FIX: Removed filters until Firestore indexes are created
    // After creating indexes via Firebase Console, restore: active: true, approved: true
    fetchEvents({ page: 1, limit: 6 }); // removed: active: true
    fetchOrganizers({}); // removed: active: true
    fetchImages({ page: 1, limit: 9 });
    fetchComments({ limit: 6 }); // removed: approved: true
  }, [fetchEvents, fetchOrganizers, fetchImages, fetchComments]);


  const featuredEvents = events ? events.slice(0, 3) : [];
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="">
      {/* Modern Hero Section with Parallax */}
      <Section
        padding="lg"
        variant="default"
        containerMode="full"
        className="h-screen relative overflow-hidden"
        containerClassName="px-0"
      >
        <div className="relative w-full overflow-hidden h-screen">
          {/* Parallax Background Image */}
          <motion.div
            style={{ y: heroY }}
            className="absolute inset-0 h-[120vh] w-full"
          >
            <img
              src={heroImage}
              alt="Community background"
              className="h-full top-20 w-full object-cover"
            />
          </motion.div>

          {/* Gradient Overlay with Animation */}
          <motion.div
            style={{ opacity: heroOpacity }}
            className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/70 to-black/20"
          />

          {/* Animated Grid Pattern Overlay */}
          <div className="absolute inset-0 hero-pattern opacity-30" />

          {/* Hero Content */}
          <div className="relative mx-auto flex min-h-[85vh] mt-20 w-full flex-col gap-8 lg:gap-20 px-4 sm:px-6 py-16 sm:py-24 lg:flex-row lg:items-center lg:px-10 xl:px-12 lg:max-w-[90%]">
            {/* Main Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-6xl space-y-4 sm:space-y-6 lg:space-y-8 text-grey-100 glass backdrop-blur-xl bg-white/70 shadow-2xl shadow-white/20 p-6 sm:p-8 lg:p-12 xl:p-20 w-full rounded-2xl sm:rounded-3xl mx-auto lg:mx-0"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 sm:px-4 py-2 text-xs font-semibold uppercase tracking-[0.3px] text-slate-600"
              >
                Welcome to Our Community Where
              </motion.span>

              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-2xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight"
                  >
                    <AnimatedText
                      texts={heroTexts}
                      className="bg-gradient-to-r from-black/70 via-green-700 to-gray-600 bg-clip-text text-transparent"
                    />
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black/70"
                  >
                    Defines Us
                  </motion.div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="max-w-xl text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-800"
                >
                  Discover moments that ignite pride, purpose, and opportunity. From match days to mentorship, we celebrate the Rotterdam community with unforgettable experiences.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 sm:gap-4"
              >
                <Link
                  to="/events"
                  className="flex-1 xs:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-brand-green-600 px-4 sm:px-6 py-3 text-xs xs:text-sm font-semibold text-white shadow-soft hover-lift hover:bg-brand-green-700 hover:shadow-glow-green transition-all duration-300"
                >
                  <Calendar className="h-4 w-4" />
                  Explore Events
                </Link>
                <button
                  type="button"
                  onClick={() => setIsVideoOpen(true)}
                  className="flex-1 xs:flex-none inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-3 text-xs xs:text-sm font-semibold text-gray-800 hover-lift hover:border-brand-green-500 hover:bg-white/20 hover:text-gray-900 transition-all duration-300"
                >
                  <Play className="h-4 w-4" />
                  Watch Highlights
                </button>
              </motion.div>
            </motion.div>

            {/* Upcoming Events Sidebar - Hidden on mobile, shown on desktop */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden lg:block w-full lg:max-w-xl rounded-3xl border border-slate-200 glass backdrop-blur-xl bg-white/90 p-6 shadow-xl"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Next on the calendar
              </p>
              <div className="mt-6 space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="h-20 rounded-2xl skeleton" />
                    ))}
                  </div>
                ) : featuredEvents.length > 0 ? (
                  <div className="space-y-4">
                    {featuredEvents.map((event, index) => (
                      <motion.div
                        key={event._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <Link
                          to={`/events/${event._id}`}
                          className="group block rounded-2xl border border-slate-200 bg-slate-50 p-4 hover-lift hover:border-brand-green-500/60 hover:shadow-md transition-all duration-300"
                        >
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{formatDate(event.date)}</p>
                          <p className="mt-2 text-base sm:text-lg font-semibold text-slate-900 group-hover:text-brand-green-600 transition-colors">{event.title}</p>
                          <p className="mt-1 text-sm text-slate-600">{event.location}</p>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600">{error ? error : 'No events scheduled yet. Check back soon.'}</p>
                )}
              </div>
              <Link
                to="/events"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-green-700 transition-colors hover:text-brand-green-800 hover:gap-3"
              >
                View all events
                <ArrowRight className="h-4 w-4 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </Section>
      
      {/* Mobile Calendar Section - Only visible on mobile */}
      <Section variant="light" padding="md" className="block lg:hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <div className="rounded-3xl border border-slate-200 glass backdrop-blur-xl bg-white/90 p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 mb-6">
              Next on the calendar
            </p>
            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-20 rounded-2xl skeleton" />
                  ))}
                </div>
              ) : featuredEvents.length > 0 ? (
                <div className="space-y-4">
                  {featuredEvents.map((event, index) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={`/events/${event._id}`}
                        className="group block rounded-2xl border border-slate-200 bg-slate-50 p-4 hover-lift hover:border-brand-green-500/60 hover:shadow-md transition-all duration-300"
                      >
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{formatDate(event.date)}</p>
                        <p className="mt-2 text-base font-semibold text-slate-900 group-hover:text-brand-green-600 transition-colors">{event.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{event.location}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600">{error ? error : 'No events scheduled yet. Check back soon.'}</p>
              )}
            </div>
            <Link
              to="/events"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-green-700 transition-colors hover:text-brand-green-800 hover:gap-3"
            >
              View all events
              <ArrowRight className="h-4 w-4 transition-transform" />
            </Link>
          </div>
        </motion.div>
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
            <img src={heroImage} alt="Community highlight" className="h-full w-full object-cover" />
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
      <Section variant="light">
        <AboutUsSection />
      </Section>

      {/* Enhanced Events Section with Scroll Animations */}
      <Section variant="light" className="mb-20">
        <motion.div
          ref={eventsAnimation.ref}
          initial={{ opacity: 0, y: 40 }}
          animate={eventsAnimation.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6 }}
          className="pt-12"
        >
          <SectionHeader
            className="text-center my-12"
            eyebrow="Upcoming Events"
            title="Match days, cultural nights, and learning spaces"
            description="Plan your calendar with experiences tailored for family, friends, and future leaders."
            tone="light"
          />
        </motion.div>

        {/* Mobile Carousel */}
        <div className="block md:hidden mt-12 px-5">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-80 rounded-3xl border border-slate-200 skeleton" />
              ))}
            </div>
          ) : events && events.length > 0 ? (
            <Swiper
              modules={[Pagination, Navigation, Autoplay]}
              spaceBetween={20}
              slidesPerView={1.2}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              className="events-swiper pb-12"
            >
              {events.slice(0, 6).map((event) => (
                <SwiperSlide key={event._id}>
                  <div className="h-full">
                    <EventCard event={event} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
              {error ? error : 'No events to display yet.'}
            </div>
          )}
        </div>

        {/* Desktop Grid */}
        <SectionContent className="hidden md:grid mt-12 grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-80 rounded-3xl border border-slate-200 skeleton" />
            ))
          ) : events && events.length > 0 ? (
            events.slice(0, 6).map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={eventsAnimation.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="h-full"
              >
                <EventCard event={event} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
              {error ? error : 'No events to display yet.'}
            </div>
          )}
        </SectionContent>

        <motion.div
          initial={{ opacity: 0 }}
          animate={eventsAnimation.isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 pb-20 flex justify-center"
        >
          <Link
            to="/events"
            className="inline-flex items-center gap-2 rounded-full bg-brand-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-green-700 hover:shadow-md transition-all duration-300"
          >
            <span>View all events</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </Section>

      {/* Updated: dedicated donation band uses new modular component */}
      <Section variant="default" className="mb-20">
        <SectionHeader
          eyebrow="Community Fund"
          className="text-center mt-10 mb-20"
          title="Build the future with us"
          description="Your support keeps programmes accessible, facilities thriving, and our next generation of leaders inspired."
        />
        <DonationCallout />
      </Section>

      {/* Redesigned Organisers Section with Enhanced Layout */}
      <Section variant="light" className="mb-20">
        {/* Container with responsive margins */}
        <div className="lg:mx-[6%] py-10 md:py-20">
          <motion.div
            ref={organizersAnimation.ref}
            initial={{ opacity: 0, y: 40 }}
            animate={organizersAnimation.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            {/* Enhanced Header */}
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold text-emerald-700 shadow-lg border border-emerald-200/50 mb-4 sm:mb-6">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              Our Organisers
            </span>
            
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 px-4">
              Meet the team driving{' '}
              <span className="bg-gradient-to-r from-blue-600 via-emerald-600 to-yellow-500 bg-clip-text text-transparent">
                every experience
              </span>
            </h2>
            
            <p className="text-sm xs:text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
              Dedicated professionals and volunteers ensuring every initiative feels crafted with care.
            </p>
          </motion.div>

          {/* Mobile Carousel */}
          <div className="block lg:hidden mb-16">
            {orgLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-80 rounded-3xl border border-slate-200 skeleton" />
                ))}
              </div>
            ) : organizers && organizers.length > 0 ? (
              <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                spaceBetween={16}
                slidesPerView={1.1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                className="organizers-swiper pb-12"
              >
                {organizers.slice(0, 6).map((organizer) => (
                  <SwiperSlide key={organizer._id}>
                    <div className="h-[45dvh] w-full object-cover">
                      <OrganizerCard organizer={organizer} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
                {orgError ? orgError : 'No organizers to display yet.'}
              </div>
            )}
          </div>

          {/* Enhanced Organizers Grid */}
          <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {orgLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="group">
                  <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.1)] border border-slate-100/50">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full animate-pulse"></div>
                    <div className="h-6 bg-slate-200 rounded-lg mb-3 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded-lg mb-4 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-slate-200 rounded w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : organizers && organizers.length > 0 ? (
              organizers.slice(0, 6).map((organizer, index) => (
                <motion.div
                  key={organizer._id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={organizersAnimation.isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="group h-[45dvh] w-full"
                >
                  <OrganizerCard organizer={organizer} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-16 text-center border border-slate-200/50">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-12 w-12 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    No organisers to display yet
                  </h3>
                  <p className="text-slate-600 text-lg">
                    {orgError ? orgError : 'Our organizer profiles are being updated. Check back soon!'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={organizersAnimation.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex justify-center"
          >
            <Link
              to="/organizers"
              className="group inline-flex items-center gap-3 rounded-full bg-brand-green-600 px-8 py-4 text-base font-semibold text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-brand-green-700"
            >
              <span>Meet all organisers</span>
              <Users className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* Enhanced Gallery with Staggered Animations */}
      <Section variant="subtle">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="pt-12"
        >
          <SectionHeader
            eyebrow="Gallery"
            title="Moments we never stop talking about"
            description="Relive the energy of our favourite matches, festivals, and community launches."
          />
        </motion.div>

        {/* Mobile Carousel */}
        <div className="block md:hidden my-12 px-5">
          {galleryLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="aspect-square rounded-3xl border border-white/10 skeleton" />
              ))}
            </div>
          ) : galleryImages && galleryImages.length > 0 ? (
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1.3}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              className="gallery-swiper pb-12"
            >
              {galleryImages.slice(0, 6).map((image) => (
                <SwiperSlide key={image._id}>
                  <div className="group relative overflow-hidden rounded-3xl border border-white/10 hover:border-brand-green-500/40 transition-all duration-300">
                    <div className="hover-scale">
                      <GalleryImage image={image} />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70">
              {galleryError ? galleryError : 'No gallery images yet.'}
            </div>
          )}
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:block">
          <div ref={galleryRef}>
            <SectionContent className="my-12 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {galleryLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="aspect-square rounded-3xl border border-white/10 skeleton" />
              ))
            ) : galleryImages && galleryImages.length > 0 ? (
              galleryImages.slice(0, 6).map((image, index) => (
                <motion.div
                  key={image._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={
                    visibleGalleryItems.includes(index)
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.9 }
                  }
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 hover:border-brand-green-500/40 transition-all duration-300"
                >
                  <div className="hover-scale">
                    <GalleryImage image={image} />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70">
                {galleryError ? galleryError : 'No gallery images yet.'}
              </div>
            )}
            </SectionContent>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-20 pb-20 flex justify-center"
        >
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 rounded-full bg-brand-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-green-700 hover:shadow-md transition-all duration-300"
          >
            <span>View full gallery</span>
            <GalleryIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
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
      {/* Enhanced Closing CTA with Animations */}
      <Section variant="light" padding="md" className="rounded-b-[3rem]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="grid gap-6 sm:gap-8 text-center"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl sm:text-3xl font-semibold text-slate-900 md:text-4xl lg:text-5xl"
          >
            Ready to join the movement?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600 md:text-lg leading-relaxed px-4"
          >
            From volunteering to cheering in the stands, there is a place for you at GAFC Rotterdam. Let's craft memories that echo across the city.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-4"
          >
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-green-600 px-6 py-3 text-sm font-semibold text-white shadow-soft hover-lift hover:bg-brand-green-700 hover:shadow-glow-green transition-all duration-300"
            >
              <Calendar className="h-4 w-4" />
              Browse events
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-green-700 hover:shadow-md transition-all duration-300"
            >
              <Phone className="h-4 w-4" />
              Connect with us
            </Link>
          </motion.div>
        </motion.div>
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




















