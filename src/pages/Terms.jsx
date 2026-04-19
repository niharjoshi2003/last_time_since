import React from 'react';
import Layout from '../components/layout/Layout';

const Terms = () => (
  <Layout>
    <div className="page-content">
      <h1>Terms of Service</h1>
      <p><em>Last updated: April 2026</em></p>
      <h2>Acceptance of terms</h2>
      <p>By using Last Time Since, you agree to these terms. If you do not agree, please do not use the app.</p>
      <h2>Use of the service</h2>
      <p>
        Last Time Since is a personal tracking tool. You may use it for lawful purposes only. You are
        responsible for the content you enter. The app does not provide accounts; data stays on your
        device unless you copy it elsewhere.
      </p>
      <h2>Data &amp; privacy</h2>
      <p>
        Your use of the app is subject to our Privacy Policy. Tasks are stored locally in your browser;
        clearing site data will remove them.
      </p>
      <h2>Disclaimer</h2>
      <p>
        The service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee
        uninterrupted access or that the service will be error-free. Use at your own risk.
      </p>
      <h2>Changes</h2>
      <p>We may update these terms. Continued use after changes constitutes acceptance of the new terms.</p>
    </div>
  </Layout>
);

export default Terms;
