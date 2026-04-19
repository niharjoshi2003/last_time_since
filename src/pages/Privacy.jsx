import React from 'react';
import Layout from '../components/layout/Layout';

const Privacy = () => (
  <Layout>
    <div className="page-content">
      <h1>Privacy Policy</h1>
      <p><em>Last updated: April 2026</em></p>
      <h2>Where your data lives</h2>
      <p>
        Last Time Since stores your tasks only in your browser, using <strong>localStorage</strong>
        {' '}(key <code>lasttimesince_tasks</code>). Nothing is sent to our servers because the app
        does not use a backend for task data. There is no account system and no cloud database for
        your tasks.
      </p>
      <h2>What we do not collect</h2>
      <p>
        We do not collect your email, password, or task content on our infrastructure. If you use a
        hosting provider to view the site, that provider may process routine technical data (such as
        IP address or access logs) according to their own policies.
      </p>
      <h2>Theme preference</h2>
      <p>
        Your light/dark theme choice may be saved in <code>localStorage</code> on your device so the
        app remembers it between visits.
      </p>
      <h2>Clearing data</h2>
      <p>
        Removing site data or cache for this origin in your browser will delete stored tasks. Export
        or backup is not built into the app today; keep anything important copied elsewhere if you
        need it.
      </p>
      <h2>Contact</h2>
      <p>For questions about this policy, open an issue on the project repository or contact the maintainer.</p>
    </div>
  </Layout>
);

export default Privacy;
