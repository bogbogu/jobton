import { useContactFormService } from "../services/useContactFormService";

const ContactForm = () => {
  const { formData, handleChange, handleSubmit } = useContactFormService();

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto rounded-lg border border-slate-200 p-8 space-y-6">
            <h3 className="text-lg font-bold mb-10">Leave us a message</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label htmlFor="name">Your Name</label>
                    <input
                        onChange={handleChange}
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        placeholder="Name"
                        required
                        className="w-full rounded-md border border-gray-300 p-3"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email">Your Email</label>
                    <input
                        onChange={handleChange}
                        id="email"
                        name="email"
                        value={formData.email}
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full rounded-md border border-gray-300 p-3"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="subject">Subject</label>
                <input
                    onChange={handleChange}
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    type="text"
                    placeholder="Subject"
                    required
                    className="w-full rounded-md border border-gray-300 p-3"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="message">Message</label>
                <textarea
                    onChange={handleChange}
                    id="message"
                    name="message"
                    value={formData.message}
                    placeholder="Message"
                    rows={6}
                    required
                    className="w-full rounded-md border border-gray-300 p-3 resize-none"
                />
            </div>

            <button
                type="submit"
                className="rounded-md bg-blue-600 bg-[#6593FC-] px-6 py-3 text-white hover:bg-blue-700"
            >
                Send Message
            </button>
        </form>
    );
};

export default ContactForm;