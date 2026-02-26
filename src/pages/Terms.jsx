import React from 'react';
import Layout from '../components/layout/Layout';

const Terms = () => (
  <Layout>
    <div className="page-content">
      <h1>Terms of Service</h1>
      <p><em>Last updated: February 2025</em></p>
      <h2>Acceptance of Terms</h2>
      <p>By using Last Time Since, you agree to these Terms of Service. If you do not agree, please do not use the app.</p>
      <h2>Use of the Service</h2>
      <p>Last Time Since is a personal tracking tool. You may use it for lawful purposes only. You are responsible for the content of your tasks and for keeping your account credentials secure.</p>
      <h2>Data & Privacy</h2>
      <p>Your use of the app is subject to our Privacy Policy. Guest mode stores data locally; cloud mode stores data in Supabase. You can delete your account and data at any time.</p>
      <h2>Disclaimer</h2>
      <p>The service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee uninterrupted access or that the service will be error-free. Use at your own risk.</p>
      <h2>Changes</h2>
      <p>We may update these terms. Continued use of the service after changes constitutes acceptance of the new terms.</p>
    </div>
  </Layout>
);

export default Terms;
