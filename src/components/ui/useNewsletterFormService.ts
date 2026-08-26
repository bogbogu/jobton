import { useState } from "react";
import { newsletterService } from "../../services/newsletter.service";

export const useNewsletterFormService = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setStatusMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setStatusMessage(null);
    setIsError(false);

    try {
      const { message } = await newsletterService.subscribe(email.trim());
      setStatusMessage(message);
      setEmail("");
    } catch (error) {
      setIsError(true);
      setStatusMessage(error instanceof Error ? error.message : "Unable to subscribe right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { email, handleChange, handleSubmit, isSubmitting, statusMessage, isError };
};
