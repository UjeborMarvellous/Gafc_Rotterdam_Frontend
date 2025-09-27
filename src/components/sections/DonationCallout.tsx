import React from 'react';
import toast from 'react-hot-toast';
import { Heart, ShieldCheck, Sparkles, Gift } from 'lucide-react';
import { Section, SectionHeader, SectionContent } from '../layout/Section';

const DonationCallout: React.FC = () => {
  const handleComingSoon = () => {
    toast.success('Our donation centre is coming online soon. Thank you for your support!');
  };

  return (
    <Section id="donate" variant="light" className="rounded-3xl shadow-inner">
      <div className="grid my-20 py-10 gap-10 lg:grid-cols-[1.1fr_minmax(0,_0.9fr)] lg:items-center">
        <div className="space-y-8">
          <SectionHeader
            eyebrow="Community Fund"
            title="Fuel our mission to uplift the community"
            description="Every contribution powers scholarships, youth programmes, and the cultural experiences that keep our heritage thriving in Rotterdam."
            align="left"
            tone="light"
            className="text-left"
          >
            <div className="mt-6 grid gap-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-brand-green-600" />
                <span>Transparent quarterly impact reports keep you connected to the results of your support.</span>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 h-5 w-5 text-blue-500" />
                <span>Choose between one-off gifts or set a monthly boost when we launch the full donation flow.</span>
              </div>
            </div>
          </SectionHeader>

          {/* Updated: CTA block invites action while backend work remains untouched */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleComingSoon}
              className="inline-flex items-center gap-2 rounded-full bg-brand-green-600 px-6 py-3 text-slate-50 shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:bg-brand-green-700"
            >
              <Heart className="h-5 w-5 text-white" />
              Make a Donation
            </button>
            <button
              type="button"
              onClick={handleComingSoon}
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900"
            >
              View Impact Plan
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-[#f7f7f7] p-8 shadow-lg">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">What your gift unlocks</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">Impact snapshot</h3>
            </div>
            <SectionContent className="mt-0 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-600">EUR 25</p>
                <p className="mt-2 text-base font-semibold text-slate-900">Training kits for aspiring youth players</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-600">EUR 60</p>
                <p className="mt-2 text-base font-semibold text-slate-900">Community workshops celebrating Our community heritage</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-600">EUR 120</p>
                <p className="mt-2 text-base font-semibold text-slate-900">Scholarship support for grassroots organisers</p>
              </div>
            </SectionContent>
            <div className="flex items-center gap-3 rounded-2xl border border-brand-green-500/40 bg-brand-green-500/15 px-4 py-3 text-sm text-slate-700">
              <Gift className="h-5 w-5 text-brand-green-600" />
              <span>Custom giving levels and receipts will arrive with the backend integration.</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default DonationCallout;
