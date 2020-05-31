import React, { useState } from 'react';
import styled from 'styled-components';
import { graphql, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';
import { loadStripe } from '@stripe/stripe-js';

import { Container } from '../global';
import FileUpload from '../FileUpload';
import StripeCheckout from '../StripeCheckout';

const stripePromise = loadStripe('pk_test_qOdhx6FZqIhHz5w4pDumRrA5');

const Header = () => {
  const data = useStaticQuery(graphql`
    query {
      file(sourceInstanceName: { eq: "product" }, name: { eq: "green-skew" }) {
        childImageSharp {
          fluid(maxWidth: 1000) {
            ...GatsbyImageSharpFluid_tracedSVG
          }
        }
      }
    }
  `);

  const [progressConfig, setProgressConfig] = useState({ step: 0, filename: '', amount: null, clientSecret: null });

  return (
    <HeaderWrapper id="top">
      <Container>
        <Flex>
          <HeaderTextGroup>
            <Subtitle>Upload</Subtitle>
            <h1>Speed up your business development.</h1>
            <h2>Upload your list of business leads and get their business information in one fell swoop.</h2>

            {progressConfig.step === 0 && <FileUpload setProgressConfig={setProgressConfig} />}
            {progressConfig.step === 1 && (
              <StripeCheckout
                stripePromise={stripePromise}
                progressConfig={progressConfig}
                setProgressConfig={setProgressConfig}
              />
            )}
            {progressConfig.step === 2 && (
              <div>Payment succeeded, please check your inbox! Refresh to use this again :)</div>
            )}
          </HeaderTextGroup>
          <ImageWrapper>
            <StyledImage fluid={data.file.childImageSharp.fluid} />
            <br />
          </ImageWrapper>
        </Flex>
      </Container>
    </HeaderWrapper>
  );
};

export default Header;

const HeaderWrapper = styled.header`
  background-color: #f8f8f8;
  padding: 160px 0 80px 0;
  position: relative;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 5vw));
  @media (max-width: ${(props) => props.theme.screen.md}) {
  }
`;
const Subtitle = styled.h5`
  font-size: 16px;
  color: ${(props) => props.theme.color.accent};
  letter-spacing: 0px;
  margin-bottom: 16px;
`;

const HeaderTextGroup = styled.div`
  margin: 0;

  > div {
    width: 120%;
    margin-bottom: -4.5%;

    @media (max-width: ${(props) => props.theme.screen.md}) {
      margin: 0 16px;
    }
  }

  h1 {
    margin: 0 0 24px;
    color: ${(props) => props.theme.color.primary};
  }

  h2 {
    margin-bottom: 24px;
    ${(props) => props.theme.font_size.regular}
  }

  p {
    margin-bottom: 48px;
  }
`;

const Flex = styled.div`
  display: grid;
  justify-content: space-between;
  align-content: center;
  grid-template-columns: 1fr 1fr;
  @media (max-width: ${(props) => props.theme.screen.md}) {
    grid-template-columns: 1fr;
    grid-gap: 64px;
  }
`;

const ImageWrapper = styled.div`
  justify-self: end;
  align-self: center;
  @media (max-width: ${(props) => props.theme.screen.md}) {
    justify-self: center;
  }
`;

const StyledImage = styled(Img)`
  width: 500px;
  @media (max-width: ${(props) => props.theme.screen.md}) {
    width: 400px;
  }
  @media (max-width: ${(props) => props.theme.screen.sm}) {
    width: 300px;
    display: none;
  }
`;
