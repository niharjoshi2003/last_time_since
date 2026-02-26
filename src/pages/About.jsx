import React from 'react';
import Layout from '../components/layout/Layout';

const About = () => (
  <Layout>
    <div className="page-content">
      <h1>About Last Time Since</h1>
      <p>
        Last Time Since helps you track how long it&apos;s been since you did something. Add custom events with dates and times, and watch the live countdown update every second.
      </p>
      <h2>Features</h2>
      <ul>
        <li><strong>Add tasks</strong> — Track anything: &quot;last time I texted her,&quot; &quot;last time I exercised,&quot; or any personal milestone</li>
        <li><strong>Edit & delete</strong> — Full control over your tasks</li>
        <li><strong>Guest mode</strong> — Use immediately without signing up (data saved in browser)</li>
        <li><strong>Cloud sync</strong> — Optional Supabase account for cross-device access</li>
        <li><strong>Themes</strong> — Light, Dark, or Ultra Love (neon) mode</li>
      </ul>
      <h2>Tech Stack</h2>
      <p>Built with React 19, Supabase, and Lucide icons. Guest mode uses localStorage; cloud mode uses Supabase PostgreSQL.</p>
      <h2>Privacy</h2>
      <p>Guest mode keeps all data on your device. Cloud sync stores tasks in Supabase under your account. We don&apos;t sell or share your data.</p>
    </div>
  </Layout>
);

export default About;
