import React from 'react';
import Layout from '../components/layout/Layout';

const About = () => (
  <Layout>
    <div className="page-content">
      <h1>About Last Time Since</h1>
      <p>
        Last Time Since helps you track how long it has been since you did something. Add events with
        dates and times, reset timers when you do them again, and watch the live elapsed display update
        every second.
      </p>
      <h2>Features</h2>
      <ul>
        <li><strong>Add tasks</strong> — Track habits, milestones, or anything personal.</li>
        <li><strong>People/group lanes</strong> — Keep multiple trackers under one person or category.</li>
        <li><strong>Reset</strong> — Jump the clock to &quot;now&quot; and keep a count of how often you reset.</li>
        <li><strong>Edit &amp; delete</strong> — Full control over labels, times, colors, and icons.</li>
        <li><strong>On-device storage</strong> — Tasks stay in your browser; no account required.</li>
        <li><strong>Themes</strong> — Light, dark, and crimson night mode, persisted locally.</li>
      </ul>
      <h2>Tech stack</h2>
      <p>Built with React 19, React Router, and Lucide icons. Persistence uses browser localStorage only.</p>
      <h2>Privacy</h2>
      <p>
        Your task data does not leave your device. See the Privacy page for details.
      </p>
    </div>
  </Layout>
);

export default About;
