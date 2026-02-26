import React from 'react';
import Layout from '../components/layout/Layout';

const Privacy = () => (
  <Layout>
    <div className="page-content">
      <h1>Privacy Policy</h1>
      <p><em>Last updated: February 2025</em></p>
      <h2>Data We Collect</h2>
      <p>
        <strong>Guest mode:</strong> All data (tasks, labels, dates) is stored only in your browser&apos;s localStorage. We do not collect or transmit any data from guest users.
      </p>
      <p>
        <strong>Cloud mode:</strong> When you sign up, your tasks are stored in Supabase (PostgreSQL) under your account. We store your email and task data to enable sync across devices.
      </p>
      <h2>How We Use Your Data</h2>
      <p>We use your data only to provide the app&apos;s functionality: displaying your tasks, syncing across devices when you use cloud mode, and persisting your preferences (e.g. theme).</p>
      <h2>Data Sharing</h2>
      <p>We do not sell or share your personal data with third parties. Supabase (our backend provider) processes data according to their privacy policy for service operation.</p>
      <h2>Security</h2>
      <p>Data in cloud mode is protected by Supabase security measures, including encryption and Row Level Security (RLS) so only you can access your tasks.</p>
      <h2>Contact</h2>
      <p>For questions about this privacy policy, please open an issue on the project repository or contact the maintainer.</p>
    </div>
  </Layout>
);

export default Privacy;
