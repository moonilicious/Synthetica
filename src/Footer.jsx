import React from "react";
import {
  Box,
  FooterContainer,
  Column,
  Row,
  Heading,
  FooterImg,
  FooterImage,
  Icon,
  Text,
  IconRow,
  CopyBox
} from "./FooterStyles";
import logoImage from "./SYNTHETICA.webp";
import contact from "./Group 81.webp";
import Coming from "./Coming soon1.webp";
import gmailIcon from "./google 1.webp";
import instagramIcon from "./instagram 1.webp";
import linkedinIcon from "./linkedin 1.webp";
import { CopyBoxUp } from "./FooterStyles";
const Footer = () => {
  return (
    <Box>
      <FooterContainer>
        <Row>
          <Column>
            <FooterImage src={logoImage} alt="SYNTHETICA" />
            <Text>The most trusted Text Detective</Text>
          </Column>
          <Column>
            <FooterImage src={Coming} alt="Coming" />
            <Text>Plagiarism Detector</Text>
            <Text>Img/Video Authentication</Text>
            <Text>Deepfake Detection</Text>
            <Text>API Support</Text>
          </Column>
          <Column>
            <FooterImg src={contact} alt="CONTACT" />
            <IconRow>
              <a href="#">
                <Icon src={gmailIcon} alt="Gmail" />
              </a>
              <a href="#">
                <Icon src={instagramIcon} alt="Instagram" />
              </a>
              <a href="#">
                <Icon src={linkedinIcon} alt="LinkedIn" />
              </a>
            </IconRow>
            <Text>+91 7249478960</Text>
            <Text>+91 9867029285</Text>
          </Column>
        </Row>
      </FooterContainer>
      <CopyBox>
        <FooterContainer>
          <Text>&copy; 2024 Synthetica.in</Text>
        </FooterContainer>
      </CopyBox>
    </Box>
  );
};

export default Footer;
