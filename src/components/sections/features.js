import React from 'react';
import styled from 'styled-components';

import { Section, Container } from '../global';

const HowItWorks = () => (
  <Section id="how-it-works">
    <StyledContainer>
      <Subtitle>How it works</Subtitle>
      <SectionTitle>Work Smarter</SectionTitle>
      <FeaturesGrid>
        <FeatureItem>
          <FeatureTitle>Import CSV</FeatureTitle>
          <FeatureText>
            Upload a csv of containing:
            <li>the business name</li>
            <li>city of operation</li>
            <li>rovince of operation</li>
            for any business you wish to get expanded contact or location information for.
          </FeatureText>
        </FeatureItem>
        <FeatureItem>
          <FeatureTitle>Enter your payment information</FeatureTitle>
          <FeatureText>
            Upon a successful upload, enter in your payment information to receive the list of contacts.
          </FeatureText>
        </FeatureItem>
        <FeatureItem>
          <FeatureTitle>Check your inbox</FeatureTitle>
          <FeatureText>
            Your receipt and resulting file will be emailed to you.
          </FeatureText>
        </FeatureItem>
      </FeaturesGrid>
    </StyledContainer>
  </Section>
);

export default HowItWorks;

const StyledContainer = styled(Container)``;

const SectionTitle = styled.h3`
  color: ${(props) => props.theme.color.primary};
  display: flex;
  justify-content: center;
  margin: 0 auto 40px;
  text-align: center;
`;

const Subtitle = styled.h5`
  font-size: 16px;
  color: ${(props) => props.theme.color.accent};
  letter-spacing: 0px;
  margin-bottom: 12px;
  text-align: center;
`;

const FeaturesGrid = styled.div`
  max-width: 670px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0px auto;
  grid-column-gap: 40px;
  grid-row-gap: 35px;
  @media (max-width: ${(props) => props.theme.screen.sm}) {
    grid-template-columns: 1fr;
    padding: 0 64px;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const FeatureTitle = styled.h4`
  color: ${(props) => props.theme.color.primary};
  letter-spacing: 0px;
  line-height: 30px;
  margin-bottom: 10px;
`;

const FeatureText = styled.p`
  text-align: center;
`;
