import { useState } from "react";

export const useNewsletterFormService = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire up to backend
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return { email, handleChange, handleSubmit };
};
