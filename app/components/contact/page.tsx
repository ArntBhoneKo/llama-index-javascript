"use client";

import React, { useState } from 'react';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error on change
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateEmail = (email: string) => {
    // Simple email regex
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validate = () => {
    let isValid = true;
    const errors: typeof formErrors = { name: '', email: '', subject: '', message: '' };

    if (!formData.name.trim()) {
      errors.name = 'Name is required.';
      isValid = false;
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address.';
      isValid = false;
    }
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required.';
      isValid = false;
    }
    if (!formData.message.trim()) {
      errors.message = 'Message is required.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // For now just simulate successful submission
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          background-color: #121212;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #eee;
        }
        .container {
          max-width: 600px;
          margin: 3rem auto;
          background: #1e1e1e;
          padding: 2rem 2.5rem;
          border-radius: 12px;
          box-shadow: 0 0 20px rgba(255 255 255 / 0.1);
          border: 1px solid #333;
        }
        h1 {
          margin-bottom: 1.5rem;
          font-weight: 700;
          text-align: center;
          color: #f39c12;
          text-shadow: 0 0 10px #f39c12aa;
        }
        label {
          display: block;
          margin-bottom: 0.4rem;
          font-weight: 600;
        }
        input[type="text"],
        input[type="email"],
        textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          margin-bottom: 1.2rem;
          border: 1.5px solid #444;
          border-radius: 8px;
          background: #121212;
          color: #eee;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          outline: none;
          box-shadow: inset 0 0 8px #000000aa;
        }
        input[type="text"]:focus,
        input[type="email"]:focus,
        textarea:focus {
          border-color: #f39c12;
          box-shadow: 0 0 8px #f39c12cc;
          background: #1b1b1b;
        }
        textarea {
          min-height: 120px;
          resize: vertical;
          font-family: inherit;
        }
        .error {
          color: #e74c3c;
          font-size: 0.875rem;
          margin-top: -1rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        button {
          display: block;
          width: 100%;
          padding: 0.85rem 0;
          background: #f39c12;
          border: none;
          border-radius: 8px;
          color: #121212;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 12px #f39c12aa;
        }
        button:hover {
          background-color: #d4890f;
          box-shadow: 0 6px 18px #d4890fcc;
        }
        button:focus {
          outline: 3px solid #f39c1211;
          outline-offset: 2px;
        }
        .success-message {
          text-align: center;
          color: #2ecc71;
          font-weight: 600;
          margin-top: 1rem;
          font-size: 1.1rem;
          text-shadow: 0 0 8px #2ecc71cc;
        }
      `}</style>
      <div className="container" role="main" aria-labelledby="contactHeading">
        <h1 id="contactHeading">Contact Us</h1>
        <form noValidate onSubmit={handleSubmit} aria-describedby="formInstructions">
          <p id="formInstructions" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#bbb' }}>
            Please fill out the form below and we will get back to you promptly.
          </p>
          <label htmlFor="name">Name<span aria-hidden="true" style={{color:'#e74c3c'}}>*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            aria-required="true"
            value={formData.name}
            onChange={handleChange}
            aria-invalid={!!formErrors.name}
            aria-describedby={formErrors.name ? "name-error" : undefined}
            autoComplete="name"
          />
          {formErrors.name && <div className="error" id="name-error">{formErrors.name}</div>}

          <label htmlFor="email">Email<span aria-hidden="true" style={{color:'#e74c3c'}}>*</span></label>
          <input
            type="email"
            id="email"
            name="email"
            aria-required="true"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!formErrors.email}
            aria-describedby={formErrors.email ? "email-error" : undefined}
            autoComplete="email"
          />
          {formErrors.email && <div className="error" id="email-error">{formErrors.email}</div>}

          <label htmlFor="subject">Subject<span aria-hidden="true" style={{color:'#e74c3c'}}>*</span></label>
          <input
            type="text"
            id="subject"
            name="subject"
            aria-required="true"
            value={formData.subject}
            onChange={handleChange}
            aria-invalid={!!formErrors.subject}
            aria-describedby={formErrors.subject ? "subject-error" : undefined}
          />
          {formErrors.subject && <div className="error" id="subject-error">{formErrors.subject}</div>}

          <label htmlFor="message">Message<span aria-hidden="true" style={{color:'#e74c3c'}}>*</span></label>
          <textarea
            id="message"
            name="message"
            aria-required="true"
            value={formData.message}
            onChange={handleChange}
            aria-invalid={!!formErrors.message}
            aria-describedby={formErrors.message ? "message-error" : undefined}
          ></textarea>
          {formErrors.message && <div className="error" id="message-error">{formErrors.message}</div>}

          <button type="submit" aria-label="Submit contact form">Send Message</button>
          {submitted && (
            <p className="success-message" role="alert">
              Thank you for contacting us! We will get back to you soon.
            </p>
          )}
        </form>
      </div>
    </>
  );
};

export default ContactUs;