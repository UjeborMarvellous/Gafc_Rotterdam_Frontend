import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Clock, MessageCircle, Instagram, Facebook, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { contactApi } from '../api/contact';
import { ContactMessageForm } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const contactMethods = [
  {
    title: 'Visit Us',
    description: 'Community Hub, Rotterdam, Netherlands',
    icon: MapPin,
    helper: 'Saturdays 10:00 - 16:00',
  },
  {
    title: 'Email',
    description: 'info@gafcrotterdam.com',
    icon: Mail,
    helper: 'We reply within 24 hours',
  },
  {
    title: 'Phone',
    description: '+31 123 456 789',
    icon: Phone,
    helper: 'Mon - Fri, 09:00 - 18:00',
  },
  {
    title: 'Team availability',
    description: 'Community support line',
    icon: Clock,
    helper: 'Always ready to help',
  },
];

const socialLinks = [
  {
    name: 'WhatsApp',
    href: '#',
    icon: MessageCircle,
  },
  {
    name: 'Instagram',
    href: '#',
    icon: Instagram,
  },
  {
    name: 'Facebook',
    href: '#',
    icon: Facebook,
  },
];

const contactMessageSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120, 'Name should be 120 characters or fewer'),
  email: z.string().trim().email('Please provide a valid email address'),
  subject: z
    .string()
    .trim()
    .max(160, 'Subject cannot exceed 160 characters')
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(10, 'Message should be at least 10 characters')
    .max(2000, 'Message cannot exceed 2000 characters'),
});

type ContactFormValues = z.infer<typeof contactMessageSchema>;

