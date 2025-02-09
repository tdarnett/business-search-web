import React from 'react';

import Layout from '../components/common/layout/layout';
import SEO from '../components/common/layout/seo';
import Navigation from '../components/common/navigation/navigation';

import Header from '../components/sections/header';
import HowItWorks from '../components/sections/howItWorks';
import Footer from '../components/sections/footer';

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Navigation />
    <Header />
    <HowItWorks />
    <Footer />
  </Layout>
);

export default IndexPage;
