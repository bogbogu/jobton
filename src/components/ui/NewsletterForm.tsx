import { useNewsletterFormService } from "./useNewsletterFormService";

const NewsletterForm = () => {
  const { email, handleChange, handleSubmit } = useNewsletterFormService();

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-lg bg-white p-2 rounded-3xl sm:rounded-full"
    >
      <input
        type="email"
        name="newsletterEmail"
        value={email}
        onChange={handleChange}
        placeholder="Enter your email"
        required
        className="w-full flex-1 text-sm sm:text-base px-4 sm:px-5 py-3 rounded-full text-slate-900 bg-white outline-none"
      />
      <button
        type="submit"
        className="bg-slate-900 text-white px-6 py-3 text-sm rounded-full font-semibold hover:opacity-90"
      >
        Subscribe
      </button>
    </form>
  );
};

export default NewsletterForm;