const ContactPage: React.FC = () => {
  const {
    register,
    handleSubmit: submitForm,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const headerAnimation = useScrollAnimation();
  const contactMethodsAnimation = useScrollAnimation();
  const formAnimation = useScrollAnimation();

  const onSubmit = async (values: ContactFormValues) => {
    const payload: ContactMessageForm = {
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    };

    const subject = values.subject?.trim();
    if (subject) {
      payload.subject = subject;
    }

    try {
      const response = await contactApi.submitMessage(payload);

      if (!response.success) {
        throw new Error(response.message || 'Failed to send your message');
      }

      toast.success('Thanks for reaching out! A member of the team will reply within 24 hours.');
      reset({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      const validationErrors = error?.response?.data?.errors;
      if (Array.isArray(validationErrors)) {
        validationErrors.forEach((validationError: any) => {
          if (validationError.param) {
            const field = validationError.param as keyof ContactFormValues;
            setError(field, {
              type: 'server',
              message: validationError.msg,
            });
          }
        });
      }

      toast.error(error?.response?.data?.message || error?.message || 'We could not send your message. Please try again.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - GAFC Rotterdam</title>
        <meta
          name="description"
          content="Get in touch with GAFC Rotterdam. We are here to support, collaborate, and welcome new members to our community."
        />
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-sky-50 py-20">
        <div className="absolute inset-x-0 top-0 -z-[1] h-32 bg-gradient-to-b from-white to-transparent" aria-hidden />
        <div className="container-custom">
          <motion.div
            ref={headerAnimation.ref}
            initial={{ opacity: 0, y: 30 }}
            animate={headerAnimation.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={headerAnimation.isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700"
            >
              Get in touch
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={headerAnimation.isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-5xl font-bold text-slate-900 md:text-6xl lg:text-7xl"
            >
              <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-800 bg-clip-text text-transparent">
                We are here for our community
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={headerAnimation.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 text-xl text-slate-600 md:text-2xl leading-relaxed"
            >
              Reach out for collaborations, volunteering, or to learn more about upcoming events. Our team loves hearing new ideas.
            </motion.p>
          </motion.div>

          <div className="mt-16 grid gap-12 lg:grid-cols-[1.05fr_minmax(0,_1fr)]">
            <div className="space-y-10">
              <motion.div
                ref={contactMethodsAnimation.ref}
                initial="hidden"
                animate={contactMethodsAnimation.isVisible ? "visible" : "hidden"}
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                className="grid gap-4 sm:grid-cols-2"
              >
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <motion.div
                      key={method.title}
                      variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.9 },
                        visible: { opacity: 1, y: 0, scale: 1 }
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut"
                      }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="rounded-3xl bg-white/70 p-6 shadow-[0_30px_70px_-45px_rgba(15,118,110,0.5)] backdrop-blur hover:shadow-[0_35px_90px_-45px_rgba(15,118,110,0.7)] transition-shadow duration-300"
                    >
                      <motion.span
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"
                      >
                        <Icon className="h-6 w-6" />
                      </motion.span>
                      <h3 className="mt-4 text-lg font-semibold text-slate-900">{method.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{method.description}</p>
                      <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-emerald-500">
                        {method.helper}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={contactMethodsAnimation.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap items-center gap-4 border-y border-emerald-100 py-6"
              >
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">
                  Follow us
                </p>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={contactMethodsAnimation.isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-600 hover:shadow-md"
                      >
                        <Icon className="h-4 w-4 transition group-hover:scale-110" />
                        {social.name}
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={contactMethodsAnimation.isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-6"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="relative overflow-hidden rounded-[32px] bg-white shadow-[0_35px_80px_-50px_rgba(15,118,110,0.6)] hover:shadow-[0_40px_100px_-50px_rgba(15,118,110,0.8)] transition-shadow duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/50 via-transparent to-blue-200/40" aria-hidden />
                <div className="relative h-[320px] w-full">
                  <iframe
                    title="GAFC Rotterdam location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9781.049653881367!2d4.476876!3d51.9244205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c434fdefa45d51%3A0x4b18c0be9a164a0a!2sRotterdam%2C%20Netherlands!5e0!3m2!1sen!2snl!4v1700000000000!5m2!1sen!2snl"
                    className="relative h-[320px] w-full border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={contactMethodsAnimation.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-3xl bg-white/80 p-6 shadow-[0_25px_65px_-45px_rgba(15,118,110,0.45)] backdrop-blur hover:shadow-[0_30px_80px_-45px_rgba(15,118,110,0.6)] transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold text-slate-900">Need a quick intro deck?</h3>
                <p className="mt-2 text-sm text-slate-600">
                  We have a one-pager showcasing our programmes, partners, and community impact. Request it when you message us.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              ref={formAnimation.ref}
              initial={{ opacity: 0, y: 40 }}
              animate={formAnimation.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="rounded-[32px] bg-white p-8 shadow-[0_45px_120px_-60px_rgba(15,118,110,0.5)] hover:shadow-[0_50px_140px_-60px_rgba(15,118,110,0.7)] transition-shadow duration-300"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formAnimation.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
                >
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">
                      Tell us how we can support you
                    </h2>
                    <p className="mt-2 text-base text-slate-600">
                      Share a few details and a member of our organising team will reply within one working day.
                    </p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={formAnimation.isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex items-center gap-3 rounded-2xl bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700"
                  >
                    <Send className="h-4 w-4" />
                    Response time: under 24 hours
                  </motion.div>
                </motion.div>

                <form onSubmit={submitForm(onSubmit)} className="mt-8 grid gap-6" noValidate>
                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">Name</span>
                      <input
                        type="text"
                        autoComplete="name"
                        {...register('name')}
                        className={`mt-2 w-full rounded-2xl border ${errors.name ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-200'} bg-white px-4 py-3 text-sm text-slate-700 shadow-inner focus:outline-none focus:ring-2`}
                        placeholder="Your full name"
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                      )}
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">Email</span>
                      <input
                        type="email"
                        autoComplete="email"
                        {...register('email')}
                        className={`mt-2 w-full rounded-2xl border ${errors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-200'} bg-white px-4 py-3 text-sm text-slate-700 shadow-inner focus:outline-none focus:ring-2`}
                        placeholder="you@example.com"
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                      )}
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Subject</span>
                    <input
                      type="text"
                      {...register('subject')}
                      className={`mt-2 w-full rounded-2xl border ${errors.subject ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-200'} bg-white px-4 py-3 text-sm text-slate-700 shadow-inner focus:outline-none focus:ring-2`}
                      placeholder="What would you like to talk about?"
                      aria-invalid={!!errors.subject}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>
                    )}
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Message</span>
                    <textarea
                      rows={5}
                      {...register('message')}
                      className={`mt-2 w-full rounded-2xl border ${errors.message ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-200'} bg-white px-4 py-3 text-sm text-slate-700 shadow-inner focus:outline-none focus:ring-2`}
                      placeholder="Share any details that will help us prepare."
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
                    )}
                  </label>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={formAnimation.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="text-xs text-slate-500">
                      By submitting this form you agree to let GAFC Rotterdam contact you about your request.
                    </p>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send message'}
                      <Send className="h-4 w-4" />
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;



