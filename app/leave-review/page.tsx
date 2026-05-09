import LeaveReviewForm from "@/components/LeaveReviewForm";

export const metadata = {
  title: "Leave a Review | Samina Bilal",
  description:
    "Share your experience working with Samina Bilal — RE/MAX Galaxy Realtor, Northern Virginia & Maryland.",
};

export default function LeaveReviewPage() {
  return (
    <section className="min-h-screen bg-cream-soft pt-32 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        <p
          className="text-[0.65rem] tracking-[0.32em] uppercase text-ink/55 mb-3 text-center"
          style={{ fontWeight: 500 }}
        >
          Thank you
        </p>
        <h1
          className="text-3xl md:text-4xl text-ink text-center mb-4"
          style={{ fontWeight: 300, letterSpacing: "0.02em" }}
        >
          Leave Samina a review.
        </h1>
        <p className="text-sm md:text-base text-ink/70 text-center max-w-xl mx-auto mb-12 leading-relaxed">
          Your words help future first-time buyers and sellers know what to
          expect. Anything you share goes through Samina before it appears on
          her site — feel free to be honest.
        </p>

        <LeaveReviewForm />
      </div>
    </section>
  );
}
