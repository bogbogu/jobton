import { useNewsletterFormService } from "./useNewsletterFormService";

const NewsletterForm = () => {
  const { email, handleChange, handleSubmit, isSubmitting, statusMessage, isError } =
    useNewsletterFormService();

  return (
    <div className="mt-8 w-full max-w-lg">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 w-full bg-white p-2 rounded-3xl sm:rounded-full"
      >
        <input
          type="email"
          name="newsletterEmail"
          value={email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          disabled={isSubmitting}
          className="w-full flex-1 text-sm sm:text-base px-4 sm:px-5 py-3 rounded-full text-slate-900 bg-white outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-slate-900 text-white px-6 py-3 text-sm rounded-full font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {statusMessage && (
        <p className={`mt-2 text-sm px-2 ${isError ? "text-red-200" : "text-blue-100"}`}>
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default NewsletterForm;
