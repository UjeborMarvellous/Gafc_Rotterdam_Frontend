import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useOrganizersStore } from '../stores/organizersStore';
import OrganizerCard from '../components/OrganizerCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const OrganizersPage: React.FC = () => {
  const { organizers, fetchOrganizers, isLoading } = useOrganizersStore();

  const headerAnimation = useScrollAnimation();

  useEffect(() => {
    // TEMPORARY FIX: Removed filter until Firestore indexes are created
    fetchOrganizers({}); // removed: active: true
  }, [fetchOrganizers]);

  return (
    <>
      <div className="py-20">
        <Helmet>
          <title>Meet Our Organizers - GAFC Rotterdam</title>
          <meta name="description" content="Get to know the amazing people behind our GAFC Rotterdam community." />
        </Helmet>

        <div className="py-16">
          <div className="container-custom">
            {/* Header */}
            <motion.div
              ref={headerAnimation.ref}
              initial={{ opacity: 0, y: 30 }}
              animate={headerAnimation.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-16"
            >
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={headerAnimation.isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6"
              >
                <span className="bg-gradient-to-r from-green-600 via-blue-600 to-green-800 bg-clip-text text-transparent">
                  Meet Our Organizers
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={headerAnimation.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
              >
                Get to know the passionate leaders and dedicated individuals behind our thriving community
              </motion.p>
            </motion.div>

            {/* Organizers Grid */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : organizers.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.15
                    }
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {organizers.map((organizer, index) => (
                  <motion.div
                    key={organizer._id}
                    variants={{
                      hidden: { opacity: 0, y: 30, scale: 0.9 },
                      visible: { opacity: 1, y: 0, scale: 1 }
                    }}
                    transition={{
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ y: -8 }}
                    className="min-h-[500px]"
                  >
                    <OrganizerCard organizer={organizer} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-32 h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <span className="text-6xl">👥</span>
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-2xl font-bold text-slate-900 mb-3"
                >
                  No organizers to display
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-lg text-slate-600 max-w-md mx-auto"
                >
                  Our organizer profiles are being updated. Check back soon to meet our amazing team!
                </motion.p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganizersPage;
